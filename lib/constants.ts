// ─── Types ─────────────────────────────────────────────────────────────────

export interface Task {
  id: string;
  text: string;
  done: boolean;
}

export interface TaskCategories {
  morning: Task[];
  college: Task[];
  evening: Task[];
  night: Task[];
}

export interface StudySession {
  id: number;
  subject: string;
  minutes: number;
  note: string;
}

export interface CodingData {
  dsa: number;
  time: number;
  github: string;
  topic: string;
}

export interface FitnessData {
  done: boolean;
  type: string;
  duration: number;
}

export interface SkincareData {
  morning: { cleanser: boolean; moisturizer: boolean; sunscreen: boolean };
  night: { faceWash: boolean; treatment: boolean; moisturizer: boolean };
}

export interface SleepData {
  bedtime: string;
  waketime: string;
}

export interface ProjectTask {
  id: number;
  name: string;
  task: string;
  status: "Todo" | "In Progress" | "Done";
}

export type MoodValue = 2 | 3 | 4 | 5 | null;

// ─── Constants ──────────────────────────────────────────────────────────────

export const QUOTES = [
  "Small steps daily lead to massive results yearly.",
  "The secret of getting ahead is getting started.",
  "Code. Lift. Repeat. Grow.",
  "Every DSA problem you solve is an investment.",
  "Your future self is watching. Make them proud.",
  "Consistency beats perfection every single time.",
  "Hard work beats talent when talent doesn't work hard.",
  "Build the life you want, one day at a time.",
  "The grind you put in now defines the life you'll live.",
  "Be the developer you needed when you started.",
  "One commit a day keeps the unemployment away.",
  "Sleep is a feature, not a bug.",
];

export const DEFAULT_TASKS: TaskCategories = {
  morning: [
    { id: "m1", text: "Wake up on time", done: false },
    { id: "m2", text: "Drink water", done: false },
    { id: "m3", text: "Skincare routine", done: false },
    { id: "m4", text: "Breakfast", done: false },
  ],
  college: [
    { id: "c1", text: "Attend classes", done: false },
    { id: "c2", text: "Take notes", done: false },
    { id: "c3", text: "Complete lab work", done: false },
  ],
  evening: [
    { id: "e1", text: "Workout", done: false },
    { id: "e2", text: "Bath", done: false },
    { id: "e3", text: "Evening skincare", done: false },
  ],
  night: [
    { id: "n1", text: "DSA practice", done: false },
    { id: "n2", text: "Learning session", done: false },
    { id: "n3", text: "Project work", done: false },
    { id: "n4", text: "Revision", done: false },
    { id: "n5", text: "Plan tomorrow", done: false },
    { id: "n6", text: "Sleep on time", done: false },
  ],
};

export const DEFAULT_CODING: CodingData = { dsa: 0, time: 0, github: "", topic: "" };
export const DEFAULT_FITNESS: FitnessData = { done: false, type: "", duration: 0 };
export const DEFAULT_SKINCARE: SkincareData = {
  morning: { cleanser: false, moisturizer: false, sunscreen: false },
  night: { faceWash: false, treatment: false, moisturizer: false },
};
export const DEFAULT_SLEEP: SleepData = { bedtime: "", waketime: "" };

export const LEVELS = [
  { name: "Beginner",  icon: "🌱", min: 0,    max: 199  },
  { name: "Learner",   icon: "📖", min: 200,  max: 499  },
  { name: "Builder",   icon: "🔨", min: 500,  max: 999  },
  { name: "Developer", icon: "💻", min: 1000, max: 1999 },
  { name: "Engineer",  icon: "🚀", min: 2000, max: Infinity },
];

export const MOODS = [
  { emoji: "😀", label: "Great", value: 5 },
  { emoji: "🙂", label: "Good",  value: 4 },
  { emoji: "😐", label: "Okay",  value: 3 },
  { emoji: "😔", label: "Bad",   value: 2 },
] as const;

export const NAV_ITEMS = [
  { id: "dashboard", icon: "⚡", label: "Home"    },
  { id: "tasks",     icon: "✅", label: "Tasks"   },
  { id: "study",     icon: "📚", label: "Study"   },
  { id: "coding",    icon: "💻", label: "Coding"  },
  { id: "projects",  icon: "🚀", label: "Projects"},
  { id: "health",    icon: "💧", label: "Health"  },
  { id: "review",    icon: "📊", label: "Review"  },
  { id: "stats",     icon: "📈", label: "Stats"   },
] as const;

export type TabId = typeof NAV_ITEMS[number]["id"];
