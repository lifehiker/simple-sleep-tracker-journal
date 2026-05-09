"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Moon } from "lucide-react";
import { addSleepEntry, generateId } from "@/lib/storage";
import { SleepEntry } from "@/lib/types";
import { toast } from "sonner";

function toLocalDatetimeString(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AddSleepEntryPage() {
  const router = useRouter();

  const now = new Date();
  const defaultWake = toLocalDatetimeString(now);
  const defaultSleep = toLocalDatetimeString(new Date(now.getTime() - 8 * 60 * 60 * 1000));
  const defaultBed = toLocalDatetimeString(new Date(now.getTime() - 8.25 * 60 * 60 * 1000));

  const [bedTime, setBedTime] = useState(defaultBed);
  const [sleepStart, setSleepStart] = useState(defaultSleep);
  const [wakeTime, setWakeTime] = useState(defaultWake);
  const [awakeMinutes, setAwakeMinutes] = useState("0");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!sleepStart || !wakeTime) {
      toast.error("Please fill in sleep start and wake time");
      return;
    }
    const start = new Date(sleepStart);
    const end = new Date(wakeTime);
    const bed = bedTime ? new Date(bedTime) : start;

    if (end <= start) {
      toast.error("Wake time must be after sleep start");
      return;
    }

    setSaving(true);
    const timeInBed = Math.round((end.getTime() - bed.getTime()) / 60000);
    const entry: SleepEntry = {
      id: generateId(),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      bedTime: bed.toISOString(),
      timeInBedMinutes: Math.max(0, timeInBed),
      awakeMinutes: Math.max(0, parseInt(awakeMinutes) || 0),
      note: note.trim(),
      source: "manual",
      createdAt: new Date().toISOString(),
    };

    addSleepEntry(entry);
    toast.success("Sleep entry saved");
    router.push("/app/journal");
  };

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            Log Sleep
          </h2>
          <p className="text-xs text-muted-foreground">Enter last night&apos;s sleep</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="bedtime">
              Bedtime <span className="text-muted-foreground text-xs">(when you got into bed)</span>
            </Label>
            <Input
              id="bedtime"
              type="datetime-local"
              value={bedTime}
              onChange={(e) => setBedTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sleep-start">
              Fell asleep <span className="text-muted-foreground text-xs">(approximate)</span>
            </Label>
            <Input
              id="sleep-start"
              type="datetime-local"
              value={sleepStart}
              onChange={(e) => setSleepStart(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wake-time">Wake time</Label>
            <Input
              id="wake-time"
              type="datetime-local"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="awake-minutes">
              Time awake during night{" "}
              <span className="text-muted-foreground text-xs">(minutes)</span>
            </Label>
            <Input
              id="awake-minutes"
              type="number"
              min="0"
              max="480"
              value={awakeMinutes}
              onChange={(e) => setAwakeMinutes(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">
              Note <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              id="note"
              placeholder="How did you sleep? Stress, diet, exercise..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Entry"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
