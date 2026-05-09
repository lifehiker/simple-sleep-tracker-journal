"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, Edit2, Moon } from "lucide-react";
import {
  getSleepEntryById,
  updateSleepEntry,
  deleteSleepEntry,
} from "@/lib/storage";
import {
  calculateDurationMinutes,
  calculateTimeInBedMinutes,
  calculateEfficiency,
  formatMinutes,
  formatDate,
  formatDateTime,
} from "@/lib/metrics";
import { SleepEntry } from "@/lib/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsClient } from "@/lib/use-is-client";

function toLocalDatetimeString(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function SleepEntryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const mounted = useIsClient();

  // Edit state
  const [bedTime, setBedTime] = useState("");
  const [sleepStart, setSleepStart] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [awakeMinutes, setAwakeMinutes] = useState("0");
  const [note, setNote] = useState("");
  if (!mounted) {
    return (
      <div className="py-6">
        <div className="h-8 w-40 rounded-md bg-muted animate-pulse mb-6" />
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  const entry = getSleepEntryById(id);

  if (!entry) {
    return (
      <div className="py-6 text-center">
        <p className="text-muted-foreground">Entry not found</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4">
          Go back
        </Button>
      </div>
    );
  }

  const duration = calculateDurationMinutes(entry);
  const timeInBed = calculateTimeInBedMinutes(entry);
  const efficiency = calculateEfficiency(entry);

  const startEditing = () => {
    setBedTime(toLocalDatetimeString(new Date(entry.bedTime || entry.startDate)));
    setSleepStart(toLocalDatetimeString(new Date(entry.startDate)));
    setWakeTime(toLocalDatetimeString(new Date(entry.endDate)));
    setAwakeMinutes(String(entry.awakeMinutes));
    setNote(entry.note);
    setEditing(true);
  };

  const handleSave = () => {
    if (!sleepStart || !wakeTime) {
      toast.error("Sleep start and wake time are required");
      return;
    }
    const start = new Date(sleepStart);
    const end = new Date(wakeTime);
    const bed = bedTime ? new Date(bedTime) : start;

    if (end <= start) {
      toast.error("Wake time must be after sleep start");
      return;
    }

    const timeInBedCalc = Math.round((end.getTime() - bed.getTime()) / 60000);
    const updated: SleepEntry = {
      ...entry,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      bedTime: bed.toISOString(),
      timeInBedMinutes: Math.max(0, timeInBedCalc),
      awakeMinutes: Math.max(0, parseInt(awakeMinutes) || 0),
      note: note.trim(),
    };

    updateSleepEntry(updated);
    setEditing(false);
    toast.success("Entry updated");
  };

  const handleDelete = () => {
    deleteSleepEntry(entry.id);
    toast.success("Entry deleted");
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
        <div className="flex-1">
          <h2 className="text-xl font-bold">{formatDate(entry.endDate)}</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {entry.source === "health" ? "Apple Health" : "Manual"}
            </Badge>
          </div>
        </div>
        {entry.source === "manual" && !editing && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={startEditing}
              className="h-8 w-8"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDelete(true)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {!editing ? (
        <div className="space-y-4">
          {/* Stats */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Moon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{formatMinutes(duration)}</div>
                  <div className="text-sm text-muted-foreground">Total sleep</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-xs text-muted-foreground">Bedtime</div>
                  <div className="text-sm font-semibold mt-0.5">
                    {formatDateTime(entry.bedTime || entry.startDate)}
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-xs text-muted-foreground">Wake up</div>
                  <div className="text-sm font-semibold mt-0.5">
                    {formatDateTime(entry.endDate)}
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-xs text-muted-foreground">Time in bed</div>
                  <div className="text-sm font-semibold mt-0.5">{formatMinutes(timeInBed)}</div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-xs text-muted-foreground">Sleep efficiency</div>
                  <div className="text-sm font-semibold mt-0.5">{efficiency}%</div>
                </div>
                {entry.awakeMinutes > 0 && (
                  <div className="rounded-lg bg-muted p-3 col-span-2">
                    <div className="text-xs text-muted-foreground">Awake during night</div>
                    <div className="text-sm font-semibold mt-0.5">
                      {formatMinutes(entry.awakeMinutes)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Note */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold mb-2">Journal Note</h3>
              {entry.note ? (
                <p className="text-sm text-foreground/80 leading-relaxed">{entry.note}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No note added</p>
              )}
              {entry.source === "manual" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={startEditing}
                >
                  {entry.note ? "Edit note" : "Add note"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="edit-bedtime">Bedtime</Label>
              <Input
                id="edit-bedtime"
                type="datetime-local"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sleep">Fell asleep</Label>
              <Input
                id="edit-sleep"
                type="datetime-local"
                value={sleepStart}
                onChange={(e) => setSleepStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-wake">Wake time</Label>
              <Input
                id="edit-wake"
                type="datetime-local"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-awake">Awake during night (min)</Label>
              <Input
                id="edit-awake"
                type="number"
                min="0"
                value={awakeMinutes}
                onChange={(e) => setAwakeMinutes(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-note">Note</Label>
              <Textarea
                id="edit-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="resize-none"
                placeholder="How did you feel?"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditing(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this sleep entry? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
