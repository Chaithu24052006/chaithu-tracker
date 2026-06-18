"use client";

import React from "react";

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl p-4 ${className}`}>{children}</div>;
}

// ─── ProgressRing ─────────────────────────────────────────────────────────────
export function ProgressRing({
  percent, size = 90, stroke = 8, color = "#818cf8",
}: { percent: number; size?: number; stroke?: number; color?: string }) {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#334155" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
    </svg>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
const BADGE_COLORS: Record<string, string> = {
  indigo: "bg-indigo-500/20 text-indigo-300",
  green:  "bg-emerald-500/20 text-emerald-300",
  amber:  "bg-amber-500/20 text-amber-300",
  rose:   "bg-rose-500/20 text-rose-300",
  sky:    "bg-sky-500/20 text-sky-300",
  violet: "bg-violet-500/20 text-violet-300",
};

export function Badge({ children, color = "indigo" }: { children: React.ReactNode; color?: string }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${BADGE_COLORS[color] ?? BADGE_COLORS.indigo}`}>
      {children}
    </span>
  );
}

// ─── BarChart ────────────────────────────────────────────────────────────────
export function BarChart({
  data, maxValue, activeColor = "bg-indigo-500", today,
}: {
  data: { label: string; value: number; key: string }[];
  maxValue: number;
  activeColor?: string;
  today: string;
}) {
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((d) => {
        const pct = maxValue > 0 ? Math.min(100, (d.value / maxValue) * 100) : 0;
        const isToday = d.key === today;
        return (
          <div key={d.key} className="flex-1 flex flex-col items-center gap-1 h-full">
            <div className="w-full flex-1 bg-slate-700 rounded-t flex items-end overflow-hidden">
              <div
                className={`w-full rounded-t transition-all ${isToday ? activeColor : "bg-slate-600"}`}
                style={{ height: `${pct || 2}%` }}
              />
            </div>
            <span className="text-slate-500 text-[10px]">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
export function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <h2 className="text-white font-bold text-lg">{title}</h2>
      {right}
    </div>
  );
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────
export function ProgressBar({ pct, color = "bg-indigo-500" }: { pct: number; color?: string }) {
  return (
    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
      <div className={`h-2 ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}
