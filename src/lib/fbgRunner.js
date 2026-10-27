// FB Group Finder - runs the search (fbgRunner.js)
// The page calls tick() every few seconds while it's open. Each tick checks the running Apify
// searches, starts queued ones (never more than 5 at once), and once every search is finished,
// checks the shortlist with the AI, picks the final 20 groups and writes the posts.
// Everything is saved on the GroupSearch record, so the member can close the page and come back.

import { base44 } from "@/api/base44Client";
import { callAI } from "@/lib/callAI";
import { firstCut, pickFinal, MAX_ACTIVE, today } from "@/lib/fbgLogic";
import { screenPrompt, SCREEN_SCHEMA, postsPrompt, POSTS_SCHEMA } from "@/lib/fbgPrompts";

export async function apifyCall(payload) {
  const res = await base44.functions.invoke("apify", payload);
  const data = res?.data ?? res;
  if (data?.error === "NO_KEY") throw new Error("NO_KEY");
  if (data?.error) throw new Error(data.error);
  return data;
}

const ACTIVE = ["READY", "RUNNING"];
const FAILED = ["FAILED", "ABORTED", "TIMED-OUT", "TIMING-OUT", "ABORTING"];

export async function tick(search, business) {
  const s = { ...search, runs: (search.runs || []).map((r) => ({ ...r })), candidates: [...(search.candidates || [])] };
  let outOfCredit = false;

  // 1. Check the running searches.
  const running = s.runs.filter((r) => r.run_id && ACTIVE.includes(r.status));
  if (running.length) {
    const { runs } = await apifyCall({ action: "status", run_ids: running.map((r) => r.run_id) });
    for (const st of runs || []) {
      const r = s.runs.find((x) => x.run_id === st.run_id);
      if (!r) continue;
      if (st.status === "SUCCEEDED" || FAILED.includes(st.status)) {
        let found = 0;
        try {
          const { groups } = await apifyCall({ action: "items", dataset_id: st.dataset_id || r.dataset_id });
          const cut = firstCut(s.candidates, groups || [], r.kind, s.town);
          s.candidates = cut.list;
          found = (groups || []).length;
          r.kept = cut.added;
        } catch (e) {
          r.message = e.message;
        }
        r.found = found;
        r.status = st.status === "SUCCEEDED" ? "DONE" : "FAILED";
        if (r.status === "FAILED") {
          r.message = st.message || r.message || "The search stopped early.";
          if (/maximum (total )?(charge|cost)/i.test(r.message) && found === 0) outOfCredit = true;
        }
      } else {
        r.status = st.status;
      }
    }
  }

  if (outOfCredit) {
    s.runs.forEach((r) => { if (r.status === "QUEUED") r.status = "SKIPPED"; });
    s.error = "Your Apify account is out of credit, so the searches stopped. Add credit in Apify (Billing), then run the search again.";
    return s;
  }

  // 2. Start queued searches, at most 5 running at once.
  let active = s.runs.filter((r) => ACTIVE.includes(r.status)).length;
  for (const r of s.runs.filter((x) => x.status === "QUEUED")) {
    if (active >= MAX_ACTIVE) break;
    try {
      const run = await apifyCall({ action: "start", keyword: r.keyword });
      r.run_id = run.run_id;
      r.dataset_id = run.dataset_id;
      r.status = run.status || "READY";
      active++;
    } catch (e) {
      if (e.message === "NO_KEY") throw e;
      // Don't retry straight away: the run may have started anyway and a retry could charge twice.
      r.status = "NOT_STARTED";
      r.message = e.message;
    }
  }

  // 3. Everything finished: check the shortlist, pick the 20, write the posts.
  const busy = s.runs.some((r) => r.status === "QUEUED" || ACTIVE.includes(r.status));
  if (!busy) {
    s.phase = "checking";
    const todo = s.candidates.filter((g) => !g.screen);
    for (let i = 0; i < todo.length; i += 20) {
      const chunk = todo.slice(i, i + 20);
      const out = await callAI({ prompt: screenPrompt(s, chunk), response_json_schema: SCREEN_SCHEMA });
      const map = new Map((out?.groups || []).map((g) => [String(g.key).toLowerCase(), g]));
      chunk.forEach((g) => {
        const c = s.candidates.find((x) => x.key === g.key);
        c.screen = map.get(g.key) || { keep: false, drop_reason: "Not checked" };
      });
    }
    const keepStatus = new Map((s.groups || []).map((g) => [g.key, g.status]));
    const { groups, short } = pickFinal(s.candidates);
    s.groups = groups.map((g) => ({ ...g, status: keepStatus.get(g.key) || g.status }));
    s.shortfall = short;
    s.dropped = { total: s.candidates.length - groups.length, checked: s.candidates.length };
    if (!s.posts) {
      s.posts = await callAI({ prompt: postsPrompt(s, business), response_json_schema: POSTS_SCHEMA });
    }
    s.checked_date = today();
    s.stage = "results";
    s.phase = "";
  }
  return s;
}

export function queueKeywords(search, list, round) {
  const runs = [...(search.runs || [])];
  list.forEach((k) => runs.push({ keyword: k.keyword, kind: k.kind, round, status: "QUEUED" }));
  return runs;
}
