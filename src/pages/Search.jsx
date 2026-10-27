import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { callAI } from "@/lib/callAI";
import { COUNTRIES } from "@/lib/constants";
import { keywordPrompt, KEYWORD_SCHEMA, moreKeywordsPrompt, MORE_SCHEMA } from "@/lib/fbgPrompts";
import { tick, queueKeywords } from "@/lib/fbgRunner";
import { downloadCSV, sheetTitle, leadStrugglesPost, leadStrugglesCommunity, POST1_TIPS, RHYTHM, DONT_AUTOMATE, STATUSES, MAX_EXTRA_ROUNDS } from "@/lib/fbgLogic";
import SelectableCard from "@/components/shared/SelectableCard";
import CopyButton from "@/components/shared/CopyButton";
import Tabs from "@/components/shared/Tabs";
import { PageSkeleton } from "@/components/shared/Skeleton";
import { ArrowLeft, ExternalLink, Close } from "@/components/brand/icons";

const POLL_MS = 12000;
const isUS = (c) => c === "United States";
const isUK = (c) => c === "United Kingdom";
const townLabel = (c) => (isUK(c) ? "Town" : "City or town");
const regionLabel = (c) => (isUK(c) ? "County" : isUS(c) ? "State" : "Region, province or state");

function Field({ label, optional, children, hint }) {
  return (
    <div className="field field-q">
      <label>{label} {optional && <span className="optional">(optional)</span>}</label>
      {children}
      {hint && <span className="note">{hint}</span>}
    </div>
  );
}

function Card({ title, intro, children, onBack, onNext, nextLabel = "Continue", nextDisabled, busy }) {
  return (
    <section className="lp-card">
      <div className="lp-body" style={{ padding: "26px 28px" }}>
        <h2 className="lp-card-title" style={{ fontSize: 20 }}>{title}</h2>
        {intro && <p className="lp-p">{intro}</p>}
        <div className="flex flex-col gap-5 mt-6">{children}</div>
      </div>
      {(onBack || onNext) && (
        <div className="lp-cardfoot">
          {onBack && <button type="button" className="btn btn-quiet" onClick={onBack}><ArrowLeft className="w-4 h-4" /> Back</button>}
          {onNext && <button type="button" className="btn btn-primary ml-auto" onClick={onNext} disabled={nextDisabled || busy}>{busy || nextLabel}</button>}
        </div>
      )}
    </section>
  );
}

// ---------- step 1: who is this for ----------
const EMPTY_BIZ = { name: "", whose: "own", sent_as: "", website: "", what_they_do: "", what_they_dont: "", ideal_client: "", not_ideal_client: "", country: "", town: "", region: "", spelling: "US", result_story: "" };

