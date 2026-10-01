const COMPETITIONS = [
  "liga-portugal",
  "taca-portugal",
  "taca-liga",
  "champions-league",
  "europa-league",
  "conference-league",
  "nations-league"
];

export default {
  async scheduled(controller, env) {
    const slot = Math.floor(controller.scheduledTime / (5 * 60 * 1000));
    const competition = COMPETITIONS[
      ((slot % COMPETITIONS.length) + COMPETITIONS.length) % COMPETITIONS.length
    ];

    let seasonId = "";
    if (env.FOOTBALL_CACHE_DB) {
      const row = await env.FOOTBALL_CACHE_DB
        .prepare(
          "SELECT season_id FROM football_cache WHERE competition_key = ?1 ORDER BY fetched_at DESC LIMIT 1"
        )
        .bind(competition)
        .first();
      if (row?.season_id) seasonId = String(row.season_id);
    }

    const params = new URLSearchParams({
      competition,
      _cron: String(controller.scheduledTime)
    });
    if (seasonId) params.set("seasonId", seasonId);

    const response = await fetch(
      `https://chutapracanto.com/api/competicoes?${params.toString()}`,
      {
        cache: "no-store",
        headers: {
          "Accept": "application/json",
          "Cache-Control": "no-store"
        }
      }
    );

    if (!response.ok) {
      let detail = "";
      try {
        const body = await response.clone().json();
        detail = body?.debugStage || body?.message || body?.error || "";
      } catch {}
      console.error("Football cron HTTP error", competition, response.status, detail);
      controller.noRetry();
      return;
    }

    console.log("Football cron", competition, seasonId || "auto", response.status);
  }
};
