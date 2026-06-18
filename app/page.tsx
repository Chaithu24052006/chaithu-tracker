"use client";

import { useState } from "react";
import { NAV_ITEMS, TabId } from "@/lib/constants";
import { useStore } from "@/hooks/useStore";
import { Dashboard }  from "@/components/Dashboard";
import { Tasks }      from "@/components/Tasks";
import { Study }      from "@/components/Study";
import { Coding, Projects, Health, Review, Stats } from "@/components/Views";

export default function Page() {
  const [tab, setTab] = useState<TabId>("dashboard");
  const store = useStore();

  const VIEWS: Record<TabId, React.ReactNode> = {
    dashboard: <Dashboard store={store} />,
    tasks:     <Tasks     store={store} />,
    study:     <Study     store={store} />,
    coding:    <Coding    store={store} />,
    projects:  <Projects  store={store} />,
    health:    <Health    store={store} />,
    review:    <Review    store={store} />,
    stats:     <Stats     store={store} />,
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* ── Header ── */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between safe-top">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 font-black text-xl">⚡</span>
          <span className="text-white font-bold tracking-tight">Chaithu Daily</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm">🔥 {store.streak}</span>
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2 py-0.5 rounded-full">
            {store.xp} XP
          </span>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="px-4 py-4 pb-28 max-w-lg mx-auto">
        {VIEWS[tab]}
      </main>

      {/* ── Bottom nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 safe-bottom">
        <div className="flex overflow-x-auto no-scrollbar max-w-lg mx-auto">
          {NAV_ITEMS.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`flex-1 min-w-[52px] flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                tab === n.id ? "text-indigo-400" : "text-slate-600"
              }`}
            >
              <span className="text-[18px] leading-none">{n.icon}</span>
              <span className={`text-[9px] font-semibold ${tab === n.id ? "text-indigo-400" : "text-slate-600"}`}>
                {n.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