function WhoStep({ search, save }) {
  const [list, setList] = useState(null);
  const [pick, setPick] = useState(search.business_id || "");
  const [biz, setBiz] = useState(EMPTY_BIZ);
  const [busy, setBusy] = useState("");
  useEffect(() => {
    base44.entities.Business.filter({}, { sort: "name", limit: 200 }).then(({ items }) => {
      setList(items || []);
      if (!search.business_id && !(items || []).length) setPick("new");
    }).catch(() => setList([]));
  }, []);
  const set = (k) => (e) => setBiz((b) => ({ ...b, [k]: e.target ? e.target.value : e }));
  const ready = pick && (pick !== "new" || (biz.name && biz.what_they_do && biz.ideal_client && biz.country && biz.town));

  const next = async () => {
    setBusy("Saving...");
    try {
      let b = list.find((x) => x.id === pick);
      if (pick === "new") b = await base44.entities.Business.create({ ...biz, spelling: isUK(biz.country) || biz.country === "Ireland" || biz.country === "Australia" || biz.country === "New Zealand" ? "UK" : "US" });
      await save({
        stage: "about", business_id: b.id, business_name: b.name,
        service: search.service || b.what_they_do, ideal_client: search.ideal_client || [b.ideal_client, b.not_ideal_client && `Not: ${b.not_ideal_client}`].filter(Boolean).join(". "),
        country: search.country || b.country, town: search.town || b.town, region: search.region || b.region, result_story: search.result_story || b.result_story,
      });
    } finally {
      setBusy("");
    }
  };

  if (list === null) return <PageSkeleton />;
  return (
    <Card title="Who's this for?" intro="Your own business, or a client you're finding groups for. Saved businesses only need the basics once." onNext={next} nextDisabled={!ready} busy={busy}>
      <div className="flex flex-col gap-2">
        {list.map((b) => (
          <SelectableCard key={b.id} title={`${b.name}${b.whose === "client" ? " (client)" : " (your business)"}`} description={[b.what_they_do, [b.town, b.region].filter(Boolean).join(", ")].filter(Boolean).join(" \u00B7 ")} selected={pick === b.id} onSelect={() => setPick(b.id)} />
        ))}
        <SelectableCard title="Someone new" description="Your own business, or a client's." selected={pick === "new"} onSelect={() => setPick("new")} />
      </div>
      {pick === "new" && (
        <div className="flex flex-col gap-5">
          <Field label="Whose business is it?">
            <div className="choice">
              {[["own", "Mine"], ["client", "A client's"]].map(([v, l]) => <button key={v} type="button" aria-pressed={biz.whose === v} onClick={() => set("whose")(v)}>{l}</button>)}
            </div>
          </Field>
          {biz.whose === "client" && <Field label="Who are the posts sent as?" hint="You, on the client's behalf, or the client themselves. We'll use that name."><input className="input" value={biz.sent_as} onChange={set("sent_as")} /></Field>}
          <Field label="Business name"><input className="input" value={biz.name} onChange={set("name")} /></Field>
          <Field label="Website" optional><input className="input" value={biz.website} onChange={set("website")} /></Field>
          <Field label="What do they do, in a sentence?" hint={'For example "I run Meta ads for clinics" or "I manage social media for restaurants".'}><input className="input" value={biz.what_they_do} onChange={set("what_they_do")} /></Field>
          <Field label="What don't they do?" optional><input className="input" value={biz.what_they_dont} onChange={set("what_they_dont")} /></Field>
          <Field label="Ideal client" hint="Which type of business, roughly how big, and what they're struggling with that you fix."><textarea className="textarea" value={biz.ideal_client} onChange={set("ideal_client")} /></Field>
          <Field label="Who don't they want?" optional hint={'For example "independent practices, not chains".'}><input className="input" value={biz.not_ideal_client} onChange={set("not_ideal_client")} /></Field>
          <Field label="Country">
            <select className="select" value={biz.country} onChange={set("country")}>
              <option value="">Choose a country</option>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={townLabel(biz.country)}><input className="input" value={biz.town} onChange={set("town")} placeholder={isUK(biz.country) ? "Bracknell" : isUS(biz.country) ? "Austin" : ""} /></Field>
            <Field label={regionLabel(biz.country)}><input className="input" value={biz.region} onChange={set("region")} placeholder={isUK(biz.country) ? "Berkshire" : isUS(biz.country) ? "Texas" : ""} /></Field>
          </div>
          <Field label="A real client result" optional hint={'One or two lines with numbers, for example "caf\u00E9 went from 20 to 45 covers on weekday lunches after we switched to a lunch-deal ad". Never made up.'}><textarea className="textarea" value={biz.result_story} onChange={set("result_story")} /></Field>
        </div>
      )}
    </Card>
  );
}

