"use client";

import { QUOTES, LEVELS } from "@/lib/constants";
import { getLevel, levelProgress } from "@/lib/xp";
import { Card, Badge, ProgressRing, ProgressBar } from "@/components/ui";
import type { useStore } from "@/hooks/useStore";

type StoreType = ReturnType<typeof useStore>;

export function Dashboard({ store }: { store: StoreType }) {
  const { taskPct, doneTasks, allTasks, totalStudyHrs, coding, fitness, water, xp, streak } = store;
  const quote   = QUOTES[new Date().getDay() % QUOTES.length];
  const level   = getLevel(xp);
  const lvlPct  = levelProgress(xp);
  const nextLvl = LEVELS[LEVELS.indexOf(level) + 1];
  const date    = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-600 to-violet-700">
        <p className="text-indigo-200 text-sm">{date}</p>
        <h1 className="text-2xl font-bold text-white mt-1">Hey Chaithu 👋</h1>
        <p className="text-indigo-100 text-sm mt-3 italic leading-relaxed">"{quote}"</p>
      </div>

      {/* Task ring + streak/xp */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-slate-800 flex flex-col items-center justify-center gap-1 py-5">
          <div className="relative flex items-center justify-center">
            <ProgressRing percent={taskPct} size={88} />
            <span className="absolute text-white font-bold text-xl">{taskPct}%</span>
          </div>
          <span className="text-slate-400 text-xs mt-1">{doneTasks}/{allTasks.length} tasks</span>
        </Card>
        <Card className="bg-slate-800 flex flex-col justify-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔥</span>
            <div>
              <p className="text-white font-bold text-2xl leading-none">{streak}</p>
              <p className="text-slate-400 text-xs mt-0.5">Day streak</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{level.icon}</span>
            <div>
              <p className="text-white font-bold text-lg leading-none">{xp} XP</p>
              <p className="text-slate-400 text-xs mt-0.5">{level.name}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        {([
          { icon: "📚", label: "Study Today",  val: `${totalStudyHrs}h`,                 color: "sky"   },
          { icon: "💻", label: "DSA Solved",   val: `${coding.dsa} problems`,             color: "indigo"},
          { icon: "💪", label: "Workout",      val: fitness.done ? "Done ✓" : "Not yet", color: fitness.done ? "green" : "rose" },
          { icon: "💧", label: "Water",        val: `${(water / 1000).toFixed(1)}L / 3L`, color: "sky"  },
        ] as const).map((s) => (
          <Card key={s.label} className="bg-slate-800">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-white font-semibold mt-1">{s.val}</p>
            <p className="text-slate-400 text-xs">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* XP Level bar */}
      <Card className="bg-slate-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-semibold">{level.icon} {level.name}</span>
          <Badge color="indigo">{xp} XP</Badge>
        </div>
        <ProgressBar pct={lvlPct} />
        <p className="text-slate-500 text-xs mt-1.5">
          {nextLvl ? `${nextLvl.min - xp} XP to ${nextLvl.name}` : "🎉 Max level reached!"}
        </p>
      </Card>
    </div>
  );
}
