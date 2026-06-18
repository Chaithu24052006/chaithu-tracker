export const todayKey = (): string => new Date().toISOString().split("T")[0];

export function getLS<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setLS<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function dayKey(key: string, date?: string): string {
  return `${date ?? todayKey()}_${key}`;
}

export function getDay<T>(key: string, defaultValue: T, date?: string): T {
  return getLS(dayKey(key, date), defaultValue);
}

export function setDay<T>(key: string, value: T, date?: string): void {
  setLS(dayKey(key, date), value);
}
