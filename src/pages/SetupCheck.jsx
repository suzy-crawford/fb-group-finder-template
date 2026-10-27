import React, { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { apifyCall } from "@/lib/fbgRunner";
import { callAI } from "@/lib/callAI";
import { Check, X } from "@/components/brand/icons";
import { cn } from "@/lib/utils";
import { PageSkeleton } from "@/components/shared/Skeleton";

// Is this an exact copy of the template? Loaded on demand (it reads every source file).
function CopyCheck() {
  const [copy, setCopy] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    import("@/lib/copyCheck")
      .then((m) => m.runCopyCheck())
      .then(setCopy)
      .catch((e) => setError(e.message || String(e)));
  }, []);
  if (error) {
    return (
      <div className="rounded-xl border-2 border-app-danger p-5 mb-6">
        <div className="text-lg font-semibold text-app-danger">Copy check couldn't run</div>
        <p className="text-app-text text-sm mt-1">{error}</p>
      </div>
    );
  }
  if (!copy) {
    return (
      <div className="rounded-xl border-2 border-app-border p-5 mb-6">
        <div className="text-lg font-semibold text-app-text">Checking your copy...</div>
        <p className="text-app-muted text-sm mt-1">Comparing every file in your app with the template.</p>
      </div>
    );
  }
  const exact = copy.matched === copy.total;
  const off = [...copy.changed.map((f) => ({ ...f, how: "changed" })), ...copy.missing.map((f) => ({ ...f, how: "missing" }))];
  return (
    <div className={cn("rounded-xl border-2 p-5 mb-6", exact ? "border-app-success" : "border-app-danger")}>
      <div className={cn("text-lg font-semibold", exact ? "text-app-success" : "text-app-danger")}>
        Copy check: {copy.matched} of {copy.total} files match version {copy.version}
      </div>
      <p className="text-app-text text-sm mt-1">
        {exact
          ? "Your app is an exact copy of FB Group Finder."
          : `Some files aren't exact copies. In Base44, send this: "Redo part ${copy.parts.join(" and part ")} of COPY.md exactly, then stop." Then run this check again.`}
      </p>
      {!exact && (
        <ul className="mt-3 space-y-1">
          {off.slice(0, 40).map((f) => (
            <li key={f.file} className="text-xs text-app-muted break-words">
              Part {f.part}: {f.file} ({f.how})
            </li>
          ))}
          {off.length > 40 && <li className="text-xs text-app-muted">and {off.length - 40} more</li>}
        </ul>
      )}
    </div>
  );
}

function Row({ name, state, detail }) {
  const pass = state === "pass";
  return (
    <li className="rounded-lg border border-app-border bg-app-bg p-4 flex items-start gap-3">
      <span className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", state === "wait" ? "bg-app-border" : pass ? "bg-app-success text-app-on-primary" : "bg-app-danger text-app-on-primary")}>
        {state === "wait" ? null : pass ? <Check className="w-3 h-3" strokeWidth={3} /> : <X className="w-3 h-3" strokeWidth={3} />}
      </span>
      <div className="min-w-0">
        <div className="text-sm font-medium text-app-text">{name}</div>
        <div className="text-xs text-app-muted mt-1 break-words">{detail}</div>
      </div>
    </li>
  );
}

export default function SetupCheck() {
  const [apify, setApify] = useState({ state: "wait", detail: "Checking..." });
  const [ai, setAi] = useState({ state: "wait", detail: "Checking..." });

  useEffect(() => {
    apifyCall({ action: "check" })
      .then((r) => setApify({ state: "pass", detail: `Connected${r.username ? ` as ${r.username}` : ""}.` }))
      .catch((e) => setApify({ state: "fail", detail: e.message === "NO_KEY" ? "Not connected yet. Add your Apify API token in Settings." : e.message }));
    callAI({ prompt: "Reply with the word ready.", response_json_schema: { type: "object", properties: { word: { type: "string" } }, required: ["word"] } })
      .then((r) => setAi(r?.word ? { state: "pass", detail: "The AI is answering." } : { state: "fail", detail: "No answer came back." }))
      .catch((e) => setAi({ state: "fail", detail: e.message }));
  }, []);

  return (
    <div>
      <PageHeader title="Setup check" subtitle="Verifies your copy of FB Group Finder is complete and exact." />
      <CopyCheck />
      <ul className="space-y-2">
        <Row name="Apify (searches Facebook)" {...apify} />
        <Row name="AI (checks groups and writes posts)" {...ai} />
      </ul>
    </div>
  );
}
