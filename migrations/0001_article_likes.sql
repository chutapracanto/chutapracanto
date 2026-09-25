CREATE TABLE IF NOT EXISTS article_likes (
  article_slug TEXT NOT NULL CHECK (length(article_slug) BETWEEN 1 AND 160),
  visitor_hash TEXT NOT NULL CHECK (length(visitor_hash) = 64),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY (article_slug, visitor_hash)
) WITHOUT ROWID;
