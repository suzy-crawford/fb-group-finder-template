import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// FB Group Finder: every call to Apify goes through here, so the member's Apify key never
// reaches the browser. Actions:
//   check  -> confirms the saved key works and returns the Apify username
//   start  -> starts one Facebook group search per keyword (returns straight away, the search runs on Apify)
//   status -> reports where each run is (READY, RUNNING, SUCCEEDED, FAILED...)
//   items  -> reads the groups a finished run found

const ACTOR = 'memo23~facebook-search-groups-scraper';
const API = 'https://api.apify.com/v2';
const FIELDS = 'name,url,privacy,membersCount,postsLastDay,postsLastMonth,searchQuery,description,rules';

async function getToken(base44) {
  const rows = await base44.entities.AppSettings.list();
  const row = Array.isArray(rows) ? rows[0] : rows?.items?.[0];
  return (row?.apify_token || '').trim();
}

async function apify(path, token, init = {}) {
  const sep = path.includes('?') ? '&' : '?';
  const res = await fetch(`${API}${path}${sep}token=${encodeURIComponent(token)}`, init);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { json = null; }
  if (!res.ok) {
    const msg = json?.error?.message || text.slice(0, 200) || `Apify error ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

function shortRules(rules) {
  if (!Array.isArray(rules)) return '';
  return rules
    .map((r) => (typeof r === 'string' ? r : [r?.title, r?.description].filter(Boolean).join(': ')))
    .filter(Boolean)
    .join(' | ')
    .slice(0, 900);
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const action = body?.action;
    const token = await getToken(base44);
    if (!token) return Response.json({ error: 'NO_KEY' });

    if (action === 'check') {
      const me = await apify('/users/me', token);
      return Response.json({ ok: true, username: me?.data?.username || '' });
    }

    if (action === 'start') {
      const keyword = String(body?.keyword || '').trim();
      if (!keyword) return Response.json({ error: 'keyword is required' }, { status: 400 });
      const input = { searchQueries: [keyword], maxGroups: 50, requireKeywordMatch: true, privacy: 'any', minMembers: 1000 };
      const run = await apify(`/acts/${ACTOR}/runs?memory=1024&maxTotalChargeUsd=0.3`, token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      return Response.json({ run_id: run?.data?.id, dataset_id: run?.data?.defaultDatasetId, status: run?.data?.status });
    }

    if (action === 'status') {
      const ids = Array.isArray(body?.run_ids) ? body.run_ids.slice(0, 40) : [];
      const out = await Promise.all(ids.map(async (id) => {
        try {
          const run = await apify(`/actor-runs/${id}`, token);
          const d = run?.data || {};
          return { run_id: id, status: d.status, dataset_id: d.defaultDatasetId, message: d.statusMessage || '' };
        } catch (e) {
          return { run_id: id, status: 'UNKNOWN', message: e.message };
        }
      }));
      return Response.json({ runs: out });
    }

    if (action === 'items') {
      const id = String(body?.dataset_id || '');
      if (!id) return Response.json({ error: 'dataset_id is required' }, { status: 400 });
      const items = await apify(`/datasets/${id}/items?clean=true&limit=200&fields=${FIELDS}`, token);
      const groups = (Array.isArray(items) ? items : []).map((g) => ({
        name: g.name || '',
        url: g.url || '',
        privacy: g.privacy || '',
        members: Number(g.membersCount) || 0,
        posts_day: Number(g.postsLastDay) || 0,
        posts_30: Number(g.postsLastMonth) || 0,
        search_query: g.searchQuery || '',
        description: String(g.description || '').slice(0, 700),
        rules: shortRules(g.rules),
      }));
      return Response.json({ groups });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
