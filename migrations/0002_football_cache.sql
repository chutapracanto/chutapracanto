-- Football competition cache
-- Provider-agnostic cache keyed by provider + competition + season + resource + request variant.
CREATE TABLE IF NOT EXISTS football_cache (
  cache_key TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  competition_key TEXT NOT NULL,
  season_id INTEGER NOT NULL,
  resource TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  fetched_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  stale_until TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_football_cache_lookup
  ON football_cache (competition_key, season_id, resource);

CREATE INDEX IF NOT EXISTS idx_football_cache_expiry
  ON football_cache (expires_at, stale_until);