// ---------- step 2: about this search ----------
function AboutStep({ search, save }) {
  const [f, setF] = useState({ service: search.service, ideal_client: search.ideal_client, country: search.country, town: search.town, region: search.region, client_reach: search.client_reach || "national", avoid: search.avoid, result_story: search.result_story });
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target ? e.target.value : e }));
  const vague = /\b(any|all|every)\b.*\bbusiness/i.test(f.ideal_client || "") || /^small business(es)?$/i.test((f.ideal_client || "").trim());

  const next = async () => {
    setBusy("Choosing keywords...");
    setErr("");
    try {
      const out = await callAI({ prompt: keywordPrompt(f), response_json_schema: KEYWORD_SCHEMA });
      const keywords = [...(out?.niche || []).map((k) => ({ ...k, kind: "niche" })), ...(out?.local || []).map((k) => ({ ...k, kind: "local" }))];
      if (!keywords.length) throw new Error("No keywords came back. Try again.");
      if (search.business_id) await base44.entities.Business.update(search.business_id, { result_story: f.result_story || "" }).catch(() => {});
      await save({ ...f, keywords, keyword_notes: out?.notes || "", stage: "keywords" });
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy("");
    }
  };

  return (
    <Card title={`About this search for ${search.business_name}`} intro="Check these, then we'll pick the search words." onBack={() => save({ stage: "who" })} onNext={next} nextDisabled={!f.service || !f.ideal_client || !f.country || !f.town} busy={busy}>
      <Field label="What do you do?" hint='Your marketing service in a sentence, for example "I run Meta ads for clinics".'><input className="input" value={f.service} onChange={set("service")} /></Field>
      <Field label="Who is your ideal client?" hint="Which type of business, roughly how big, and what they're struggling with that you fix.">
        <textarea className="textarea" value={f.ideal_client} onChange={set("ideal_client")} />
      </Field>
      {vague && <div className="note" style={{ color: "var(--a-ink)" }}>A niche makes your groups and posts far more effective. If you can, name one type of business (for example nail techs, dentists or {"caf\u00E9s"}). If you'd rather stay broad, we'll use general small-business searches.</div>}
      <Field label="Country">
        <select className="select" value={f.country} onChange={set("country")}>
          <option value="">Choose a country</option>
          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={townLabel(f.country)}><input className="input" value={f.town} onChange={set("town")} /></Field>
        <Field label={regionLabel(f.country)}><input className="input" value={f.region} onChange={set("region")} /></Field>
      </div>
      <Field label="Where are your clients?">
        <div className="choice">
          {[["local", "Local only"], ["national", `Anywhere in ${f.country || "my country"}`], ["worldwide", "Worldwide"]].map(([v, l]) => <button key={v} type="button" aria-pressed={f.client_reach === v} onClick={() => set("client_reach")(v)}>{l}</button>)}
        </div>
      </Field>
      <Field label="Any groups to avoid?" optional hint="Competitors' groups, groups you're already in, groups you've been removed from."><input className="input" value={f.avoid} onChange={set("avoid")} /></Field>
      <Field label="A client result you're proud of" optional hint="What changed and what you did. Used in one of your posts. Never made up."><textarea className="textarea" value={f.result_story} onChange={set("result_story")} /></Field>
      {err && <div className="lp-error">{err}</div>}
    </Card>
  );
}

