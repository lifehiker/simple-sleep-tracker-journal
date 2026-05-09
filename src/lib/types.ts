export type HealthAccessMode =
  | "not-requested"
  | "manual-only"
  | "sample-imported";

export interface SleepEntry {
  id: string;
  startDate: string; // ISO string - sleep start time
  endDate: string;   // ISO string - wake time
  bedTime: string;   // ISO string - when they got into bed
  timeInBedMinutes: number;
  awakeMinutes: number;
  note: string;
  source: "manual" | "health";
  createdAt: string; // ISO string
}

export interface UserSettings {
  targetSleepMinutes: number; // default 480 (8h)
  isPremium: boolean;
  reminderEnabled: boolean;
  reminderHour: number;   // 0-23
  reminderMinute: number; // 0-59
  onboardingComplete: boolean;
  healthAccessMode: HealthAccessMode;
  lastHealthImportAt: string | null;
}

export interface TrendSummary {
  windowDays: 7 | 30;
  averageSleepMinutes: number;
  averageBedtimeMinutes: number; // minutes from midnight
  averageWakeMinutes: number;    // minutes from midnight
  sleepDebtMinutes: number;
  consistencyScore: number; // 0-100
  entries: SleepEntry[];
}
