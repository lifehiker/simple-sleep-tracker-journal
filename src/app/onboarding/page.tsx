"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Moon, Target, Bell, Check, ChevronRight, Smartphone, PenLine } from "lucide-react";
import { formatMinutes } from "@/lib/metrics";
import {
  markManualOnly,
  replaceWithDemoData,
  updateUserSettings,
} from "@/lib/storage";

const steps = ["welcome", "health", "goal", "reminder", "done"] as const;
type Step = (typeof steps)[number];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const demoMode = searchParams.get("demo") === "1";

  const [step, setStep] = useState<Step>("welcome");
  const [targetMinutes, setTargetMinutes] = useState(480);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderHour, setReminderHour] = useState(8);
  const [sleepSource, setSleepSource] = useState<"health" | "manual">("health");

  const next = () => {
    const index = steps.indexOf(step);
    if (index < steps.length - 1) {
      setStep(steps[index + 1]);
    }
  };

  const finish = () => {
    const healthAccessMode =
      sleepSource === "health" ? "sample-imported" : "manual-only";

    updateUserSettings({
      targetSleepMinutes: targetMinutes,
      reminderEnabled,
      reminderHour,
      reminderMinute: 0,
      onboardingComplete: true,
      healthAccessMode,
      lastHealthImportAt: sleepSource === "health" ? new Date().toISOString() : null,
    });

    if (sleepSource === "manual") {
      markManualOnly();
    }

    if (demoMode) {
      replaceWithDemoData(sleepSource === "health" ? "mixed" : "manual");
    }

    router.push("/app");
  };

  const handleReminderToggle = async (enabled: boolean) => {
    if (enabled && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setReminderEnabled(false);
        return;
      }
    }

    setReminderEnabled(enabled);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6 py-12">
      <div className="mb-10 flex gap-2">
        {steps.slice(0, -1).map((currentStep) => (
          <div
            key={currentStep}
            className={`h-1.5 rounded-full transition-all ${
              steps.indexOf(currentStep) <= steps.indexOf(step)
                ? "w-8 bg-primary"
                : "w-4 bg-muted"
            }`}
          />
        ))}
      </div>

      {step === "welcome" && (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10">
            <Moon className="h-12 w-12 text-primary" />
          </div>
          <div>
            <div className="mb-3 flex items-center justify-center gap-2">
              <h1 className="text-3xl font-bold">Simple Sleep Tracker</h1>
              {demoMode && <Badge variant="secondary">Demo</Badge>}
            </div>
            <p className="leading-relaxed text-muted-foreground">
              Track sleep debt, bedtime consistency, and nightly notes without turning
              sleep tracking into a full wellness platform.
            </p>
          </div>
          <div className="space-y-3 rounded-2xl bg-muted p-4 text-left">
            {[
              "Review last night in seconds",
              "Compare your sleep to your nightly target",
              "Spot inconsistent bedtimes before they become a pattern",
              "Keep quick notes on bad and good nights",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {item}
              </div>
            ))}
          </div>
          <Button onClick={next} className="h-12 w-full text-base" size="lg">
            {demoMode ? "Preview the app" : "Get Started"}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      {step === "health" && (
        <div className="w-full space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Smartphone className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Choose your sleep source</h2>
            <p className="text-sm text-muted-foreground">
              Real Apple Health import needs native HealthKit access. In this web build,
              you can preview imported nights locally or stick with manual logging.
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setSleepSource("health")}
              className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                sleepSource === "health"
                  ? "border-primary bg-primary/6"
                  : "border-border bg-card"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" />
                <span className="font-semibold">Apple Health sample import</span>
                <Badge variant="secondary" className="ml-auto text-[11px]">
                  Recommended
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Load local sample nights tagged as Apple Health so you can see the full
                import-based experience without any external connection.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSleepSource("manual")}
              className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                sleepSource === "manual"
                  ? "border-primary bg-primary/6"
                  : "border-border bg-card"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <PenLine className="h-4 w-4 text-primary" />
                <span className="font-semibold">Manual logging only</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Skip import and log bedtime, sleep start, wake time, awake minutes, and
                notes yourself.
              </p>
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            You can change this later in Settings. No account or credentials required.
          </p>

          <Button onClick={next} className="h-12 w-full text-base">
            Continue
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      {step === "goal" && (
        <div className="w-full space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Set your target</h2>
            <p className="text-sm text-muted-foreground">
              Sleep debt is calculated against this nightly goal.
            </p>
          </div>

          <div className="rounded-2xl bg-muted p-6 text-center">
            <div className="mb-1 text-5xl font-bold text-primary">
              {formatMinutes(targetMinutes)}
            </div>
            <div className="text-sm text-muted-foreground">per night</div>
          </div>

          <div className="space-y-3">
            <Slider
              min={240}
              max={600}
              step={15}
              value={[targetMinutes]}
              onValueChange={(value) =>
                setTargetMinutes(Array.isArray(value) ? (value[0] ?? 480) : value)
              }
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>4h</span>
              <span>6h</span>
              <span>8h</span>
              <span>10h</span>
            </div>
          </div>

          <Button onClick={next} className="h-12 w-full text-base">
            Continue
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      {step === "reminder" && (
        <div className="w-full space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Bell className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Morning reminder</h2>
            <p className="text-sm text-muted-foreground">
              Save a preferred reminder time. Browser notification delivery depends on
              your device and browser support.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl bg-muted p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label>Enable daily reminder</Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  &ldquo;Review last night&apos;s sleep and leave a note.&rdquo;
                </p>
              </div>
              <Switch checked={reminderEnabled} onCheckedChange={handleReminderToggle} />
            </div>

            {reminderEnabled && (
              <div className="space-y-2 border-t border-border pt-3">
                <div className="flex justify-between text-sm">
                  <span>Reminder time</span>
                  <span className="font-medium">
                    {reminderHour > 12
                      ? `${reminderHour - 12}:00 PM`
                      : `${reminderHour}:00 AM`}
                  </span>
                </div>
                <Slider
                  min={5}
                  max={12}
                  step={1}
                  value={[reminderHour]}
                  onValueChange={(value) =>
                    setReminderHour(Array.isArray(value) ? (value[0] ?? 8) : value)
                  }
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 AM</span>
                  <span>12 PM</span>
                </div>
              </div>
            )}
          </div>

          <Button onClick={next} className="h-12 w-full text-base">
            {reminderEnabled ? "Save reminder" : "Skip for now"}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      {step === "done" && (
        <div className="w-full space-y-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-12 w-12" />
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-bold">You&apos;re set</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your nightly goal is {formatMinutes(targetMinutes)}.{" "}
              {sleepSource === "health"
                ? "You’ll start with sample Apple Health nights in this web-safe build."
                : "You can start logging manually right away."}
            </p>
          </div>
          <Button onClick={finish} className="h-12 w-full text-base" size="lg">
            {demoMode ? "Open the demo" : "Open my tracker"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <OnboardingContent />
    </Suspense>
  );
}
