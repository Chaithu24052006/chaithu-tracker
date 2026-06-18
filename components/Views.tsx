"use client";

import { useState } from "react";
import { Card, Badge, BarChart, SectionHeader, ProgressBar } from "@/components/ui";
import { MOODS, ProjectTask } from "@/lib/constants";
import { getDay } from "@/lib/storage";
import { CodingData, FitnessData, StudySession } from "@/lib/constants";
import type { useStore } from "@/hooks/useStore";

type StoreType = ReturnType<typeof useStore>;

// ─── Coding ─────────────────────────────────────────────────────────────────
export function Coding({ store }: { store: StoreType }) {
  const { coding, updateCoding } = store;
  const codingHrs = +(coding.time / 60).toFixed(1);

  return (
    <div className="space-y-4">
      <SectionHeader title="💻 Coding Tracker" />

      <Card className="bg-slate-800 space-y-5">
        {/* DSA counter */}
        <div>
          <label className="text-slate-400 text-xs font-semibold block mb-2">DSA Problems Solved Today</label>
          <div className="flex items-center gap-4">
            <button onClick={() => updateCoding("dsa", Math.max(0, coding.dsa - 1))}
              className="bg-slate-700 hover:bg-slate-600 text-white w-11 h-11 rounded-xl font-bold text-xl transition-colors">−</button>
            <span className="text-white font-black text-3xl flex-1 text-center">{coding.dsa}</span>
            <button onClick={() => updateCoding("dsa", coding.dsa + 1)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white w-11 h-11 rounded-xl font-bold text-xl transition-colors">+</button>
          </div>
          <p className="text-slate-500 text-xs text-center mt-1.5">+10 XP per problem</p>
        </div>

        {/* Coding time */}
        <div>
          <label className="text-slate-400 text-xs font-semibold block mb-2">Coding Time (minutes)</label>
          <input type="number"
            value={coding.time || ""}
            onChange={(e) => updateCoding("time", parseInt(e.target.value) || 0)}
            className="w-full bg-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none border border-transparent focus:border-indigo-500 transition-colors" />
        </div>

        {/* GitHub */}
        <div>
          <label className="text-slate-400 text-xs font-semibold block mb-2">GitHub Work Done</label>
          <input value={coding.github}
            onChange={(e) => updateCoding("github", e.target.value)}
            placeholder="e.g. Pushed 3 commits to TMS"
            className="w-full bg-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none placeholder-slate-600 border border-transparent focus:border-indigo-500 transition-colors" />
        </div>

        {/* Topic */}
        <div>
          <label className="text-slate-400 text-xs font-semibold block mb-2">Learning Topic</label>
          <input value={coding.topic}
            onChange={(e) => updateCoding("topic", e.target.value)}
            placeholder="e.g. Binary Search, React hooks"
            className="w-full bg-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none placeholder-slate-600 border border-transparent focus:border-indigo-500 transition-colors" />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-slate-800 text-center">
          <p className="text-indigo-400 font-black text-2xl">{coding.dsa}</p>
          <p className="text-slate-500 text-xs mt-1">DSA solved</p>
        </Card>
        <Card className="bg-slate-800 text-center">
          <p className="text-sky-400 font-black text-2xl">{codingHrs}h</p>
          <p className="text-slate-500 text-xs mt-1">Coded</p>
        </Card>
        <Card className="bg-slate-800 text-center">
          <p className="text-violet-400 font-black text-2xl">{coding.dsa * 10}</p>
          <p className="text-slate-500 text-xs mt-1">XP earned</p>
        </Card>
      </div>
    </div>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<ProjectTask["status"], string> = {
  "Todo":        "bg-slate-600 text-slate-200",
  "In Progress": "bg-amber-600 text-white",
  "Done":        "bg-emerald-600 text-white",
};

export function Projects({ store }: { store: StoreType }) {
  const { projects, addProject, deleteProject, updateProjectStatus } = store;
  const [form, setForm] = useState<Omit<ProjectTask, "id">>({ name: "", task: "", status: "Todo" });

  const donePct = projects.length
    ? Math.round((projects.filter((p) => p.status === "Done").length / projects.length) * 100) : 0;

  const handleAdd = () => {
    if (!form.name.trim() || !form.task.trim()) return;
    addProject(form);
    setForm({ name: "", task: "", status: "Todo" });
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="🚀 Projects" right={<Badge color="indigo">{donePct}% done</Badge>} />

      {projects.length > 0 && <ProgressBar pct={donePct} color="bg-emerald-500" />}

      <Card className="bg-slate-800 space-y-3">
        <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Project name"
          className="w-full bg-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none placeholder-slate-600 border border-transparent focus:border-indigo-500 transition-colors" />
        <input value={form.task} onChange={(e) => setForm((p) => ({ ...p, task: e.target.value }))}
          placeholder="Task description"
          className="w-full bg-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none placeholder-slate-600 border border-transparent focus:border-indigo-500 transition-colors" />
        <div className="flex gap-2">
          {(["Todo", "In Progress", "Done"] as ProjectTask["status"][]).map((s) => (
            <button key={s} onClick={() => setForm((p) => ({ ...p, status: s }))}
              className={`flex-1 text-xs py-2 rounded-xl font-semibold transition-colors ${
                form.status === s ? STATUS_COLORS[s] : "bg-slate-700 text-slate-400"}`}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={handleAdd}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-colors">
          Add Task +20 XP when done
        </button>
      </Card>

      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="bg-slate-800 rounded-xl px-4 py-3">
            <div className="flex justify-between items-start mb-2.5">
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold text-sm">{p.name}</p>
                <p className="text-slate-400 text-xs mt-0.5 truncate">{p.task}</p>
              </div>
              <button onClick={() => deleteProject(p.id)} className="text-rose-500 text-sm ml-3 flex-shrink-0">✕</button>
            </div>
            <div className="flex gap-1.5">
              {(["Todo", "In Progress", "Done"] as ProjectTask["status"][]).map((s) => (
                <button key={s} onClick={() => updateProjectStatus(p.id, s)}
                  className={`flex-1 text-xs py-1.5 rounded-lg transition-colors ${
                    p.status === s ? STATUS_COLORS[s] : "bg-slate-700 text-slate-500"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Health ─────────────────────────────────────────────────────────────────
export function Health({ store }: { store: StoreType }) {
  const { fitness, setFitness, toggleWorkout, skincare, toggleSkincare, skincarePct, water, addWater, sleep, setSleep, mood, setMood, moodNote, setMoodNote, sleepHrs } = store;

  const sleepQuality = () => {
    if (!sleepHrs) return null;
    if (sleepHrs >= 8) return { label: "Excellent 😴", color: "text-emerald-400" };
    if (sleepHrs >= 7) return { label: "Good 🙂",      color: "text-sky-400"     };
    if (sleepHrs >= 6) return { label: "Okay 😐",      color: "text-amber-400"   };
    return                    { label: "Poor 😔",      color: "text-rose-400"    };
  };

  const waterPct = Math.min(100, (water / 3000) * 100);

  return (
    <div className="space-y-4">
      {/* Fitness */}
      <Card className="bg-slate-800">
        <h3 className="text-white font-bold mb-3">💪 Fitness</h3>
        <button onClick={toggleWorkout}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
            fitness.done ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-300"}`}>
          {fitness.done ? "✓ Workout Done! +20 XP" : "Mark Workout Done"}
        </button>
        {fitness.done && (
          <div className="space-y-2 mt-3">
            <input value={fitness.type}
              onChange={(e) => setFitness((p: FitnessData) => ({ ...p, type: e.target.value }))}
              placeholder="Workout type (Gym, Run, etc.)"
              className="w-full bg-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none placeholder-slate-600" />
            <input type="number" value={fitness.duration || ""}
              onChange={(e) => setFitness((p: FitnessData) => ({ ...p, duration: parseInt(e.target.value) || 0 }))}
              placeholder="Duration (minutes)"
              className="w-full bg-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none placeholder-slate-600" />
          </div>
        )}
      </Card>

      {/* Skincare */}
      <Card className="bg-slate-800">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-bold">🧴 Skincare</h3>
          <Badge color={skincarePct === 100 ? "green" : "amber"}>{skincarePct}%</Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-400 text-xs mb-2">🌅 Morning</p>
            {([["cleanser","Cleanser"],["moisturizer","Moisturizer"],["sunscreen","SPF 60"]] as [string,string][]).map(([k,l]) => (
              <button key={k} onClick={() => toggleSkincare("morning", k)}
                className={`w-full text-left text-xs px-3 py-2 rounded-lg mb-1.5 font-medium transition-colors ${
                  skincare.morning[k as keyof typeof skincare.morning] ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-300"}`}>
                {skincare.morning[k as keyof typeof skincare.morning] ? "✓ " : ""}{l}
              </button>
            ))}
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-2">🌙 Night</p>
            {([["faceWash","Face Wash"],["treatment","Treatment"],["moisturizer","Moisturizer"]] as [string,string][]).map(([k,l]) => (
              <button key={k} onClick={() => toggleSkincare("night", k)}
                className={`w-full text-left text-xs px-3 py-2 rounded-lg mb-1.5 font-medium transition-colors ${
                  skincare.night[k as keyof typeof skincare.night] ? "bg-violet-600 text-white" : "bg-slate-700 text-slate-300"}`}>
                {skincare.night[k as keyof typeof skincare.night] ? "✓ " : ""}{l}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Water */}
      <Card className="bg-slate-800">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-bold">💧 Water</h3>
          <Badge color="sky">{(water / 1000).toFixed(2)}L / 3L</Badge>
        </div>
        <ProgressBar pct={waterPct} color="bg-sky-500" />
        <p className="text-slate-500 text-xs mt-1.5 mb-3">{Math.max(0, 3000 - water)}ml remaining</p>
        <div className="flex gap-2">
          {([250, 500, 1000] as const).map((ml) => (
            <button key={ml} onClick={() => addWater(ml)}
              className="flex-1 bg-sky-700 hover:bg-sky-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
              +{ml >= 1000 ? "1L" : `${ml}ml`}
            </button>
          ))}
        </div>
      </Card>

      {/* Sleep */}
      <Card className="bg-slate-800">
        <h3 className="text-white font-bold mb-3">😴 Sleep</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-slate-400 text-xs block mb-1.5">Bedtime</label>
            <input type="time" value={sleep.bedtime}
              onChange={(e) => setSleep((p) => ({ ...p, bedtime: e.target.value }))}
              className="w-full bg-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none" />
          </div>
          <div>
            <label className="text-slate-400 text-xs block mb-1.5">Wake time</label>
            <input type="time" value={sleep.waketime}
              onChange={(e) => setSleep((p) => ({ ...p, waketime: e.target.value }))}
              className="w-full bg-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none" />
          </div>
        </div>
        {sleepHrs !== null && (
          <div className="flex items-center justify-between bg-slate-700 rounded-xl px-4 py-3">
            <span className="text-white font-bold text-xl">{sleepHrs} hrs</span>
            <span className={`font-semibold text-sm ${sleepQuality()?.color}`}>{sleepQuality()?.label}</span>
          </div>
        )}
      </Card>

      {/* Mood */}
      <Card className="bg-slate-800">
        <h3 className="text-white font-bold mb-3">🎭 Mood</h3>
        <div className="flex gap-2 mb-3">
          {MOODS.map((m) => (
            <button key={m.value} onClick={() => setMood(m.value as 2|3|4|5)}
              className={`flex-1 flex flex-col items-center py-2.5 rounded-xl transition-colors ${
                mood === m.value ? "bg-indigo-600" : "bg-slate-700"}`}>
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-slate-300 text-xs mt-1">{m.label}</span>
            </button>
          ))}
        </div>
        <input value={moodNote} onChange={(e) => setMoodNote(e.target.value)}
          placeholder="How was your day? (optional)"
          className="w-full bg-slate-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none placeholder-slate-600" />
      </Card>
    </div>
  );
}

// ─── Review ─────────────────────────────────────────────────────────────────
export function Review({ store }: { store: StoreType }) {
  const { doneTasks, allTasks, totalStudyHrs, coding, fitness, water, sleepHrs, mood, skincarePct, dailyScore, xp } = store;
  const { getLevel } = require("@/lib/xp");
  const level = getLevel(xp);
  const moodObj = MOODS.find((m) => m.value === mood);

  const rows = [
    { icon: "✅", label: "Tasks Completed",  val: `${doneTasks}/${allTasks.length}` },
    { icon: "📚", label: "Study Hours",      val: `${totalStudyHrs}h`               },
    { icon: "💻", label: "DSA Problems",     val: String(coding.dsa)               },
    { icon: "⌨️",  label: "Coding Time",     val: `${+(coding.time/60).toFixed(1)}h`},
    { icon: "💪", label: "Workout",          val: fitness.done ? (fitness.type || "Done ✓") : "Skipped" },
    { icon: "💧", label: "Water Intake",     val: `${(water/1000).toFixed(2)}L`    },
    { icon: "😴", label: "Sleep",            val: sleepHrs !== null ? `${sleepHrs}h` : "Not logged" },
    { icon: "🎭", label: "Mood",             val: moodObj ? `${moodObj.emoji} ${moodObj.label}` : "Not logged" },
    { icon: "🧴", label: "Skincare",         val: `${skincarePct}%`               },
  ];

  const gradients: Record<string, string> = {
    great: "from-emerald-600 to-teal-700",
    good:  "from-indigo-600 to-violet-700",
    ok:    "from-slate-700 to-slate-800",
  };
  const grad = dailyScore >= 80 ? gradients.great : dailyScore >= 60 ? gradients.good : gradients.ok;

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-lg">📊 Daily Review</h2>

      <div className={`rounded-2xl p-6 text-center bg-gradient-to-br ${grad}`}>
        <p className="text-white/70 text-sm mb-1">Daily Score</p>
        <p className="text-white font-black text-7xl leading-none">{dailyScore}</p>
        <p className="text-white/60 text-sm mt-1">out of 100</p>
        <p className="text-white mt-3 text-lg font-semibold">
          {dailyScore >= 80 ? "Outstanding! 🔥" : dailyScore >= 60 ? "Good job! 💪" : "Keep going! 💙"}
        </p>
      </div>

      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="bg-slate-800 rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="text-slate-300 text-sm">{r.icon} {r.label}</span>
            <span className="text-white font-semibold text-sm">{r.val}</span>
          </div>
        ))}
      </div>

      <Card className="bg-slate-800 text-center py-5">
        <p className="text-slate-400 text-sm">Total XP</p>
        <p className="text-indigo-400 font-black text-4xl mt-1">{xp}</p>
        <p className="text-slate-500 text-sm mt-1">{level.icon} {level.name}</p>
      </Card>
    </div>
  );
}

// ─── Stats ─────────────────────────────────────────────────────────────────
export function Stats({ store }: { store: StoreType }) {
  const { today } = store;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const k = d.toISOString().split("T")[0];
    const sessions = getDay<StudySession[]>("study", [], k);
    const coding   = getDay<CodingData>("coding", { dsa: 0, time: 0, github: "", topic: "" }, k);
    const fitness  = getDay<FitnessData>("fitness", { done: false, type: "", duration: 0 }, k);
    const water    = getDay<number>("water", 0, k);
    return {
      key:     k,
      label:   d.toLocaleDateString("en", { weekday: "narrow" }),
      study:   +(sessions.reduce((s, x) => s + (x.minutes || 0), 0) / 60).toFixed(1),
      dsa:     coding.dsa,
      fit:     fitness.done,
      water:   +(water / 1000).toFixed(1),
    };
  });

  const weekStudy   = last7.reduce((s, d) => s + d.study, 0).toFixed(1);
  const weekDSA     = last7.reduce((s, d) => s + d.dsa, 0);
  const workoutDays = last7.filter((d) => d.fit).length;
  const maxDSA      = Math.max(...last7.map((d) => d.dsa), 1);

  return (
    <div className="space-y-4">
      <h2 className="text-white font-bold text-lg">📈 Weekly Stats</h2>

      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-slate-800 text-center">
          <p className="text-sky-400 font-black text-2xl">{weekStudy}h</p>
          <p className="text-slate-500 text-xs mt-1">Study hrs</p>
        </Card>
        <Card className="bg-slate-800 text-center">
          <p className="text-indigo-400 font-black text-2xl">{weekDSA}</p>
          <p className="text-slate-500 text-xs mt-1">DSA solved</p>
        </Card>
        <Card className="bg-slate-800 text-center">
          <p className="text-emerald-400 font-black text-2xl">{workoutDays}/7</p>
          <p className="text-slate-500 text-xs mt-1">Workouts</p>
        </Card>
      </div>

      <Card className="bg-slate-800">
        <p className="text-slate-400 text-xs font-semibold mb-3">📚 Study Hours</p>
        <BarChart data={last7.map(day => ({
    key: day.key,
    label: day.label,
    value: day.study
  }))}
  maxValue={8}
  activeColor="bg-sky-500"
  today={today}
/ >
      </Card>

      <Card className="bg-slate-800">
        <p className="text-slate-400 text-xs font-semibold mb-3">💻 DSA Problems</p>
        <BarChart data={last7.map(d => ({...d, value: d.dsa}))} maxValue={maxDSA} activeColor="bg-indigo-500" today={today} />
      </Card>

      <Card className="bg-slate-800">
        <p className="text-slate-400 text-xs font-semibold mb-3">Daily Breakdown</p>
        <div className="space-y-2.5">
          {last7.map((d) => (
            <div key={d.key} className="flex items-center gap-2">
              <span className="text-slate-500 text-xs w-7 flex-shrink-0">
                {new Date(d.key + "T00:00:00").toLocaleDateString("en", { weekday: "short" })}
              </span>
              <span className={`text-xs px-2 py-1 rounded-lg ${d.study > 0 ? "bg-sky-900 text-sky-300" : "bg-slate-700 text-slate-600"}`}>{d.study}h</span>
              <span className={`text-xs px-2 py-1 rounded-lg ${d.dsa > 0 ? "bg-indigo-900 text-indigo-300" : "bg-slate-700 text-slate-600"}`}>{d.dsa} DSA</span>
              <span className={`text-xs px-2 py-1 rounded-lg ${d.fit ? "bg-emerald-900 text-emerald-300" : "bg-slate-700 text-slate-600"}`}>{d.fit ? "💪" : "—"}</span>
              <span className={`text-xs px-2 py-1 rounded-lg ${d.water >= 3 ? "bg-sky-900 text-sky-300" : "bg-slate-700 text-slate-600"}`}>{d.water}L</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
