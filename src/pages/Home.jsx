import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, ChevronRight } from "@/components/brand/icons";
import { base44 } from "@/api/base44Client";
import ToolHero from "@/components/shared/ToolHero";
import { ListSkeleton } from "@/components/shared/Skeleton";
import UpdateBanner from "@/components/shared/UpdateBanner";

const STAGE_LABEL = { who: "Setting up", about: "Setting up", keywords: "Choosing keywords", searching: "Searching", results: "Done" };

export default function Home() {
  const navigate = useNavigate();
  const [searches, setSearches] = useState(null);
  const [hasKey, setHasKey] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    base44.entities.GroupSearch.filter({}, { sort: "-updated_date", limit: 200 })
      .then(({ items }) => setSearches(items || []))
      .catch(() => setSearches([]));
    base44.entities.AppSettings.filter({}, { limit: 1 })
      .then(({ items }) => setHasKey(!!items?.[0]?.apify_token))
      .catch(() => setHasKey(false));
  }, []);

  const startNew = async () => {
    setCreating(true);
    try {
      const s = await base44.entities.GroupSearch.create({ stage: "who" });
      navigate(`/search/${s.id}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <UpdateBanner />
      <ToolHero
        icon={Facebook}
        title="FB Group Finder"
        subtitle="Find the 20 busiest Facebook groups where your ideal clients spend time, then get posts written for your business, ready to paste."
        right={
          <button type="button" className="btn btn-primary" onClick={startNew} disabled={creating}>
            {creating ? "Starting..." : "New search"}
          </button>
        }
      />
      {!hasKey && (
        <section className="panel">
          <div className="panel-body">
            <div className="font-semibold">One step before your first search</div>
            <p className="lp-p">This tool searches Facebook through your own Apify account. It's free to sign up, and a search costs about $0.50 to $1.50 of Apify credit.</p>
            <Link to="/settings" className="btn btn-primary mt-4 inline-flex">Connect Apify</Link>
          </div>
        </section>
      )}
      {searches === null ? (
        <ListSkeleton rows={3} />
      ) : searches.length === 0 ? (
        <section className="panel">
          <div className="empty">
            <div className="empty-title">No searches yet</div>
            <p className="empty-text">Answer a few questions about your business and we'll find 10 niche groups and 10 local groups that average 10 or more posts a day. It takes about 20 to 30 minutes, and you can leave the page while it runs.</p>
            <button type="button" className="btn btn-primary" onClick={startNew} disabled={creating}>Find my groups</button>
          </div>
        </section>
      ) : (
        <section className="panel">
          <div className="panel-head">
            <h2>Your searches</h2>
            <span className="count">{searches.length}</span>
          </div>
          <ul>
            {searches.map((s) => (
              <li key={s.id} className="border-b border-app-border last:border-b-0">
                <Link to={`/search/${s.id}`} className="flex items-center gap-4 px-4 py-3.5">
                  <span className="initial-sm" aria-hidden="true">{(s.business_name || "?").charAt(0).toUpperCase()}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-app-text truncate">{s.business_name || "New search"}</div>
                    <div className="hint truncate">{[s.service, s.town].filter(Boolean).join(" \u00B7 ") || "Not started"}</div>
                  </div>
                  <span className="stage">{s.stage === "results" ? `${(s.groups || []).length} groups` : STAGE_LABEL[s.stage] || "Setting up"}</span>
                  <ChevronRight className="w-5 h-5 text-app-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
