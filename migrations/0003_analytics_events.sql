CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL CHECK (length(session_id) BETWEEN 20 AND 80),
  occurred_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  event_type TEXT NOT NULL CHECK (length(event_type) BETWEEN 2 AND 48),
  page_path TEXT NOT NULL CHECK (length(page_path) BETWEEN 1 AND 240),
  article_slug TEXT,
  source TEXT NOT NULL DEFAULT 'direct',
  medium TEXT NOT NULL DEFAULT 'unknown',
  referrer_host TEXT,
  previous_page TEXT,
  target TEXT,
  metadata_json TEXT
);
CREATE INDEX IF NOT EXISTS idx_analytics_events_occurred_at ON analytics_events(occurred_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_source ON analytics_events(source);
CREATE INDEX IF NOT EXISTS idx_analytics_events_page ON analytics_events(page_path);
