"use client";

import { useState } from "react";
import { Card, Badge, BarChart, SectionHeader } from "@/components/ui";
import { getDay } from "@/lib/storage";
import { StudySession } from "@/lib/constants";
import type { useStore } from "@/hooks/useStore";

type StoreType = ReturnType<typeof useStore>;

export function Study({ store }: { store: StoreType }) {
  const { studySessions, totalStudyHrs, addStudySession, deleteStudySession, today } = store;
  const [subject, setSubject] = useState("");
  const [minutes, setMinutes] = useState("");
  const [note,    setNote]    = useState("");

  const handleAdd = () => {
    if (!subject.trim() || !minutes) return;
    addStudySession({ subject: subject.trim(), minutes: parseInt(minutes), note: note.trim() });
    setSubject(""); setMinutes(""); setNote("");
  };

  // Weekly bar chart data
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const k = d.toISOString().split("T")[0];
    const sessions = getDay<StudySession[]>("study", [], k);
    const hrs = sessions.reduce((s, x) => s + (x.minutes || 0), 0) / 60;
    return {
      key:   k,
      label: d.toLocaleDateString("en", { weekday: "narrow" }),
      value: +hrs.toFixed(1),
    };
  });

  return (
    <div className="space-y-4">
      <SectionHeader title="📚 Study Tracker" right={<Badge color="sky">{totalStudyHrs}h today</Badge>} />

      {/* Log form */}
      <Card className="bg-slate-800 space-y-3">
        <input value={subject} onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject name"
          className="w-full bg-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none placeholder-slate-500 border border-transparent focus:border-indigo-500 transition-colors" />
        <input value={minutes} onChange={(e) => setMinutes(e.target.value)} type="number"
          placeholder="Minutes studied"
          className="w-full bg-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none placeholder-slate-500 border border-transparent focus:border-indigo-500 transition-colors" />
        <input value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="Notes (optional)"
          className="w-full bg-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none placeholder-slate-500 border border-transparent focus:border-indigo-500 transition-colors" />
        <button onClick={handleAdd}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-colors">
          Log Session +15 XP/hr
        </button>
      </Card>

      {/* Sessions list */}
      {studySessions.length > 0 && (
        <div className="space-y-2">
          {studySessions.map((s) => (
            <div key={s.id} className="bg-slate-800 rounded-xl px-4 py-3 flex justify-between items-center">
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold text-sm truncate">{s.subject}</p>
                {s.note && <p className="text-slate-500 text-xs truncate">{s.note}</p>}
              </div>
              <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                <Badge color="sky">{s.minutes}m</Badge>
                <button onClick={() => deleteStudySession(s.id)} className="text-rose-500 text-sm">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Weekly chart */}
      <Card className="bg-slate-800">
        <p className="text-slate-400 text-xs font-semibold mb-3">Weekly Study Hours</p>
        <BarChart data={weekData} maxValue={8} activeColor="bg-sky-500" today={today} />
      </Card>
    </div>
  );
}
