import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/shared/PageHeader";
import { apifyCall } from "@/lib/fbgRunner";
import { PageSkeleton } from "@/components/shared/Skeleton";

export default function Settings() {
  const [row, setRow] = useState(undefined);
  const [token, setToken] = useState("");
  const [state, setState] = useState({ busy: false, msg: "", ok: null });
  const [businesses, setBusinesses] = useState([]);

  const load = () => {
    base44.entities.AppSettings.filter({}, { limit: 1 }).then(({ items }) => {
      const r = items?.[0] || null;
      setRow(r);
      setToken(r?.apify_token || "");
    }).catch(() => setRow(null));
    base44.entities.Business.filter({}, { sort: "name", limit: 200 }).then(({ items }) => setBusinesses(items || [])).catch(() => {});
  };
  useEffect(load, []);

  const save = async () => {
    setState({ busy: true, msg: "", ok: null });
    try {
      const value = token.trim();
      let r = row;
      if (r) { await base44.entities.AppSettings.update(r.id, { apify_token: value }); r = { ...r, apify_token: value }; }
      else r = await base44.entities.AppSettings.create({ apify_token: value });
      setRow(r);
      const check = await apifyCall({ action: "check" });
      await base44.entities.AppSettings.update(r.id, { apify_username: check.username || "" });
      setRow({ ...r, apify_username: check.username || "" });
      setState({ busy: false, ok: true, msg: `Connected to Apify${check.username ? ` as ${check.username}` : ""}.` });
    } catch (e) {
      setState({ busy: false, ok: false, msg: e.message === "NO_KEY" ? "Paste your Apify API token first." : `That key didn't work: ${e.message}` });
    }
  };

  const removeBusiness = async (b) => {
    if (!window.confirm(`Delete the saved details for ${b.name}? Your past searches stay.`)) return;
    await base44.entities.Business.delete(b.id);
    setBusinesses((list) => list.filter((x) => x.id !== b.id));
  };

  if (row === undefined) return <PageSkeleton />;

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <PageHeader title="Settings" subtitle="Your Apify connection and your saved businesses." />

      <section className="panel">
        <div className="panel-head"><h2>Apify</h2>{row?.apify_username && <span className="count">Connected as {row.apify_username}</span>}</div>
        <div className="panel-body flex flex-col gap-4">
          <p className="lp-p" style={{ marginTop: 0 }}>Apify is what searches Facebook for public group information. It never logs into Facebook, joins groups or posts anything.</p>
          <ol className="list-decimal pl-5 text-[15px] leading-relaxed">
            <li>Create a free account at <a className="underline" href="https://apify.com" target="_blank" rel="noreferrer">apify.com</a>.</li>
            <li>In Apify, open <b>Settings</b>, then <b>API & Integrations</b>.</li>
            <li>Copy your <b>Personal API token</b> and paste it below.</li>
          </ol>
          <div className="field field-q">
            <label htmlFor="tok">Apify API token</label>
            <input id="tok" className="input" type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="apify_api_..." autoComplete="off" />
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="btn btn-primary" onClick={save} disabled={state.busy || !token.trim()}>{state.busy ? "Checking..." : "Save and check"}</button>
            {state.msg && <span className={state.ok ? "text-[#2d6a4f] text-sm" : "lp-error"}>{state.msg}</span>}
          </div>
          <p className="note">Cost: each keyword search is capped at $0.30. A full search uses 12 to 20 of them and usually costs $0.50 to $1.50. The free Apify plan includes monthly credit; see exactly what you've spent in Apify under Billing.</p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Saved businesses</h2><span className="count">{businesses.length}</span></div>
        {businesses.length === 0 ? (
          <div className="panel-body"><p className="note">Businesses you search for are saved here, so you only answer the basics once. Add one when you start a <Link to="/" className="underline">new search</Link>.</p></div>
        ) : (
          <ul>
            {businesses.map((b) => (
              <li key={b.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-app-border last:border-b-0">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{b.name} <span className="hint">{b.whose === "client" ? "(client)" : "(your business)"}</span></div>
                  <div className="hint truncate">{[b.what_they_do, [b.town, b.region].filter(Boolean).join(", ")].filter(Boolean).join(" \u00B7 ")}</div>
                </div>
                <button type="button" className="btn btn-quiet" onClick={() => removeBusiness(b)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <div className="panel-head"><h2>Your app</h2></div>
        <div className="panel-body"><Link to="/setup-check" className="underline">Check my setup</Link></div>
      </section>
    </div>
  );
}
