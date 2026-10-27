import React, { useEffect, useState } from "react";
import { asset } from "@/lib/assets";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Search, Settings, Menu, Close, Lessons, Community } from "@/components/brand/icons";
import { LEARNING_LINKS } from "@/lib/constants";

// Brand kit v3 shell: midnight sidebar, off-white page, content left aligned.
// NavLink sets aria-current="page" on the active item, which app.css styles.

function Sidebar({ onNavigate }) {
  return (
    <>
      <div className="ws ws-2">
        <img src={asset("/brand/logo-wordmark-night-ai.svg")} className="ws-mark" alt="SheFreelances AI" />
        <span>FB Group Finder</span>
      </div>
      <NavLink to="/" end className="nav-item" onClick={onNavigate}>
        <Search />
        Your searches
      </NavLink>
      <div className="nav-label">Skool</div>
      <a className="nav-item" href={LEARNING_LINKS.course} target="_blank" rel="noreferrer">
        <Lessons />
        Course
      </a>
      <a className="nav-item" href={LEARNING_LINKS.community} target="_blank" rel="noreferrer">
        <Community />
        Community
      </a>
      <div className="side-foot">
        <NavLink to="/settings" className="nav-item" onClick={onNavigate}>
          <Settings />
          Settings
        </NavLink>
      </div>
    </>
  );
}

export default function AppLayout() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => setDrawerOpen(false), [location.pathname]);

  return (
    <div className="app">
      <aside className="side" aria-label="Main">
        <Sidebar />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex min-[861px]:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <aside className="side relative w-[260px] max-w-[85vw] h-full overflow-y-auto" style={{ display: "flex" }} aria-label="Main">
            <button
              type="button"
              className="self-end w-10 h-10 inline-flex items-center justify-center text-[color:var(--a-side-muted)]"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
            >
              <Close className="w-5 h-5" />
            </button>
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      <div className="min-w-0">
        <div className="mobile-bar">
          <img src={asset("/brand/logo-wordmark-night-ai.svg")} className="ws-mark-sm" alt="SheFreelances AI" />
          <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
            <Menu />
          </button>
        </div>
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
