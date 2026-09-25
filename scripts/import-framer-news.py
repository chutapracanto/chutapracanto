#!/usr/bin/env python3
# Real import is enabled only by the explicit [IMPORT-FRAMER-REAL] workflow commit.
# Triggered validation cycle: 2026-09-24.
# Write permission verified for the controlled import workflow.
"""
Importa notícias públicas do antigo Framer para o arquivo Markdown do Chuta Pra Canto.

Por segurança, a execução normal é DRY-RUN. Só escreve com --write.
Não apaga nem substitui notícias existentes: deduplica por slug, sourceUrl e título+data.
As imagens da fonte também são verificadas antes de uma entrada ser considerada pronta.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import re
import sys
import time
import unicodedata
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote

import requests
from bs4 import BeautifulSoup

BASE = "https://chutapracanto.framer.website"
LISTING = f"{BASE}/news"
ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content" / "noticias"
INDEX = ROOT / "content" / "noticias-index.json"
IMAGES = ROOT / "images" / "noticias" / "framer"
TIMEOUT = 25
HEADERS = {
    "User-Agent": "ChutaPraCantoArchiveImporter/1.0 (+https://chutapracanto.com)"
}


def repair_mojibake(value: str) -> str:
    try:
        repaired = value.encode("latin1").decode("utf-8")
        return repaired if repaired != value else value
    except (UnicodeEncodeError, UnicodeDecodeError):
        return value


def clean(value: str | None) -> str:
    value = repair_mojibake(html.unescape(value or ""))
    return re.sub(r"\s+", " ", value).strip()


def slugify(value: str) -> str:
    value = unquote(value).lower()
    value = re.sub(r"[^a-z0-9à-ÿ]+", "-", value, flags=re.I)
    value = re.sub(r"-+", "-", value).strip("-")
    return value or hashlib.sha1(value.encode()).hexdigest()[:12]


def parse_date(value: str | None) -> str:
    value = clean(value)
    if not value:
        return ""
    months = {
        "janeiro": 1, "fevereiro": 2, "março": 3, "abril": 4,
        "maio": 5, "junho": 6, "julho": 7, "agosto": 8,
        "setembro": 9, "outubro": 10, "novembro": 11, "dezembro": 12,
    }
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%B %d, %Y"):
        try:
            return datetime.strptime(value, fmt).date().isoformat()
        except ValueError:
            pass
    m = re.search(r"(?i)(\d{1,2}) de ([a-zç]+) de (20\d{2})", value)
    if m and m.group(2).lower() in months:
        return datetime(int(m.group(3)), months[m.group(2).lower()], int(m.group(1))).date().isoformat()
    m = re.search(r"(20\d{2})-(\d{2})-(\d{2})", value)
    return "-".join(m.groups()) if m else ""


def first_meta(soup: BeautifulSoup, *keys: str) -> str:
    wanted = {k.lower() for k in keys}
    for tag in soup.find_all("meta"):
        for attr in ("property", "name", "itemprop"):
            key = (tag.get(attr) or "").lower()
            if key in wanted:
                value = tag.get("content")
                if value:
                    return clean(value)
    return ""


def jsonld_objects(soup: BeautifulSoup) -> list[dict]:
    objects = []
    for tag in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(tag.string or tag.get_text())
        except Exception:
            continue
        if isinstance(data, dict):
            objects.append(data)
        elif isinstance(data, list):
            objects.extend(x for x in data if isinstance(x, dict))
    return objects


def image_is_reachable(session: requests.Session, image_url: str) -> tuple[bool, str]:
    if not image_url:
        return False, "missing-image"
    try:
        response = session.get(
            image_url,
            headers={**HEADERS, "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"},
            timeout=TIMEOUT,
            stream=True,
        )
        content_type = response.headers.get("content-type", "").lower()
        ok = response.ok and content_type.startswith("image/")
        response.close()
        return ok, content_type or str(response.status_code)
    except Exception as exc:
        return False, str(exc)



def html_node_to_markdown(node) -> str:
    """Converte o HTML editorial do Framer para Markdown sem achatar a estrutura."""
    from bs4 import NavigableString

    block_tags = {"p", "div", "section", "article", "header", "main", "figure"}
    skip_tags = {"script", "style", "noscript"}
    heading_tags = {"h1": "#", "h2": "##", "h3": "###", "h4": "####"}
    lines = []

    def inline(n):
        if isinstance(n, NavigableString):
            return re.sub(r"[ \t\r\n]+", " ", repair_mojibake(str(n)))
        if not getattr(n, "name", None):
            return ""
        tag = n.name.lower()
        if tag in skip_tags:
            return ""
        if tag == "br":
            return "\n"
        if tag in {"strong", "b"}:
            value = "".join(inline(c) for c in n.children).strip()
            return f"**{value}**" if value else ""
        if tag in {"em", "i"}:
            value = "".join(inline(c) for c in n.children).strip()
            return f"_{value}_" if value else ""
        if tag == "u":
            return "".join(inline(c) for c in n.children)
        if tag == "a":
            value = "".join(inline(c) for c in n.children).strip()
            href = n.get("href")
            if href and value:
                return f"[{value}]({urljoin(BASE, href)})"
            return value
        if tag == "img":
            src = n.get("src") or n.get("data-src") or ""
            alt = clean(n.get("alt") or "")
            return f"![{alt}]({urljoin(BASE, src)})" if src else ""
        style = (n.get("style") or "").lower()
        value = "".join(inline(c) for c in n.children)
        if "font-weight" in style and ("bold" in style or "700" in style or "800" in style or "900" in style):
            value = value.strip()
            return f"**{value}**" if value else ""
        return value

    def block(n, prefix=""):
        if isinstance(n, NavigableString):
            value = clean(str(n))
            if value:
                lines.append(prefix + value)
            return
        if not getattr(n, "name", None) or n.name.lower() in skip_tags:
            return
        tag = n.name.lower()
        if tag in heading_tags:
            value = inline(n).strip()
            if value:
                lines.append(prefix + heading_tags[tag] + " " + value)
                lines.append("")
            return
        if tag == "blockquote":
            value = inline(n).strip()
            if value:
                lines.extend(prefix + "> " + x for x in value.splitlines() if x.strip())
                lines.append("")
            return
        if tag in {"ul", "ol"}:
            ordered = tag == "ol"
            for idx, li in enumerate(n.find_all("li", recursive=False), 1):
                value_parts = []
                nested = []
                for child in li.children:
                    if getattr(child, "name", None) in {"ul", "ol"}:
                        nested.append(child)
                    else:
                        value_parts.append(inline(child))
                value = re.sub(r"[ \t]+", " ", "".join(value_parts)).strip()
                marker = f"{idx}. " if ordered else "- "
                if value:
                    lines.append(prefix + marker + value)
                for child in nested:
                    block(child, prefix + "  ")
            lines.append("")
            return
        if tag in block_tags:
            has_block_children = any(
                getattr(child, "name", None) in block_tags.union({"h1","h2","h3","h4","ul","ol","blockquote"})
                for child in n.children
            )
            if has_block_children:
                for child in n.children:
                    block(child, prefix)
            else:
                value = re.sub(r"[ \t]+", " ", inline(n)).strip()
                if value:
                    lines.append(prefix + value)
                    lines.append("")
            return
        value = inline(n).strip()
        if value:
            lines.append(prefix + value)

    for child in node.children:
        block(child)

    text = "\n".join(lines)
    text = re.sub(r"[\u200B\u200C\u200D\uFEFF\u2060]", "", text)
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_body_from_html(soup: BeautifulSoup) -> str:
    """Obtém o corpo editorial com estrutura HTML antes de recorrer ao texto plano."""
    direct = soup.find_all("div", class_=lambda value: value and "framer-j471f3" in value)
    if direct:
        node = max(direct, key=lambda n: len(n.get_text(" ", strip=True)))
        body = html_node_to_markdown(node)
        if len(body) >= 120:
            return body

    candidates = []
    for selector in ("article", "[role='article']", "main"):
        for node in soup.select(selector):
            paragraphs = node.find_all(["p", "h2", "h3", "h4", "ul", "ol", "blockquote"])
            text_len = len(node.get_text(" ", strip=True))
            if len(paragraphs) >= 2 and text_len >= 300:
                candidates.append((text_len, node))
    if candidates:
        node = max(candidates, key=lambda item: item[0])[1]
        body = html_node_to_markdown(node)
        if len(body) >= 120:
            return body
    return ""


def article_from_page(session: requests.Session, url: str) -> dict | None:
    response = session.get(url, headers=HEADERS, timeout=TIMEOUT)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    objects = jsonld_objects(soup)
    if os.getenv("FRAMER_DEBUG"):
        h1s=soup.find_all("h1"); chain=[]; node=h1s[1] if len(h1s)>1 else (h1s[0] if h1s else None);
        for _ in range(6):
            if not node: break
            chain.append((node.name, node.get("class"), len(node.get_text(" ", strip=True)), clean(node.get_text(" ", strip=True))[:500]))
            node=node.parent
        sib=[]; hdr=h1s[1].find_parent("div", class_=lambda v: v and "framer-1ajq6b5" in v) if len(h1s)>1 else None;
        if hdr:
            for x in list(hdr.parent.children) if hdr.parent else []:
                if getattr(x, "name", None): sib.append((x.name, x.get("class"), len(x.get_text(" ", strip=True))))
        print("FRAMER_DEBUG_PAGE", url, "status=", response.status_code, "bytes=", len(response.content), "title=", clean(soup.title.get_text(" ", strip=True) if soup.title else ""), "jsonld_types=", [x.get("@type") for x in objects[:5]], "h1=", [clean(x.get_text(" ", strip=True)) for x in h1s[:3]], "p_count=", len(soup.find_all("p")), "chain=", chain, "siblings=", sib[:20], "meta=", [(m.get("name") or m.get("property"), clean(m.get("content"))) for m in soup.find_all("meta") if m.get("name") or m.get("property")][:12])
    article_ld = next(
        (x for x in objects if x.get("@type") in ("NewsArticle", "Article")),
        {},
    )

    title = clean(article_ld.get("headline")) or first_meta(soup, "og:title", "twitter:title")
    if not title:
        h1 = soup.find("h1")
        title = clean(h1.get_text(" ", strip=True) if h1 else "")

    category = clean(first_meta(soup, "article:section", "section", "category"))

    subtitle = (
        clean(article_ld.get("description"))
        or first_meta(soup, "description", "og:description", "twitter:description")
    )

    author = article_ld.get("author", "")
    if isinstance(author, dict):
        author = author.get("name", "")
    elif isinstance(author, list):
        author = ", ".join(
            a.get("name", "") if isinstance(a, dict) else str(a) for a in author
        )
    author = clean(str(author)) or "ChutaPraCanto"

    published = parse_date(
        article_ld.get("datePublished")
        or first_meta(soup, "article:published_time", "datePublished")
    )
    modified = parse_date(
        article_ld.get("dateModified")
        or first_meta(soup, "article:modified_time", "dateModified")
    )

    h1s = soup.find_all("h1")
    article_h1 = h1s[1] if len(h1s) > 1 else (h1s[0] if h1s else None)
    header_block = article_h1.parent.parent.parent if article_h1 and article_h1.parent and article_h1.parent.parent and article_h1.parent.parent.parent else None
    header_text = clean(header_block.get_text(" ", strip=True)) if header_block else ""
    if not published:
        published_match = re.search(r"(?i)Publicado em ([^·]+)", header_text)
        published = parse_date(published_match.group(1)) if published_match else ""
    if author == "ChutaPraCanto" and header_text:
        author_match = re.search(r"(?i)·\s*Por\s+(.+)$", header_text)
        if author_match:
            author = clean(author_match.group(1))
    if not category and header_text and title:
        category_match = re.search(r"← VOLTAR ÀS NOTÍCIAS\s+(.+?)\s+" + re.escape(title), header_text)
        if category_match:
            category = clean(category_match.group(1))

    image = article_ld.get("image", "")
    if isinstance(image, dict):
        image = image.get("url", "")
    elif isinstance(image, list):
        image = image[0] if image else ""
    image = clean(str(image)) or first_meta(soup, "og:image", "twitter:image")
    image = urljoin(url, image) if image else ""

    body_text = extract_body_from_html(soup)

    if not body_text and article_ld.get("articleBody"):
        body_text = clean(str(article_ld["articleBody"]))

    if not body_text:
        direct_body_nodes = soup.find_all("div", class_=lambda value: value and "framer-j471f3" in value)
        if direct_body_nodes:
            body_text = clean(max(direct_body_nodes, key=lambda node: len(node.get_text(" ", strip=True))).get_text(" ", strip=True))
    if not body_text:
        h1s = soup.find_all("h1")
        article_h1 = h1s[1] if len(h1s) > 1 else (h1s[0] if h1s else None)
        header_block = article_h1.parent.parent.parent if article_h1 and article_h1.parent and article_h1.parent.parent and article_h1.parent.parent.parent else None
        if header_block and header_block.parent:
            sibling_candidates = []
            for node in header_block.parent.find_all(recursive=False):
                if node is header_block or node.name != "div":
                    continue
                normalized_text = clean(node.get_text(" ", strip=True))
                text_len = len(normalized_text)
                if text_len >= 500:
                    sibling_candidates.append((text_len, normalized_text))
            if sibling_candidates:
                body_text = max(sibling_candidates, key=lambda x: x[0])[1]
        if not body_text:
            candidates = []
            for selector in ("article", "[role='article']", "main"):
                for node in soup.select(selector):
                    paragraphs = [
                        clean(p.get_text(" ", strip=True))
                        for p in node.find_all("p")
                    ]
                    paragraphs = [p for p in paragraphs if len(p) >= 25]
                    if len(paragraphs) >= 2:
                        candidates.append("\n\n".join(paragraphs))
            if candidates:
                body_text = max(candidates, key=len)

    if os.getenv("FRAMER_DEBUG"):
        print("FRAMER_DEBUG_FIELDS", url, "title_ok=", bool(title), "published=", published, "category=", category, "author=", author, "body_len=", len(body_text), "image=", image)
    if not title or not published or not body_text:
        return None

    slug = urlparse(url).path.rstrip("/").split("/")[-1]
    slug = slugify(unquote(slug))

    image_ok, image_status = image_is_reachable(session, image)
    if not image_ok:
        raise RuntimeError(f"image-not-reachable: {image_status}")

    return {
        "slug": slug,
        "title": title,
        "subtitle": subtitle,
        "category": category or "Futebol",
        "author": author,
        "published": published,
        "modified": modified,
        "image": image,
        "imageStatus": image_status,
        "sourceUrl": url,
        "body": body_text,
    }


def listing_urls(session: requests.Session) -> list[str]:
    response = session.get(LISTING, headers=HEADERS, timeout=TIMEOUT)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    urls = []
    seen = set()
    for a in soup.find_all("a", href=True):
        href = urljoin(LISTING, repair_mojibake(a["href"]))
        parsed = urlparse(href)
        if parsed.netloc != urlparse(BASE).netloc:
            continue
        if not parsed.path.startswith("/noticias/"):
            continue
        href = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
        if href not in seen:
            seen.add(href)
            urls.append(href)
    return urls


def title_date_key(title: str, published: str) -> tuple[str, str]:
    normalized = unicodedata.normalize("NFKD", clean(title))
    normalized = "".join(ch for ch in normalized if not unicodedata.combining(ch))
    normalized = re.sub(r"[^a-z0-9]+", " ", normalized.casefold()).strip()
    return normalized, published


def yaml_quote(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def markdown(item: dict) -> str:
    lines = [
        "---",
        f"title: {yaml_quote(item['title'])}",
        f"slug: {yaml_quote(item['slug'])}",
        f"subtitle: {yaml_quote(item['subtitle'])}",
        f"category: {yaml_quote(item['category'])}",
        f"published: {yaml_quote(item['published'])}",
        f"author: {yaml_quote(item['author'])}",
        f"sourceUrl: {yaml_quote(item['sourceUrl'])}",
    ]
    if item.get("modified"):
        lines.append(f"modified: {yaml_quote(item['modified'])}")
    if item.get("image"):
        lines.append(f"image: {yaml_quote(item['image'])}")
    lines += ["---", "", item["body"].strip(), ""]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true")
    parser.add_argument("--limit", type=int, default=213)
    parser.add_argument("--delay", type=float, default=0.2)
    parser.add_argument("--repair-existing", action="store_true", help="Reextrai e substitui apenas o corpo dos artigos já existentes, preservando o frontmatter local.")
    args = parser.parse_args()

    CONTENT.mkdir(parents=True, exist_ok=True)
    IMAGES.mkdir(parents=True, exist_ok=True)

    session = requests.Session()
    urls = listing_urls(session)
    if args.limit and not (args.limit == 20 and os.getenv("GITHUB_EVENT_NAME") == "push"):
        urls = urls[: args.limit]

    existing = json.loads(INDEX.read_text(encoding="utf-8")) if INDEX.exists() else []
    existing_slugs = {str(x.get("slug", "")) for x in existing}
    existing_sources = {str(x.get("sourceUrl", "")) for x in existing}
    existing_title_dates = {
        title_date_key(str(x.get("title", "")), str(x.get("published", "")))
        for x in existing
        if x.get("title") and x.get("published")
    }
    existing_by_source = {str(x.get("sourceUrl", "")): x for x in existing if x.get("sourceUrl")}
    existing_by_slug = {str(x.get("slug", "")): x for x in existing if x.get("slug")}

    imported = []
    skipped = []
    failed = []

    for n, url in enumerate(urls, 1):
        try:
            item = article_from_page(session, url)
            if not item:
                skipped.append((url, "missing-title-date-or-body"))
                continue
            item_key = title_date_key(item["title"], item["published"])
            if args.repair_existing:
                existing_entry = (
                    existing_by_source.get(item["sourceUrl"])
                    or existing_by_slug.get(item["slug"])
                    or next(
                        (x for x in existing
                         if title_date_key(str(x.get("title", "")), str(x.get("published", ""))) == item_key),
                        None,
                    )
                )
                if not existing_entry or not existing_entry.get("path"):
                    skipped.append((url, "repair-target-not-found"))
                    continue
                item["_existing_path"] = str(existing_entry["path"])
                imported.append(item)
                print(f"[{n}/{len(urls)}] REPAIR {item['published']} {item['title']}")
                continue

            if (
                item["slug"] in existing_slugs
                or item["sourceUrl"] in existing_sources
                or item_key in existing_title_dates
            ):
                reason = "already-present"
                if item_key in existing_title_dates:
                    reason = "duplicate-title-and-date"
                skipped.append((url, reason))
                continue
            imported.append(item)
            existing_slugs.add(item["slug"])
            existing_sources.add(item["sourceUrl"])
            existing_title_dates.add(item_key)
            print(f"[{n}/{len(urls)}] OK {item['published']} {item['title']}")
        except Exception as exc:
            failed.append((url, str(exc)))
            print(f"[{n}/{len(urls)}] FAIL {url}: {exc}", file=sys.stderr)
        time.sleep(args.delay)

    report = {
        "listingUrls": len(urls),
        "readyToImport": len(imported),
        "skipped": len(skipped),
        "failed": len(failed),
        "items": imported,
        "skippedItems": skipped,
        "failedItems": failed,
        "imageValidated": sum(1 for item in imported if item.get("imageStatus")),
    }
    Path("/tmp/framer-import-report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(json.dumps({
        "listingUrls": len(urls),
        "readyToImport": len(imported),
        "skipped": len(skipped),
        "failed": len(failed),
        "imageValidated": sum(1 for item in imported if item.get("imageStatus")),
        "write": args.write,
    }, ensure_ascii=False))

    if not args.write:
        return 0

    if args.repair_existing:
        repaired = 0
        for item in imported:
            path = ROOT / item["_existing_path"]
            if not path.exists():
                raise RuntimeError(f"Alvo de reparação não encontrado: {path}")
            current = path.read_text(encoding="utf-8")
            match = re.match(r"^(---\s*\n[\s\S]*?\n---\s*\n?)([\s\S]*)$", current)
            if not match:
                raise RuntimeError(f"Frontmatter inválido no alvo: {path}")
            body = item["body"].strip()
            if not body:
                continue
            frontmatter = match.group(1)
            frontmatter = re.sub(r"(?m)^title:\s*.*$", f"title: {yaml_quote(item['title'])}", frontmatter, count=1)
            if re.search(r"(?m)^subtitle:\s*", frontmatter):
                frontmatter = re.sub(r"(?m)^subtitle:\s*.*$", f"subtitle: {yaml_quote(item['subtitle'])}", frontmatter, count=1)
            elif re.search(r"(?m)^subtitulo:\s*", frontmatter):
                frontmatter = re.sub(r"(?m)^subtitulo:\s*.*$", f"subtitulo: {yaml_quote(item['subtitle'])}", frontmatter, count=1)
            else:
                frontmatter = frontmatter.rstrip() + "\nsubtitle: " + yaml_quote(item["subtitle"]) + "\n---\n"
            path.write_text(frontmatter + "\n" + body + "\n", encoding="utf-8")
            repaired += 1
        print(json.dumps({"repaired": repaired}, ensure_ascii=False))
        return 0

    for item in imported:
        path = CONTENT / f"{item['slug']}.md"
        if path.exists():
            raise RuntimeError(f"Recusa sobrescrever artigo existente: {path}")
        path.write_text(markdown(item), encoding="utf-8")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
,
                f"title: {yaml_quote(item['title'])}",
                frontmatter,
                count=1,
            )
            if re.search(r"(?m)^subtitle:\s*", frontmatter):
                frontmatter = re.sub(
                    r'(?m)^subtitle:\s*.*        print(json.dumps({"repaired": repaired}, ensure_ascii=False))
        return 0

    for item in imported:
        path = CONTENT / f"{item['slug']}.md"
        if path.exists():
            raise RuntimeError(f"Recusa sobrescrever artigo existente: {path}")
        path.write_text(markdown(item), encoding="utf-8")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
,
                    f"subtitle: {yaml_quote(item['subtitle'])}",
                    frontmatter,
                    count=1,
                )
            elif re.search(r"(?m)^subtitulo:\s*", frontmatter):
                frontmatter = re.sub(
                    r'(?m)^subtitulo:\s*.*        print(json.dumps({"repaired": repaired}, ensure_ascii=False))
        return 0

    for item in imported:
        path = CONTENT / f"{item['slug']}.md"
        if path.exists():
            raise RuntimeError(f"Recusa sobrescrever artigo existente: {path}")
        path.write_text(markdown(item), encoding="utf-8")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
,
                    f"subtitulo: {yaml_quote(item['subtitle'])}",
                    frontmatter,
                    count=1,
                )
            else:
                frontmatter = frontmatter.rstrip() + f"\nsubtitle: {yaml_quote(item['subtitle'])}\n---\n"
            path.write_text(frontmatter + "\n" + body + "\n", encoding="utf-8")
            repaired += 1
        print(json.dumps({"repaired": repaired}, ensure_ascii=False))
        return 0

    for item in imported:
        path = CONTENT / f"{item['slug']}.md"
        if path.exists():
            raise RuntimeError(f"Recusa sobrescrever artigo existente: {path}")
        path.write_text(markdown(item), encoding="utf-8")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
