import { LEVELS } from "./constants";

export function getLevel(xp: number) {
  return LEVELS.find((l) => xp >= l.min && xp <= l.max) ?? LEVELS[0];
}

export function levelProgress(xp: number): number {
  const level = getLevel(xp);
  if (level.max === Infinity) return 100;
  const range = level.max - level.min;
  const progress = xp - level.min;
  return Math.round((progress / range) * 100);
}

export const XP = {
  TASK:           2,
  STUDY_PER_MIN:  0.25,  // 15 XP per hour
  WORKOUT:        20,
  DSA_PROBLEM:    10,
  PROJECT_DONE:   20,
  SKINCARE_FULL:  5,
} as const;
