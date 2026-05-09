"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock } from "lucide-react";
import { getSleepEntries, getUserSettings, getRecentEntries } from "@/lib/storage";
import {
  calculateDurationMinutes,
  calculateSleepDebt,
  calculateConsistencyScore,
  calculateAverageBedtimeMinutes,
  calculateAverageWakeTimeMinutes,
  formatMinutes,
  formatTimeOfDay,
} from "@/lib/metrics";
import { SleepEntry, UserSettings } from "@/lib/types";
import { SleepBarChart } from "@/components/sleep-bar-chart";
import { TopBar } from "@/components/nav";
import { useIsClient } from "@/lib/use-is-client";

export default function TrendsPage() {
  const [window, setWindow] = useState<7 | 30>(7);
  const mounted = useIsClient();

  if (!mounted) {
    return (
      <>
        <TopBar title="Trends" />
        <div className="py-4 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </>
    );
  }

  const entries: SleepEntry[] = getSleepEntries();
  const settings: UserSettings = getUserSettings();
  const isPremium = settings.isPremium;
  const canSee30 = isPremium;

  const activeWindow = canSee30 ? window : 7;
  const recent = getRecentEntries(activeWindow);

  const sleepDebt = calculateSleepDebt(entries, settings.targetSleepMinutes, activeWindow);
  const consistencyScore = calculateConsistencyScore(entries, activeWindow);
  const avgBedtime = calculateAverageBedtimeMinutes(entries, activeWindow);
  const avgWake = calculateAverageWakeTimeMinutes(entries, activeWindow);
  const avgSleep =
    recent.length > 0
      ? Math.round(
          recent.reduce((sum, e) => sum + calculateDurationMinutes(e), 0) / recent.length
        )
      : 0;

  const chartData = recent
    .slice()
    .reverse()
    .map((e) => ({
      date: new Date(e.endDate).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      }),
      minutes: calculateDurationMinutes(e),
      target: settings.targetSleepMinutes,
    }));

  return (
    <>
      <TopBar title="Trends" />

      <div className="py-4 space-y-4">
        {/* Window selector */}
        <div className="flex items-center gap-2">
          <Tabs
            value={String(activeWindow)}
            onValueChange={(v) => {
              if (!isPremium && v === "30") return;
              setWindow(Number(v) as 7 | 30);
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="7">Last 7 days</TabsTrigger>
              <TabsTrigger value="30" disabled={!isPremium} className="gap-1">
                Last 30 days
                {!isPremium && <Lock className="h-3 w-3" />}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Avg Sleep"
            value={recent.length > 0 ? formatMinutes(avgSleep) : "—"}
            sub={`vs ${formatMinutes(settings.targetSleepMinutes)} goal`}
            color={
              avgSleep >= settings.targetSleepMinutes
                ? "text-green-500"
                : "text-orange-500"
            }
          />
          <StatCard
            label="Sleep Debt"
            value={
              recent.length > 0
                ? `${sleepDebt > 0 ? "+" : ""}${formatMinutes(Math.abs(sleepDebt))}`
                : "—"
            }
            sub={sleepDebt > 0 ? "deficit" : sleepDebt < 0 ? "surplus" : "on target"}
            color={
              sleepDebt > 60
                ? "text-orange-500"
                : sleepDebt > 0
                ? "text-yellow-500"
                : "text-green-500"
            }
          />
          <StatCard
            label="Avg Bedtime"
            value={avgBedtime >= 0 ? formatTimeOfDay(avgBedtime) : "—"}
            sub={`${activeWindow}-day average`}
          />
          <StatCard
            label="Avg Wake"
            value={avgWake >= 0 ? formatTimeOfDay(avgWake) : "—"}
            sub={`${activeWindow}-day average`}
          />
        </div>

        {/* Consistency */}
        {(isPremium || entries.length >= 2) && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Bedtime Consistency</CardTitle>
                {!isPremium && (
                  <Badge variant="outline" className="text-xs gap-1">
                    <Lock className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isPremium || entries.length >= 2 ? (
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">{consistencyScore}</div>
                  <div>
                    <div
                      className={`font-medium ${
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
                    <div className="text-xs text-muted-foreground">
                      Based on bedtime variability
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Log at least 2 nights to see consistency
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Nightly Sleep Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <>
                {!isPremium && window === 30 ? (
                  <PremiumGate />
                ) : (
                  <SleepBarChart
                    data={chartData.slice(-activeWindow)}
                    targetMinutes={settings.targetSleepMinutes}
                  />
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                No data for this period
              </p>
            )}
          </CardContent>
        </Card>

        {/* Nights logged */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{recent.length}</div>
                <div className="text-xs text-muted-foreground">
                  nights logged in {activeWindow} days
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {Math.round((recent.length / activeWindow) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">tracking rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  sub,
  color = "text-foreground",
}: {
  label: string;
  value: string;
  sub: string;
  color?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{sub}</div>
      </CardContent>
    </Card>
  );
}

function PremiumGate() {
  return (
    <div className="text-center py-8">
      <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
      <p className="text-sm font-medium mb-1">30-day trends require Premium</p>
      <p className="text-xs text-muted-foreground mb-4">
        Unlock deeper insights with the full 30-day view
      </p>
      <Link href="/app/settings/premium">
        <Button size="sm">Upgrade to Premium</Button>
      </Link>
    </div>
  );
}
