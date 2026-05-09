"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Moon, BookOpen, Lock, ChevronRight } from "lucide-react";
import { getSleepEntries, getUserSettings } from "@/lib/storage";
import {
  calculateDurationMinutes,
  formatMinutes,
  formatDate,
  formatDateTime,
  sortEntriesDesc,
} from "@/lib/metrics";
import { SleepEntry, UserSettings } from "@/lib/types";
import { TopBar } from "@/components/nav";
import { useIsClient } from "@/lib/use-is-client";

export default function JournalPage() {
  const mounted = useIsClient();

  if (!mounted) {
    return (
      <>
        <TopBar title="Sleep Journal" />
        <div className="py-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </>
    );
  }

  const entries: SleepEntry[] = getSleepEntries();
  const settings: UserSettings = getUserSettings();
  const sorted = sortEntriesDesc(entries);
  const isPremium = settings.isPremium;

  // Free users can only see last 7 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const visibleEntries = isPremium
    ? sorted
    : sorted.filter((e) => new Date(e.endDate) >= cutoff);
  const hiddenCount = sorted.length - visibleEntries.length;

  return (
    <>
      <TopBar
        title="Sleep Journal"
        action={
          <Link href="/app/journal/add">
            <Button size="sm" className="gap-1 h-8">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </Link>
        }
      />

      <div className="py-4 space-y-3">
        {visibleEntries.length === 0 && hiddenCount === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No sleep logged yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Add your first night to start tracking your sleep patterns
            </p>
            <Link href="/app/journal/add">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add your first night
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {visibleEntries.map((entry) => (
              <JournalEntryRow key={entry.id} entry={entry} targetMinutes={settings.targetSleepMinutes} />
            ))}

            {!isPremium && hiddenCount > 0 && (
              <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center">
                <Lock className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium mb-1">
                  {hiddenCount} more night{hiddenCount !== 1 ? "s" : ""} in your history
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Unlock full history with Premium
                </p>
                <Link href="/app/settings/premium">
                  <Button size="sm" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Upgrade to Premium
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function JournalEntryRow({
  entry,
  targetMinutes,
}: {
  entry: SleepEntry;
  targetMinutes: number;
}) {
  const duration = calculateDurationMinutes(entry);
  const metGoal = duration >= targetMinutes;

  return (
    <Link href={`/app/journal/${entry.id}`}>
      <div className="rounded-xl border border-border bg-card p-4 hover:bg-accent/30 transition-colors cursor-pointer flex items-center gap-3">
        <div className="flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              metGoal ? "bg-primary/10" : "bg-orange-100 dark:bg-orange-900/20"
            }`}
          >
            <Moon
              className={`h-5 w-5 ${metGoal ? "text-primary" : "text-orange-500"}`}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold">{formatDate(entry.endDate)}</span>
            <div className="flex items-center gap-1">
              <Badge
                variant={metGoal ? "default" : "secondary"}
                className="text-xs px-2 py-0"
              >
                {formatMinutes(duration)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formatDateTime(entry.bedTime || entry.startDate)} → {formatDateTime(entry.endDate)}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              {entry.source === "health" ? "Apple Health" : "Manual"}
            </Badge>
            {entry.note && (
              <span className="text-xs text-muted-foreground italic line-clamp-1">
                {entry.note}
              </span>
            )}
          </div>
        </div>

        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </div>
    </Link>
  );
}
