import { SleepEntry } from "./types";

/** Sleep duration in minutes (asleep time, excluding awake minutes) */
export function calculateDurationMinutes(entry: SleepEntry): number {
  const total = Math.round(
    (new Date(entry.endDate).getTime() - new Date(entry.startDate).getTime()) / 60000
  );
  return Math.max(0, total - entry.awakeMinutes);
}

/** Time in bed in minutes */
export function calculateTimeInBedMinutes(entry: SleepEntry): number {
  if (entry.timeInBedMinutes > 0) return entry.timeInBedMinutes;
  return Math.round(
    (new Date(entry.endDate).getTime() - new Date(entry.bedTime).getTime()) / 60000
  );
}

/** Sleep efficiency as percentage (0-100) */
export function calculateEfficiency(entry: SleepEntry): number {
  const inBed = calculateTimeInBedMinutes(entry);
  const asleep = calculateDurationMinutes(entry);
  if (inBed <= 0) return 0;
  return Math.min(100, Math.round((asleep / inBed) * 100));
}

/** Rolling sleep debt over windowDays (positive = debt, negative = surplus) */
export function calculateSleepDebt(
  entries: SleepEntry[],
  targetMinutes: number,
  windowDays: number = 7
): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);

  const recent = entries.filter((e) => new Date(e.endDate) >= cutoff);
  const actualTotal = recent.reduce((sum, e) => sum + calculateDurationMinutes(e), 0);
  const targetTotal = targetMinutes * windowDays;
  return targetTotal - actualTotal; // positive = in debt
}

/** Convert a Date to minutes since midnight */
function toMinutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * Average bedtime as minutes since midnight (handles crossing midnight).
 * Returns -1 if no entries.
 */
export function calculateAverageBedtimeMinutes(
  entries: SleepEntry[],
  windowDays: number = 7
): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);
  const recent = entries.filter((e) => new Date(e.endDate) >= cutoff && e.bedTime);
  if (recent.length === 0) return -1;

  // Convert bedtimes to minutes from noon (to handle midnight crossing)
  const minutesFromNoon = recent.map((e) => {
    const bed = new Date(e.bedTime);
    let mins = toMinutesSinceMidnight(bed);
    // Shift so that times after noon are relative to noon
    // 22:00 → 600 min from noon; 01:00 → 780 min from noon
    if (mins < 12 * 60) mins += 24 * 60; // push early AM past midnight
    return mins - 12 * 60; // relative to noon
  });

  const avg = minutesFromNoon.reduce((s, m) => s + m, 0) / minutesFromNoon.length;
  // Convert back to minutes since midnight
  let result = (avg + 12 * 60) % (24 * 60);
  if (result < 0) result += 24 * 60;
  return Math.round(result);
}

/** Average wake time as minutes since midnight */
export function calculateAverageWakeTimeMinutes(
  entries: SleepEntry[],
  windowDays: number = 7
): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);
  const recent = entries.filter((e) => new Date(e.endDate) >= cutoff);
  if (recent.length === 0) return -1;

  const mins = recent.map((e) => toMinutesSinceMidnight(new Date(e.endDate)));
  const avg = mins.reduce((s, m) => s + m, 0) / mins.length;
  return Math.round(avg);
}

/**
 * Bedtime consistency score 0-100.
 * Based on std deviation of bedtime; lower std = higher score.
 * Score = max(0, 100 - (stdDevMinutes / 60) * 40)
 */
export function calculateConsistencyScore(
  entries: SleepEntry[],
  windowDays: number = 7
): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);
  const recent = entries.filter((e) => new Date(e.endDate) >= cutoff && e.bedTime);
  if (recent.length < 2) return recent.length === 1 ? 75 : 0;

  // Compute bedtimes in minutes from noon (handles midnight crossover)
  const times = recent.map((e) => {
    const bed = new Date(e.bedTime);
    let mins = toMinutesSinceMidnight(bed);
    if (mins < 12 * 60) mins += 24 * 60;
    return mins;
  });

  const mean = times.reduce((s, t) => s + t, 0) / times.length;
  const variance = times.reduce((s, t) => s + Math.pow(t - mean, 2), 0) / times.length;
  const stdDev = Math.sqrt(variance);

  // stdDev of 0 = 100, stdDev of 150min = 0
  const score = Math.max(0, Math.round(100 - (stdDev / 150) * 100));
  return Math.min(100, score);
}

/** Format minutes as "Xh Ym" */
export function formatMinutes(minutes: number): string {
  if (minutes < 0) {
    return `-${formatMinutes(-minutes)}`;
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Format minutes-since-midnight as "H:MM AM/PM" */
export function formatTimeOfDay(minutesSinceMidnight: number): string {
  if (minutesSinceMidnight < 0) return "—";
  const normalized = ((minutesSinceMidnight % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/** Get last night's entry (most recent) */
export function getLastNightEntry(entries: SleepEntry[]): SleepEntry | null {
  if (entries.length === 0) return null;
  return [...entries].sort(
    (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
  )[0];
}

/** Get entries sorted by date descending */
export function sortEntriesDesc(entries: SleepEntry[]): SleepEntry[] {
  return [...entries].sort(
    (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
  );
}

/** Format a date for display */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Format a datetime for display */
export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
