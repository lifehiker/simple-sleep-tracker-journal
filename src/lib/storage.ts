import { SleepEntry, UserSettings } from "./types";

const SLEEP_ENTRIES_KEY = "sleep_entries";
const USER_SETTINGS_KEY = "user_settings";

export const defaultSettings: UserSettings = {
  targetSleepMinutes: 480,
  isPremium: false,
  reminderEnabled: false,
  reminderHour: 9,
  reminderMinute: 0,
  onboardingComplete: false,
  healthAccessMode: "not-requested",
  lastHealthImportAt: null,
};

export function getSleepEntries(): SleepEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SLEEP_ENTRIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SleepEntry[];
  } catch {
    return [];
  }
}

export function saveSleepEntries(entries: SleepEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SLEEP_ENTRIES_KEY, JSON.stringify(entries));
}

export function addSleepEntry(entry: SleepEntry): void {
  const entries = getSleepEntries();
  entries.push(entry);
  saveSleepEntries(entries);
}

export function updateSleepEntry(updated: SleepEntry): void {
  const entries = getSleepEntries();
  const idx = entries.findIndex((e) => e.id === updated.id);
  if (idx >= 0) {
    entries[idx] = updated;
    saveSleepEntries(entries);
  }
}

export function deleteSleepEntry(id: string): void {
  const entries = getSleepEntries().filter((e) => e.id !== id);
  saveSleepEntries(entries);
}

export function getSleepEntryById(id: string): SleepEntry | null {
  return getSleepEntries().find((e) => e.id === id) ?? null;
}

export function getRecentEntries(days: number): SleepEntry[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return getSleepEntries()
    .filter((e) => new Date(e.endDate) >= cutoff)
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
}

export function getUserSettings(): UserSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(USER_SETTINGS_KEY);
    if (!raw) return { ...defaultSettings };
    return { ...defaultSettings, ...JSON.parse(raw) } as UserSettings;
  } catch {
    return { ...defaultSettings };
  }
}

export function saveUserSettings(settings: UserSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
}

export function updateUserSettings(partial: Partial<UserSettings>): void {
  const current = getUserSettings();
  saveUserSettings({ ...current, ...partial });
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function buildDemoEntries(days: number, source: SleepEntry["source"]): SleepEntry[] {
  const now = new Date();
  const demoEntries: SleepEntry[] = [];

  for (let i = days; i >= 1; i--) {
    const wakeDate = new Date(now);
    wakeDate.setDate(wakeDate.getDate() - i);
    wakeDate.setHours(7, Math.floor(Math.random() * 30), 0, 0);

    const sleepMinutes = 390 + Math.floor(Math.random() * 120); // 6.5-8.5h
    const sleepStart = new Date(wakeDate.getTime() - sleepMinutes * 60 * 1000);
    const bedTime = new Date(sleepStart.getTime() - 15 * 60 * 1000); // 15min in bed before sleep

    const awakeMinutes = Math.floor(Math.random() * 20);
    const timeInBed = Math.round((wakeDate.getTime() - bedTime.getTime()) / 60000);

    demoEntries.push({
      id: generateId(),
      startDate: sleepStart.toISOString(),
      endDate: wakeDate.toISOString(),
      bedTime: bedTime.toISOString(),
      timeInBedMinutes: timeInBed,
      awakeMinutes,
      note: i === 3 ? "Woke up a few times, restless night" : i === 7 ? "Great sleep, felt rested" : "",
      source,
      createdAt: wakeDate.toISOString(),
    });
  }

  return demoEntries;
}

export function seedDemoData(source: SleepEntry["source"] = "manual"): void {
  const entries = getSleepEntries();
  if (entries.length > 0) return;
  saveSleepEntries(buildDemoEntries(14, source));
}

export function replaceWithDemoData(source: "manual" | "health" | "mixed" = "manual"): void {
  if (source === "mixed") {
    const manualEntries = buildDemoEntries(7, "manual");
    const healthEntries = buildDemoEntries(7, "health");
    saveSleepEntries([...manualEntries, ...healthEntries]);
    return;
  }

  saveSleepEntries(buildDemoEntries(14, source));
}

export function importMockHealthEntries(): number {
  const existing = getSleepEntries();
  const mockEntries = buildDemoEntries(7, "health");
  const existingDays = new Set(
    existing
      .filter((entry) => entry.source === "health")
      .map((entry) => new Date(entry.endDate).toDateString())
  );

  const newEntries = mockEntries.filter(
    (entry) => !existingDays.has(new Date(entry.endDate).toDateString())
  );

  if (newEntries.length === 0) {
    return 0;
  }

  saveSleepEntries([...existing, ...newEntries]);
  updateUserSettings({
    healthAccessMode: "sample-imported",
    lastHealthImportAt: new Date().toISOString(),
  });

  return newEntries.length;
}

export function clearAllSleepData(): void {
  saveSleepEntries([]);
}

export function markManualOnly(): void {
  updateUserSettings({
    healthAccessMode: "manual-only",
    lastHealthImportAt: null,
  });
}

export function markHealthNotRequested(): void {
  updateUserSettings({
    healthAccessMode: "not-requested",
    lastHealthImportAt: null,
  });
}

export function getHealthStatusLabel(settings: UserSettings): string {
  if (settings.healthAccessMode === "sample-imported") return "Apple Health sample linked";
  if (settings.healthAccessMode === "manual-only") return "Manual logging only";
  return "Not configured";
}
