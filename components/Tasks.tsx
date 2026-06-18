"use client";

import { useState } from "react";
import { TaskCategories } from "@/lib/constants";
import { Badge, ProgressBar } from "@/components/ui";
import type { useStore } from "@/hooks/useStore";

type StoreType = ReturnType<typeof useStore>;

const SECTIONS: { key: keyof TaskCategories; emoji: string; title: string }[] = [
  { key: "morning", emoji: "🌅", title: "Morning"  },
  { key: "college", emoji: "🏫", title: "College"  },
  { key: "evening", emoji: "🌆", title: "Evening"  },
  { key: "night",   emoji: "🌙", title: "Night"    },
];

function TaskSection({
  catKey, title, emoji, store,
}: { catKey: keyof TaskCategories; title: string; emoji: string; store: StoreType }) {
  const [newText, setNewText]   = useState("");
  const [editId,  setEditId]    = useState<string | null>(null);
  const [editTxt, setEditTxt]   = useState("");

  const { tasks, toggleTask, addTask, deleteTask, editTask } = store;
  const items = tasks[catKey];

  const handleAdd = () => {
    addTask(catKey, newText);
    setNewText("");
  };

  const handleSave = (id: string) => {
    editTask(catKey, id, editTxt);
    setEditId(null);
  };

  return (
    <div className="mb-5">
      <p className="text-slate-400 text-sm font-semibold mb-2">{emoji} {title}</p>
      <div className="space-y-2">
        {items.map((t) => (
          <div key={t.id} className="flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2.5">
            <button
              onClick={() => toggleTask(catKey, t.id)}
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                t.done ? "bg-indigo-500 border-indigo-500" : "border-slate-600"
              }`}
            >
              {t.done && <span className="text-white text-[10px] font-bold">✓</span>}
            </button>

            {editId === t.id ? (
              <>
                <input
                  value={editTxt}
                  onChange={(e) => setEditTxt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave(t.id)}
                  className="flex-1 bg-slate-700 text-white text-sm rounded-lg px-2 py-1 outline-none"
                  autoFocus
                />
                <button onClick={() => handleSave(t.id)} className="text-indigo-400 text-xs font-semibold">Save</button>
                <button onClick={() => setEditId(null)} className="text-slate-500 text-xs">✕</button>
              </>
            ) : (
              <>
                <span className={`flex-1 text-sm ${t.done ? "line-through text-slate-500" : "text-white"}`}>
                  {t.text}
                </span>
                <button
                  onClick={() => { setEditId(t.id); setEditTxt(t.text); }}
                  className="text-slate-500 text-xs px-1.5 py-1 rounded hover:text-slate-300"
                >✎</button>
                <button
                  onClick={() => deleteTask(catKey, t.id)}
                  className="text-rose-600 text-xs px-1.5 py-1 rounded hover:text-rose-400"
                >✕</button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add task..."
          className="flex-1 bg-slate-800 text-white text-sm rounded-xl px-3 py-2.5 outline-none placeholder-slate-600 border border-slate-700 focus:border-indigo-500 transition-colors"
        />
        <button onClick={handleAdd} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl font-semibold">+</button>
      </div>
    </div>
  );
}

export function Tasks({ store }: { store: StoreType }) {
  const { taskPct, doneTasks, allTasks } = store;
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-bold text-lg">Today&apos;s Tasks</h2>
        <Badge color="indigo">{doneTasks}/{allTasks.length} done</Badge>
      </div>
      <ProgressBar pct={taskPct} />
      <p className="text-slate-500 text-xs mt-1.5 mb-5">{taskPct}% complete</p>
      {SECTIONS.map((s) => (
        <TaskSection key={s.key} catKey={s.key} title={s.title} emoji={s.emoji} store={store} />
      ))}
    </div>
  );
}
