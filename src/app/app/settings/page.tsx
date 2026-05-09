"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { HealthImportCard } from "@/components/health-import-card";
import { TopBar } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  ChevronRight,
  Crown,
  Moon,
  RefreshCw,
  Shield,
  Target,
  Trash2,
} from "lucide-react";
import { formatMinutes } from "@/lib/metrics";
import {
  clearAllSleepData,
  getHealthStatusLabel,
  getSleepEntries,
  getUserSettings,
  importMockHealthEntries,
  replaceWithDemoData,
  updateUserSettings,
} from "@/lib/storage";
import { UserSettings } from "@/lib/types";
import { useIsClient } from "@/lib/use-is-client";

export default function SettingsPage() {
  const mounted = useIsClient();
  const [storageVersion, setStorageVersion] = useState(0);
  const [showClear, setShowClear] = useState(false);
  const [importing, setImporting] = useState(false);

  const refresh = () => {
    setStorageVersion((value) => value + 1);
  };

  if (!mounted) {
    return (
      <>
        <TopBar title="Settings" />
        <div className="space-y-4 py-4">
          <div className="h-40 animate-pulse rounded-xl bg-muted" />
        </div>
      </>
    );
  }

  void storageVersion;
  const settings: UserSettings = getUserSettings();
  const entries = getSleepEntries();
  const healthStatusLabel = getHealthStatusLabel(settings);
  const lastImport = settings.lastHealthImportAt
    ? new Date(settings.lastHealthImportAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Never";

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    updateUserSettings({ [key]: value });
    refresh();
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Notification permission was not granted.");
        return;
      }
    }

    updateSetting("reminderEnabled", enabled);
    toast.success(enabled ? "Reminder preference saved." : "Reminder disabled.");
  };

  const handleImportHealth = () => {
    setImporting(true);
    const imported = importMockHealthEntries();
    setImporting(false);
    refresh();

    if (imported === 0) {
      toast.info("Apple Health sample nights are already up to date.");
      return;
    }

    toast.success(`Imported ${imported} Apple Health sample night${imported === 1 ? "" : "s"}.`);
  };

  const handleLoadDemo = (source: "manual" | "mixed") => {
    replaceWithDemoData(source);
    updateUserSettings({
      onboardingComplete: true,
      healthAccessMode: source === "mixed" ? "sample-imported" : "manual-only",
      lastHealthImportAt: source === "mixed" ? new Date().toISOString() : null,
    });
    refresh();
    toast.success(source === "mixed" ? "Mixed demo data loaded." : "Manual demo data loaded.");
  };

  const handleClearAll = () => {
    clearAllSleepData();
    refresh();
    setShowClear(false);
    toast.success("All sleep data cleared.");
  };

  return (
    <>
      <TopBar title="Settings" />

      <div className="space-y-4 py-4">
        <Card className={settings.isPremium ? "border-primary/30 bg-primary/5" : ""}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    settings.isPremium ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">
                    {settings.isPremium ? "Premium Active" : "Free Plan"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {settings.isPremium
                      ? "30-day insights and full journal history unlocked"
                      : "7-day history and basic insights"}
                  </div>
                </div>
              </div>
              {!settings.isPremium ? (
                <Link href="/app/settings/premium">
                  <Button size="sm" className="gap-1">
                    <Crown className="h-3 w-3" />
                    Upgrade
                  </Button>
                </Link>
              ) : (
                <Badge className="bg-primary text-primary-foreground">Active</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-primary" />
              Sleep Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Target sleep per night</Label>
              <span className="text-sm font-bold text-primary">
                {formatMinutes(settings.targetSleepMinutes)}
              </span>
            </div>
            <Slider
              min={240}
              max={600}
              step={15}
              value={[settings.targetSleepMinutes]}
              onValueChange={(value) =>
                updateSetting(
                  "targetSleepMinutes",
                  Array.isArray(value) ? (value[0] ?? 480) : value
                )
              }
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>4h</span>
              <span>6h</span>
              <span>8h</span>
              <span>10h</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary" />
              Daily Reminder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Morning reminder</Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Browser support varies, but your preferred reminder time is saved locally.
                </p>
              </div>
              <Switch checked={settings.reminderEnabled} onCheckedChange={handleNotificationToggle} />
            </div>

            {settings.reminderEnabled && (
              <div className="space-y-3 border-t border-border pt-3">
                <div className="space-y-2">
                  <Label className="text-xs">
                    Reminder hour: {settings.reminderHour > 12
                      ? `${settings.reminderHour - 12}:00 PM`
                      : `${settings.reminderHour}:00 AM`}
                  </Label>
                  <Slider
                    min={5}
                    max={12}
                    step={1}
                    value={[settings.reminderHour]}
                    onValueChange={(value) =>
                      updateSetting(
                        "reminderHour",
                        Array.isArray(value) ? (value[0] ?? 8) : value
                      )
                    }
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5 AM</span>
                    <span>12 PM</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-primary" />
              Data Source
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/40 p-3">
              <div className="mb-1 flex items-center justify-between gap-3">
                <div className="text-sm font-medium">Current source mode</div>
                <Badge variant="outline">{healthStatusLabel}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Last Apple Health sample import: {lastImport}
              </p>
            </div>

            <HealthImportCard compact importing={importing} onImport={handleImportHealth} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Moon className="h-4 w-4 text-primary" />
              Sleep Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              {entries.length} night{entries.length === 1 ? "" : "s"} currently stored locally.
            </div>

            <button
              type="button"
              onClick={() => handleLoadDemo("mixed")}
              className="flex w-full items-center justify-between py-2 text-sm transition-colors hover:text-primary"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                Load mixed demo data
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>

            <Separator />

            <button
              type="button"
              onClick={() => handleLoadDemo("manual")}
              className="flex w-full items-center justify-between py-2 text-sm transition-colors hover:text-primary"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                Load manual-only demo data
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>

            <Separator />

            <button
              type="button"
              onClick={() => setShowClear(true)}
              className="flex w-full items-center justify-between py-2 text-sm text-destructive transition-colors hover:text-destructive/80"
            >
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Clear all sleep data
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pb-4 pt-4">
            <div className="space-y-1 text-center">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                <Moon className="h-4 w-4 text-primary" />
                Simple Sleep Tracker: Journal
              </div>
              <p className="text-xs text-muted-foreground">
                Local-first sleep debt, consistency, and journaling
              </p>
              <p className="text-xs text-muted-foreground">v1.0.0</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showClear} onOpenChange={setShowClear}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear all sleep data</DialogTitle>
            <DialogDescription>
              This removes every stored night from your browser on this device. Your app
              settings stay in place.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClear(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAll}>
              Clear data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
