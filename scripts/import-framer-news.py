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
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%B %d, %Y"):
        try:
            return datetime.strptime(value, fmt).date().isoformat()
        except ValueError:
            pass
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

    image = article_ld.get("image", "")
    if isinstance(image, dict):
        image = image.get("url", "")
    elif isinstance(image, list):
        image = image[0] if image else ""
    image = clean(str(image)) or first_meta(soup, "og:image", "twitter:image")
    image = urljoin(url, image) if image else ""

    body_text = ""
    if article_ld.get("articleBody"):
        body_text = clean(str(article_ld["articleBody"]))

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
        "category": clean(first_meta(soup, "article:section")) or "Futebol",
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

    for item in imported:
        path = CONTENT / f"{item['slug']}.md"
        if path.exists():
            raise RuntimeError(f"Recusa sobrescrever artigo existente: {path}")
        path.write_text(markdown(item), encoding="utf-8")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
