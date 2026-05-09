"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HealthImportCard } from "@/components/health-import-card";
import { SleepBarChart } from "@/components/sleep-bar-chart";
import {
  Lock,
  Moon,
  Plus,
  Sparkles,
  Sun,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  getRecentEntries,
  getSleepEntries,
  getUserSettings,
  importMockHealthEntries,
} from "@/lib/storage";
import {
  calculateAverageBedtimeMinutes,
  calculateAverageWakeTimeMinutes,
  calculateConsistencyScore,
  calculateDurationMinutes,
  calculateEfficiency,
  calculateSleepDebt,
  calculateTimeInBedMinutes,
  formatDateTime,
  formatMinutes,
  formatTimeOfDay,
  getLastNightEntry,
} from "@/lib/metrics";
import { toast } from "sonner";
import { useIsClient } from "@/lib/use-is-client";

export default function SummaryPage() {
  const mounted = useIsClient();
  const [storageVersion, setStorageVersion] = useState(0);
  const [importing, setImporting] = useState(false);

  const refresh = () => {
    setStorageVersion((value) => value + 1);
  };

  const handleHealthImport = () => {
    setImporting(true);
    const importedCount = importMockHealthEntries();
    refresh();
    setImporting(false);

    if (importedCount === 0) {
      toast.info("Sample Apple Health nights are already loaded.");
      return;
    }

    toast.success(`Imported ${importedCount} Apple Health sample night${importedCount === 1 ? "" : "s"}.`);
  };

  if (!mounted) {
    return (
      <div className="space-y-4 py-8">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  void storageVersion;
  const entries = getSleepEntries();
  const settings = getUserSettings();
  const recent7 = getRecentEntries(7);
  const lastNight = getLastNightEntry(entries);
  const sleepDebt = calculateSleepDebt(entries, settings.targetSleepMinutes, 7);
  const consistencyScore = calculateConsistencyScore(entries, 7);
  const avgBedtime = calculateAverageBedtimeMinutes(entries, 7);
  const avgWake = calculateAverageWakeTimeMinutes(entries, 7);

  const chartData = recent7.slice(0, 7).reverse().map((entry) => ({
    date: new Date(entry.endDate).toLocaleDateString("en-US", { weekday: "short" }),
    minutes: calculateDurationMinutes(entry),
    target: settings.targetSleepMinutes,
  }));

  const lastNightDuration = lastNight ? calculateDurationMinutes(lastNight) : 0;
  const lastNightEfficiency = lastNight ? calculateEfficiency(lastNight) : 0;
  const lastNightInBed = lastNight ? calculateTimeInBedMinutes(lastNight) : 0;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{today}</p>
          <h2 className="text-2xl font-bold">Good morning</h2>
        </div>
        <div className="flex gap-2">
          <Link href="/app/settings">
            <Button size="sm" variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Import
            </Button>
          </Link>
          <Link href="/app/journal/add">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Log Sleep
            </Button>
          </Link>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-linear-to-br from-primary/12 via-primary/4 to-card pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Moon className="h-4 w-4 text-primary" />
              Last Night
            </CardTitle>
            {lastNight && (
              <Badge variant="secondary" className="text-xs">
                {lastNight.source === "health" ? "Apple Health" : "Manual"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {lastNight ? (
            <>
              <div className="mb-4 flex items-center gap-3">
                <div className="text-4xl font-bold text-primary">
                  {formatMinutes(lastNightDuration)}
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>of sleep</div>
                  <div className="text-xs">
                    {lastNightDuration >= settings.targetSleepMinutes
                      ? "Met your target"
                      : `${formatMinutes(settings.targetSleepMinutes - lastNightDuration)} short`}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Sleep efficiency</span>
                  <span>{lastNightEfficiency}%</span>
                </div>
                <Progress value={lastNightEfficiency} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xs text-muted-foreground">Bedtime</div>
                  <div className="text-sm font-medium">
                    {formatDateTime(lastNight.bedTime || lastNight.startDate)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Time in bed</div>
                  <div className="text-sm font-medium">{formatMinutes(lastNightInBed)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Wake up</div>
                  <div className="text-sm font-medium">{formatDateTime(lastNight.endDate)}</div>
                </div>
              </div>

              {lastNight.note && (
                <div className="mt-3 border-t border-border pt-3">
                  <p className="line-clamp-2 text-xs italic text-muted-foreground">
                    &ldquo;{lastNight.note}&rdquo;
                  </p>
                </div>
              )}

              <Link href={`/app/journal/${lastNight.id}`}>
                <Button variant="ghost" size="sm" className="mt-3 w-full text-xs">
                  View details
                </Button>
              </Link>
            </>
          ) : (
            <div className="space-y-4 py-3">
              <div className="text-center">
                <Moon className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="mb-4 text-sm text-muted-foreground">
                  No sleep logged yet. Start with a manual entry or load Apple Health
                  sample data.
                </p>
                <div className="flex justify-center gap-2">
                  <Link href="/app/journal/add">
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add manual log
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" onClick={handleHealthImport}>
                    Import sample nights
                  </Button>
                </div>
              </div>
              <HealthImportCard compact importing={importing} onImport={handleHealthImport} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            {sleepDebt > 0 ? (
              <TrendingDown className="h-4 w-4 text-orange-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-green-500" />
            )}
            7-Day Sleep Debt
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recent7.length > 0 ? (
            <>
              <div className="flex items-center gap-3">
                <div
                  className={`text-3xl font-bold ${
                    sleepDebt > 60
                      ? "text-orange-500"
                      : sleepDebt > 0
                        ? "text-yellow-500"
                        : "text-green-500"
                  }`}
                >
                  {sleepDebt > 0 ? "+" : ""}
                  {formatMinutes(Math.abs(sleepDebt))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {sleepDebt > 0
                    ? "sleep debt this week"
                    : sleepDebt < 0
                      ? "sleep surplus this week"
                      : "perfectly on target"}
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Target: {formatMinutes(settings.targetSleepMinutes)}/night across 7 days
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your debt view will appear after you log a few nights.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Sun className="h-4 w-4 text-amber-500" />
              Bedtime Consistency
            </CardTitle>
            {!settings.isPremium && (
              <Badge variant="outline" className="gap-1 text-xs">
                <Lock className="h-3 w-3" />
                Premium
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {settings.isPremium || recent7.length >= 2 ? (
            <>
              <div className="mb-3 flex items-center gap-3">
                <div className="text-3xl font-bold">{consistencyScore}</div>
                <div>
                  <div
                    className={`text-sm font-medium ${
                      consistencyScore >= 75
                        ? "text-green-500"
                        : consistencyScore >= 50
                          ? "text-yellow-500"
                          : "text-orange-500"
                    }`}
                  >
                    {consistencyScore >= 75
                      ? "Consistent"
                      : consistencyScore >= 50
                        ? "Moderate"
                        : "Irregular"}
                  </div>
                  <div className="text-xs text-muted-foreground">7-day score</div>
                </div>
              </div>
              <Progress value={consistencyScore} className="mb-3 h-2" />
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-xs text-muted-foreground">Avg Bedtime</div>
                  <div className="text-sm font-medium">
                    {avgBedtime >= 0 ? formatTimeOfDay(avgBedtime) : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Avg Wake</div>
                  <div className="text-sm font-medium">
                    {avgWake >= 0 ? formatTimeOfDay(avgWake) : "—"}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="mb-3 text-sm text-muted-foreground">
                Log at least 2 nights to calculate consistency.
              </p>
              <Link href="/app/journal/add">
                <Button size="sm" variant="outline">
                  Add another night
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Last 7 Nights</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <SleepBarChart data={chartData} targetMinutes={settings.targetSleepMinutes} />
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No data yet. Add your first night to start a trend line.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
