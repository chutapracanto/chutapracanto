(() => {
  const STORAGE_KEY = 'cpc:analytics-session:v1';
  const page = window.location.pathname || '/';
  const params = new URLSearchParams(window.location.search);
  const articleSlug = params.get('slug') || '';
  const sameOrigin = window.location.origin;
  const safeText = (value, max = 240) => String(value || '').slice(0, max);

  function uuid() {
    if (crypto?.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return hex.slice(0,8)+'-'+hex.slice(8,12)+'-'+hex.slice(12,16)+'-'+hex.slice(16,20)+'-'+hex.slice(20);
  }

  let sessionId = '';
  try { sessionId = sessionStorage.getItem(STORAGE_KEY) || ''; } catch {}
  if (!sessionId) {
    sessionId = uuid();
    try { sessionStorage.setItem(STORAGE_KEY, sessionId); } catch {}
  }

  function classifySource() {
    const qpSource = params.get('utm_source');
    const qpMedium = params.get('utm_medium');
    const ref = document.referrer || '';
    let host = '';
    try { host = ref ? new URL(ref).hostname.toLowerCase() : ''; } catch {}
    if (qpSource) return { source: safeText(qpSource.toLowerCase(), 80), medium: safeText((qpMedium || 'campaign').toLowerCase(), 40), referrerHost: host };
    if (!host) return { source: 'direct', medium: 'none', referrerHost: '' };
    if (host === location.hostname || host.endsWith('.chutapracanto.com')) return { source: 'internal', medium: 'referral', referrerHost: host };
    if (host.includes('google.')) return { source: 'google', medium: 'organic', referrerHost: host };
    if (host.includes('bing.')) return { source: 'bing', medium: 'organic', referrerHost: host };
    if (host === 'linktr.ee' || host.endsWith('.linktr.ee') || host.includes('linktree.')) return { source: 'linktree', medium: 'referral', referrerHost: host };
    if (host === 'threads.net' || host.endsWith('.threads.net')) return { source: 'threads', medium: 'social', referrerHost: host };
    if (host === 'x.com' || host.endsWith('.x.com') || host === 'twitter.com' || host.endsWith('.twitter.com')) return { source: 'x', medium: 'social', referrerHost: host };
    if (host.includes('facebook.com') || host === 'fb.com') return { source: 'facebook', medium: 'social', referrerHost: host };
    if (host.includes('instagram.com')) return { source: 'instagram', medium: 'social', referrerHost: host };
    if (host.includes('youtube.com') || host.includes('youtu.be')) return { source: 'youtube', medium: 'social', referrerHost: host };
    if (host.includes('tiktok.com')) return { source: 'tiktok', medium: 'social', referrerHost: host };
    if (host.includes('reddit.com')) return { source: 'reddit', medium: 'social', referrerHost: host };
    return { source: host.replace(/^www\./, '').slice(0, 80) || 'referral', medium: 'referral', referrerHost: host };
  }

  const initial = (() => {
    const key = 'cpc:analytics-attribution:v1';
    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(key) || 'null'); } catch {}
    if (saved?.source) return saved;
    const value = classifySource();
    try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {}
    return value;
  })();

  const previousKey = 'cpc:analytics-previous-page:v1';
  let previousPage = '';
  try { previousPage = sessionStorage.getItem(previousKey) || ''; } catch {}
  try { sessionStorage.setItem(previousKey, page); } catch {}

  function send(eventType, details = {}, useBeacon = false) {
    const payload = {
      sessionId,
      eventType,
      pagePath: page,
      articleSlug: articleSlug || null,
      source: initial.source,
      medium: initial.medium,
      referrerHost: initial.referrerHost || null,
      previousPage: previousPage || null,
      target: details.target ? safeText(details.target, 240) : null,
      metadata: details.metadata || null
    };
    const body = JSON.stringify(payload);
    if (useBeacon && navigator.sendBeacon) {
      try {
        const blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon('/api/analytics/event', blob)) return;
      } catch {}
    }
    fetch('/api/analytics/event', {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true
    }).catch(() => {});
  }

  send('page_view');

  const startedAt = performance.now();
  let activeMs = 0;
  let visibleSince = document.visibilityState === 'visible' ? performance.now() : null;
  const scrollMarks = new Set();

  function addVisibleTime() {
    if (visibleSince != null) {
      activeMs += Math.max(0, performance.now() - visibleSince);
      visibleSince = null;
    }
  }
  function resumeVisibleTime() {
    if (visibleSince == null && document.visibilityState === 'visible') visibleSince = performance.now();
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') addVisibleTime();
    else resumeVisibleTime();
  });

  function scrollDepth() {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    return Math.min(100, Math.round((window.scrollY / max) * 100));
  }
  function checkScroll() {
    const depth = scrollDepth();
    [25, 50, 75, 90].forEach(mark => {
      if (depth >= mark && !scrollMarks.has(mark)) {
        scrollMarks.add(mark);
        send('scroll_depth', { metadata: { percent: mark } });
      }
    });
  }
  window.addEventListener('scroll', checkScroll, { passive: true });

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          if (el.dataset.cpcTracked === '1') return;
          el.dataset.cpcTracked = '1';
          const event = el.dataset.analyticsEvent;
          if (event) send(event, {
            target: el.dataset.analyticsTarget || el.getAttribute('href') || '',
            metadata: { label: safeText(el.dataset.analyticsLabel || el.textContent, 120) }
          });
        });
      }, { threshold: 0.35 })
    : null;

  function observe() {
    if (!observer) return;
    document.querySelectorAll('[data-analytics-event]').forEach(el => observer.observe(el));
  }
  observe();

  const mutationObserver = new MutationObserver(() => observe());
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const target = link.dataset.analyticsTarget || href;
    const explicit = link.dataset.analyticsClick;
    if (explicit) {
      send(explicit, { target, metadata: { label: safeText(link.textContent, 120) } });
      return;
    }
    if (link.classList.contains('related-news-card')) {
      send('related_article_click', { target, metadata: { label: safeText(link.textContent, 120) } });
      return;
    }
    if (page === '/' && /(?:^|\/)competicoes(?:$|[?#])/.test(href)) {
      send('competition_more_click', { target, metadata: { label: safeText(link.textContent, 120) } });
    }
  });

  const heartbeat = window.setInterval(() => {
    if (document.visibilityState === 'visible') send('active_time', { metadata: { seconds: Math.round(activeMs / 1000) } });
  }, 30000);

  window.addEventListener('pagehide', () => {
    addVisibleTime();
    send('page_exit', { metadata: { activeSeconds: Math.round(activeMs / 1000), elapsedSeconds: Math.round((performance.now() - startedAt) / 1000) } }, true);
    clearInterval(heartbeat);
  });

  window.CPCAnalytics = { send };
})();