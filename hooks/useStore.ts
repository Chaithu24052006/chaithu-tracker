"use client";

import { useState, useCallback, useEffect } from "react";
import {
  DEFAULT_TASKS, DEFAULT_CODING, DEFAULT_FITNESS,
  DEFAULT_SKINCARE, DEFAULT_SLEEP,
  TaskCategories, StudySession, CodingData,
  FitnessData, SkincareData, SleepData, ProjectTask, MoodValue,
} from "@/lib/constants";
import { todayKey, getLS, setLS, getDay, setDay } from "@/lib/storage";
import { XP } from "@/lib/xp";

function useDayField<T>(key: string, def: T): [T, (v: T | ((prev: T) => T)) => void] {
  const today = todayKey();
  const [val, setVal] = useState<T>(() => getDay<T>(key, def));

  const update = useCallback((v: T | ((prev: T) => T)) => {
    setVal((prev) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      setDay(key, next);
      return next;
    });
  }, [key]);

  return [val, update];
}

function useGlobal<T>(key: string, def: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => getLS<T>(key, def));

  const update = useCallback((v: T | ((prev: T) => T)) => {
    setVal((prev) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      setLS(key, next);
      return next;
    });
  }, [key]);

  return [val, update];
}

export function useStore() {
  const today = todayKey();

  // ── Day-scoped state ──────────────────────────────────────────────────────
  const [tasks,          setTasks]          = useDayField<TaskCategories>("tasks",    DEFAULT_TASKS);
  const [studySessions,  setStudySessions]  = useDayField<StudySession[]>("study",    []);
  const [coding,         setCoding]         = useDayField<CodingData>("coding",       DEFAULT_CODING);
  const [fitness,        setFitness]        = useDayField<FitnessData>("fitness",     DEFAULT_FITNESS);
  const [skincare,       setSkincare]       = useDayField<SkincareData>("skincare",   DEFAULT_SKINCARE);
  const [water,          setWater]          = useDayField<number>("water",            0);
  const [sleep,          setSleep]          = useDayField<SleepData>("sleep",         DEFAULT_SLEEP);
  const [mood,           setMood]           = useDayField<MoodValue>("mood",          null);
  const [moodNote,       setMoodNote]       = useDayField<string>("moodNote",         "");

  // ── Global persistent state ───────────────────────────────────────────────
  const [xp,       setXp]       = useGlobal<number>("xp",       0);
  const [streak,   setStreak]   = useGlobal<number>("streak",   0);
  const [lastDate, setLastDate] = useGlobal<string>("lastDate", "");
  const [projects, setProjects] = useGlobal<ProjectTask[]>("projects", []);

  // ── Midnight reset + streak logic ─────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().split("T")[0];

    if (lastDate && lastDate !== today) {
      // App opened on a new day
      if (lastDate === yKey) {
        // Came from yesterday — streak continues
        setStreak((s) => s + 1);
      } else {
        // Missed a day — reset streak
        setStreak(0);
      }
    }

    if (lastDate !== today) {
      setLastDate(today);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── XP helper ────────────────────────────────────────────────────────────
  const awardXP = useCallback((amount: number) => {
    setXp((x) => x + amount);
  }, [setXp]);

  // ── Derived values ────────────────────────────────────────────────────────
  const allTasks      = Object.values(tasks).flat();
  const doneTasks     = allTasks.filter((t) => t.done).length;
  const taskPct       = allTasks.length ? Math.round((doneTasks / allTasks.length) * 100) : 0;
  const totalStudyMin = studySessions.reduce((s, x) => s + (x.minutes || 0), 0);
  const totalStudyHrs = +(totalStudyMin / 60).toFixed(1);

  const skincareItems  = [...Object.values(skincare.morning), ...Object.values(skincare.night)];
  const skincareDone   = skincareItems.filter(Boolean).length;
  const skincarePct    = Math.round((skincareDone / skincareItems.length) * 100);

  const calcSleepHrs = (): number | null => {
    if (!sleep.bedtime || !sleep.waketime) return null;
    const [bh, bm] = sleep.bedtime.split(":").map(Number);
    const [wh, wm] = sleep.waketime.split(":").map(Number);
    let mins = (wh * 60 + wm) - (bh * 60 + bm);
    if (mins < 0) mins += 1440;
    return +((mins / 60).toFixed(1));
  };
  const sleepHrs = calcSleepHrs();

  const dailyScore = Math.min(100, Math.round(
    taskPct                                      * 0.30 +
    (Math.min(totalStudyHrs, 4) / 4 * 100)      * 0.20 +
    (coding.dsa > 0 ? 100 : 0)                  * 0.15 +
    (fitness.done ? 100 : 0)                    * 0.15 +
    (Math.min(water, 3000) / 3000 * 100)        * 0.10 +
    skincarePct                                  * 0.10
  ));

  // ── Task actions ──────────────────────────────────────────────────────────
  const toggleTask = useCallback((catKey: keyof TaskCategories, id: string) => {
    setTasks((prev) => {
      const cat = prev[catKey];
      const task = cat.find((t) => t.id === id);
      if (!task) return prev;
      if (!task.done) awardXP(XP.TASK);
      return {
        ...prev,
        [catKey]: cat.map((t) => t.id === id ? { ...t, done: !t.done } : t),
      };
    });
  }, [setTasks, awardXP]);

  const addTask = useCallback((catKey: keyof TaskCategories, text: string) => {
    if (!text.trim()) return;
    setTasks((prev) => ({
      ...prev,
      [catKey]: [...prev[catKey], { id: `custom_${Date.now()}`, text: text.trim(), done: false }],
    }));
  }, [setTasks]);

  const deleteTask = useCallback((catKey: keyof TaskCategories, id: string) => {
    setTasks((prev) => ({
      ...prev,
      [catKey]: prev[catKey].filter((t) => t.id !== id),
    }));
  }, [setTasks]);

  const editTask = useCallback((catKey: keyof TaskCategories, id: string, text: string) => {
    setTasks((prev) => ({
      ...prev,
      [catKey]: prev[catKey].map((t) => t.id === id ? { ...t, text } : t),
    }));
  }, [setTasks]);

  // ── Study actions ─────────────────────────────────────────────────────────
  const addStudySession = useCallback((session: Omit<StudySession, "id">) => {
    const entry: StudySession = { ...session, id: Date.now() };
    setStudySessions((prev) => [...prev, entry]);
    awardXP(Math.round(session.minutes * XP.STUDY_PER_MIN));
  }, [setStudySessions, awardXP]);

  const deleteStudySession = useCallback((id: number) => {
    setStudySessions((prev) => prev.filter((s) => s.id !== id));
  }, [setStudySessions]);

  // ── Coding actions ────────────────────────────────────────────────────────
  const updateCoding = useCallback((field: keyof CodingData, value: CodingData[keyof CodingData]) => {
    setCoding((prev) => {
      if (field === "dsa" && typeof value === "number" && value > prev.dsa) {
        awardXP((value - prev.dsa) * XP.DSA_PROBLEM);
      }
      return { ...prev, [field]: value };
    });
  }, [setCoding, awardXP]);

  // ── Fitness actions ───────────────────────────────────────────────────────
  const toggleWorkout = useCallback(() => {
    setFitness((prev) => {
      if (!prev.done) awardXP(XP.WORKOUT);
      return { ...prev, done: !prev.done };
    });
  }, [setFitness, awardXP]);

  // ── Skincare actions ──────────────────────────────────────────────────────
  const toggleSkincare = useCallback((part: "morning" | "night", item: string) => {
    setSkincare((prev) => {
      const next = {
        ...prev,
        [part]: { ...prev[part], [item]: !prev[part][item as keyof typeof prev[typeof part]] },
      };
      const allDone = [...Object.values(next.morning), ...Object.values(next.night)].every(Boolean);
      if (allDone) awardXP(XP.SKINCARE_FULL);
      return next;
    });
  }, [setSkincare, awardXP]);

  // ── Water actions ─────────────────────────────────────────────────────────
  const addWater = useCallback((ml: number) => {
    setWater((prev) => Math.min(prev + ml, 4000));
  }, [setWater]);

  // ── Project actions ───────────────────────────────────────────────────────
  const addProject = useCallback((proj: Omit<ProjectTask, "id">) => {
    setProjects((prev) => [...prev, { ...proj, id: Date.now() }]);
    if (proj.status === "Done") awardXP(XP.PROJECT_DONE);
  }, [setProjects, awardXP]);

  const deleteProject = useCallback((id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, [setProjects]);

  const updateProjectStatus = useCallback((id: number, status: ProjectTask["status"]) => {
    setProjects((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      if (p.status !== "Done" && status === "Done") awardXP(XP.PROJECT_DONE);
      return { ...p, status };
    }));
  }, [setProjects, awardXP]);

  return {
    today,
    // State
    tasks, studySessions, coding, fitness, skincare,
    water, sleep, setSleep, mood, setMood, moodNote, setMoodNote,
    xp, streak, projects,
    // Derived
    allTasks, doneTasks, taskPct,
    totalStudyMin, totalStudyHrs,
    skincarePct, skincareDone,
    sleepHrs, dailyScore,
    // Actions
    toggleTask, addTask, deleteTask, editTask,
    addStudySession, deleteStudySession,
    updateCoding,
    toggleWorkout, setFitness,
    toggleSkincare,
    addWater,
    addProject, deleteProject, updateProjectStatus,
    awardXP,
  };
}