// ---------- step 3: keywords ----------
function KeywordList({ kind, keywords, setKeywords }) {
  const [add, setAdd] = useState("");
  const mine = keywords.filter((k) => k.kind === kind);
  const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;
  return (
    <div className="flex flex-col gap-2">
      <div className="font-semibold">{kind === "niche" ? "Niche searches (your ideal clients)" : "Local searches (near you)"}</div>
      <ul className="flex flex-col gap-1.5">
        {mine.map((k) => (
          <li key={k.keyword} className="flex items-start gap-3 border border-app-border rounded-lg px-3 py-2">
            <div className="min-w-0 flex-1"><div className="font-medium">{k.keyword}</div>{k.why && <div className="hint">{k.why}</div>}</div>
            <button type="button" aria-label={`Remove ${k.keyword}`} className="text-app-muted" onClick={() => setKeywords(keywords.filter((x) => x !== k))}><Close className="w-4 h-4" /></button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input className="input" value={add} onChange={(e) => setAdd(e.target.value)} placeholder="Add a search (2 or 3 words)" />
        <button type="button" className="btn btn-quiet" disabled={!add.trim() || words(add) > 3} onClick={() => { setKeywords([...keywords, { keyword: add.trim(), kind, why: "Added by you" }]); setAdd(""); }}>Add</button>
      </div>
      {words(add) > 3 && <span className="note">Keep it to 2 or 3 words. The search only keeps groups whose name or description has every word, so longer phrases find nothing.</span>}
    </div>
  );
}

function KeywordsStep({ search, save }) {
  const [keywords, setKeywords] = useState(search.keywords || []);
  const [busy, setBusy] = useState("");
  const n = keywords.length;
  const start = async () => {
    setBusy("Starting...");
    try {
      await save({ keywords, runs: queueKeywords({ runs: [] }, keywords, 1), candidates: [], groups: [], posts: null, round: 1, error: "", stage: "searching" });
    } finally {
      setBusy("");
    }
  };
  return (
    <Card title="Your search words" intro="Short searches work best, using the words your clients call themselves. Remove any that don't fit, or add your own." onBack={() => save({ stage: "about" })} onNext={start} nextLabel="Start the search" nextDisabled={!n} busy={busy}>
      {search.keyword_notes && <div className="note" style={{ color: "var(--a-ink)" }}>{search.keyword_notes}</div>}
      <KeywordList kind="niche" keywords={keywords} setKeywords={setKeywords} />
      <KeywordList kind="local" keywords={keywords} setKeywords={setKeywords} />
      <p className="note">{n} searches. This takes about 20 to 30 minutes and usually costs $0.50 to $1.50 of your Apify credit (each search is capped at $0.30). You can close this page while it runs and come back.</p>
    </Card>
  );
}

// ---------- step 4: searching ----------
const RUN_LABEL = { QUEUED: "Waiting", READY: "Starting", RUNNING: "Searching", DONE: "Done", FAILED: "Stopped", NOT_STARTED: "Didn't start", SKIPPED: "Skipped" };

function SearchingStep({ search, runError, save }) {
  const runs = search.runs || [];
  const done = runs.filter((r) => ["DONE", "FAILED", "NOT_STARTED", "SKIPPED"].includes(r.status)).length;
  return (
    <section className="lp-card">
      <div className="lp-body" style={{ padding: "26px 28px" }}>
        <h2 className="lp-card-title" style={{ fontSize: 20 }}>{search.phase === "checking" ? "Checking the groups and writing your posts" : "Searching Facebook groups"}</h2>
        <p className="lp-p">{search.phase === "checking" ? "Reading each group's description and rules, removing advertising walls and groups that ban marketers. About a minute." : `${done} of ${runs.length} searches finished. Each one takes 2 to 8 minutes, and up to 5 run at once. You can close this page and come back; it picks up where it left off.`}</p>
        <div className="h-1.5 rounded-full bg-[color:var(--a-sunk)] mt-5 overflow-hidden"><div className="h-full bg-[color:var(--a-ink)]" style={{ width: `${runs.length ? (done / runs.length) * 100 : 0}%`, transition: "width .6s" }} /></div>
        <ul className="mt-6 flex flex-col">
          {runs.map((r, i) => (
            <li key={i} className="flex items-center gap-3 py-2 border-b border-app-border last:border-b-0 text-[15px]">
              <span className="min-w-0 flex-1 truncate">{r.keyword} <span className="hint">({r.kind})</span></span>
              {r.status === "DONE" && <span className="hint">{r.found} found, {r.kept || 0} active</span>}
              <span className="stage">{RUN_LABEL[r.status] || r.status}</span>
            </li>
          ))}
        </ul>
        {runs.some((r) => r.status === "NOT_STARTED") && <p className="note mt-3">A search that didn't start isn't retried automatically, because it may have started anyway and a retry could charge twice.</p>}
        {(search.error || runError) && <div className="lp-error mt-4">{search.error || runError}</div>}
        {search.error && <button type="button" className="btn btn-quiet mt-3" onClick={() => save({ error: "", runs: runs.map((r) => (r.status === "SKIPPED" ? { ...r, status: "QUEUED" } : r)) })}>I've added credit, carry on</button>}
      </div>
    </section>
  );
}

// ---------- step 5: results ----------
function GroupsTab({ search, save }) {
  const groups = search.groups || [];
  const setStatus = (g, status) => save({ groups: groups.map((x) => (x.key === g.key ? { ...x, status } : x)) });
  const section = (title, list) => (
    <section className="panel">
      <div className="panel-head"><h2>{title}</h2><span className="count">{list.length}</span></div>
      <div className="panel-scroll">
        <table className="list w-full text-[14px]">
          <tbody>
            <tr><th>#</th><th>Group</th><th>Posts a day</th><th>Members</th><th>Why it fits</th><th>Posting rules</th><th>Status</th></tr>
            {list.map((g) => (
              <tr key={g.key} className="align-top">
                <td>{g.rank}</td>
                <td style={{ whiteSpace: "normal", minWidth: 220 }}>
                  <a href={g.url} target="_blank" rel="noreferrer" className="font-semibold underline inline-flex items-center gap-1">{g.name}<ExternalLink className="w-3.5 h-3.5" /></a>
                  <div className="hint">{g.type === "Niche" ? "Niche" : g.type.replace("Local - ", "Local, ")}{g.privacy ? ` \u00B7 ${g.privacy}` : ""}</div>
                </td>
                <td>{Math.round((g.posts_30 || 0) / 30)}{g.posts_30 < 300 && <div className="hint">Below 10/day</div>}</td>
                <td>{(g.members || 0).toLocaleString()}</td>
                <td style={{ whiteSpace: "normal", minWidth: 240 }}>{g.why_it_fits}</td>
                <td style={{ whiteSpace: "normal", minWidth: 180 }}>{g.posting_rules}</td>
                <td>
                  <select className="select" style={{ height: 36, minWidth: 128 }} value={g.status || "Not joined"} onChange={(e) => setStatus(g, e.target.value)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
  return (
    <div className="flex flex-col gap-6">
      {section("Niche groups", groups.filter((g) => g.type === "Niche"))}
      {section("Local groups", groups.filter((g) => g.type !== "Niche"))}
    </div>
  );
}

function PostBlock({ title, text, children }) {
  return (
    <section className="panel">
      <div className="panel-head"><h2>{title}</h2><CopyButton text={text} /></div>
      <div className="panel-body">
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{text}</p>
        {children}
      </div>
    </section>
  );
}

function PostsTab({ search }) {
  const p = search.posts || {};
  if (!p.topic) return <p className="note">Your posts are being written.</p>;
  return (
    <div className="flex flex-col gap-6">
      <PostBlock title="Post 1: Lead struggles (the main post)" text={leadStrugglesPost(p.topic)}>
        <ul className="mt-4 flex flex-col gap-1.5 list-disc pl-5 text-[14.5px]">{POST1_TIPS.map((t) => <li key={t}>{t}</li>)}</ul>
      </PostBlock>
      <PostBlock title="Post 1 for mums and community groups" text={leadStrugglesCommunity(p.topic)}>
        <p className="note mt-3">Most members aren't business owners, so this calls them out first. Check the group allows it, or post on its business day. People often reply "following" or tag a friend who runs a business. Reply to those too.</p>
      </PostBlock>
      <PostBlock title="Post 2: Quick win" text={p.quick_win} />
      <PostBlock title="Post 3: Story or result" text={p.story}>
        {/\[/.test(p.story || "") && <p className="note mt-3">Fill in the parts in [brackets] with a real story. Never invent a result.</p>}
      </PostBlock>
      <PostBlock title="Post 4: Introduction (local groups)" text={p.intro}>
        <p className="note mt-3">Post this on the group's business or promo day, or in its welcome thread.</p>
      </PostBlock>
    </div>
  );
}

function HowTab() {
  return (
    <div className="flex flex-col gap-6">
      <section className="panel">
        <div className="panel-head"><h2>Your rhythm</h2></div>
        <div className="panel-body flex flex-col gap-4">
          {RHYTHM.map(([w, t]) => <div key={w}><div className="font-semibold">{w}</div><p className="lp-p" style={{ marginTop: 4 }}>{t}</p></div>)}
        </div>
      </section>
      <section className="panel">
        <div className="panel-head"><h2>What not to automate</h2></div>
        <div className="panel-body flex flex-col gap-4">
          {DONT_AUTOMATE.map(([w, t]) => <div key={w}><div className="font-semibold">{w}</div><p className="lp-p" style={{ marginTop: 4 }}>{t}</p></div>)}
          <p className="note">You always post, comment and reply yourself. This tool only finds the groups and writes posts for you to paste.</p>
        </div>
      </section>
    </div>
  );
}

function ResultsStep({ search, save }) {
  const [tab, setTab] = useState("groups");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const short = search.shortfall || {};
  const extra = (search.round || 1) - 1;
  const findMore = async () => {
    setBusy("Choosing more searches...");
    setErr("");
    try {
      const used = (search.runs || []).map((r) => r.keyword);
      const out = await callAI({ prompt: moreKeywordsPrompt(search, used, short), response_json_schema: MORE_SCHEMA });
      const fresh = (out?.keywords || []).filter((k) => !used.map((u) => u.toLowerCase()).includes(k.keyword.toLowerCase())).slice(0, 5);
      if (!fresh.length) throw new Error("No new searches to try.");
      const round = (search.round || 1) + 1;
      await save({ runs: queueKeywords(search, fresh, round), round, stage: "searching", error: "" });
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy("");
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <section className="lp-card">
        <div className="lp-body" style={{ padding: "22px 28px" }}>
          <h2 className="lp-card-title" style={{ fontSize: 20 }}>{(search.groups || []).length} groups for {search.business_name}</h2>
          <p className="lp-p">Every group averages 10 or more posts a day, unless it's marked otherwise. We checked {search.dropped?.checked || 0} active groups and removed {search.dropped?.total || 0}: marketers' groups, advertising walls, wrong-place groups and groups that ban marketers.</p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button type="button" className="btn btn-primary" onClick={() => downloadCSV(search)}>Download the spreadsheet</button>
            <span className="note">Open Google Sheets, then File, Import, Upload. The averages and the 10-a-day check calculate by themselves.</span>
          </div>
          {(short.niche > 0 || short.local > 0) && (
            <div className="mt-5 pt-4 border-t border-app-border">
              <p className="text-[15px]">We found {short.niche ? `${10 - short.niche} niche` : "10 niche"} and {short.local ? `${10 - short.local} local` : "10 local"} groups busy enough. {extra < MAX_EXTRA_ROUNDS ? "Want to try a few more searches?" : "That's everything we could find that's this busy. Niche business audiences often only have 5 or 6 groups this active."}</p>
              {extra < MAX_EXTRA_ROUNDS && <button type="button" className="btn btn-quiet mt-3" onClick={findMore} disabled={!!busy}>{busy || "Find more groups"}</button>}
              {err && <div className="lp-error mt-2">{err}</div>}
            </div>
          )}
        </div>
      </section>
      <Tabs tabs={[{ id: "groups", label: "Your groups" }, { id: "posts", label: "Your posts" }, { id: "how", label: "How to use them" }]} active={tab} onChange={setTab} />
      {tab === "groups" && <GroupsTab search={search} save={save} />}
      {tab === "posts" && <PostsTab search={search} />}
      {tab === "how" && <HowTab />}
    </div>
  );
}

// ---------- page ----------
export default function Search() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(null);
  const [business, setBusiness] = useState(null);
  const [runError, setRunError] = useState("");
  const ticking = useRef(false);
  const latest = useRef(null);
  latest.current = search;

  useEffect(() => {
    base44.entities.GroupSearch.get(id).then((s) => (s ? setSearch(s) : navigate("/"))).catch(() => navigate("/"));
  }, [id]);

  useEffect(() => {
    if (search?.business_id) base44.entities.Business.get(search.business_id).then((b) => setBusiness(b || null)).catch(() => {});
  }, [search?.business_id]);

  const save = useCallback(async (patch) => {
    const next = { ...latest.current, ...patch };
    setSearch(next);
    await base44.entities.GroupSearch.update(id, patch);
  }, [id]);

  // While searching: tick now and every 12 seconds.
  useEffect(() => {
    if (search?.stage !== "searching" || search?.error) return undefined;
    const run = async () => {
      if (ticking.current) return;
      ticking.current = true;
      try {
        const before = latest.current;
        const after = await tick(before, business);
        const patch = { runs: after.runs, candidates: after.candidates, phase: after.phase || "", error: after.error || "" };
        if (after.stage === "results") Object.assign(patch, { stage: "results", groups: after.groups, shortfall: after.shortfall, dropped: after.dropped, posts: after.posts, checked_date: after.checked_date });
        await save(patch);
        setRunError("");
      } catch (e) {
        setRunError(e.message === "NO_KEY" ? "Connect your Apify account in Settings first." : `Something went wrong: ${e.message}. It will try again in a few seconds.`);
      } finally {
        ticking.current = false;
      }
    };
    run();
    const t = setInterval(run, POLL_MS);
    return () => clearInterval(t);
  }, [search?.stage, search?.error, business, save]);

  if (!search) return <PageSkeleton />;
  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="hint inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> All searches</Link>
        {search.stage === "results" && <span className="hint">{sheetTitle(search)}</span>}
      </div>
      {search.stage === "who" && <WhoStep search={search} save={save} />}
      {search.stage === "about" && <AboutStep search={search} save={save} />}
      {search.stage === "keywords" && <KeywordsStep search={search} save={save} />}
      {search.stage === "searching" && <SearchingStep search={search} runError={runError} save={save} />}
      {search.stage === "results" && <ResultsStep search={search} save={save} />}
    </div>
  );
}
