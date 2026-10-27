import React from "react";
import { cn } from "@/lib/utils";

// Brand tabs: words on a hairline, the active one underlined in ink. No pills.
export default function Tabs({ tabs, active, onChange, className }) {
  return (
    <div role="tablist" className={cn("flex gap-6 border-b border-app-border overflow-x-auto", className)}>
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "min-h-11 -mb-px border-b-2 pb-2 pt-2 text-[0.9375rem] font-semibold whitespace-nowrap",
            active === t.id ? "border-app-text text-app-text" : "border-transparent text-app-muted"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
