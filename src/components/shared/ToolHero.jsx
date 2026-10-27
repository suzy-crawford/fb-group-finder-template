import React from "react";

// Tool page header (brand kit v3): small "AI tool" label, the tool name in Gloock,
// the one-sentence description, optional action on the right, optional underline tabs below.
export default function ToolHero({ title, subtitle, right, tabs, activeTab, onTabChange, label = "AI tool", tag, icon: Icon }) {
  return (
    <header>
      <div className="tool-head">
        {Icon && (
          <span className="tool-head-icon" aria-hidden="true">
            <Icon />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="tool-label">{label}</div>
          {tag ? (
            <div className="title-row">
              <h1 className="page-title">{title}</h1>
              {tag}
            </div>
          ) : (
            <h1 className="page-title">{title}</h1>
          )}
          {subtitle && <p className="lede">{subtitle}</p>}
        </div>
        {right}
      </div>
      {tabs && (
        <nav className="tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              className="tab bg-transparent border-x-0 border-t-0 cursor-pointer"
              aria-selected={activeTab === t.id}
              onClick={() => onTabChange(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
