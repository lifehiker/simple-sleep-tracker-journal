"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Smartphone, ShieldCheck } from "lucide-react";

interface HealthImportCardProps {
  compact?: boolean;
  importing?: boolean;
  onImport: () => void;
}

export function HealthImportCard({
  compact = false,
  importing = false,
  onImport,
}: HealthImportCardProps) {
  return (
    <Card className="overflow-hidden border-primary/20 bg-linear-to-br from-primary/8 via-card to-card">
      <CardContent className={compact ? "pt-4 pb-4" : "pt-5 pb-5"}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <Smartphone className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold">Apple Health import</h3>
              <Badge variant="secondary" className="text-[11px]">
                Safe web fallback
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Real HealthKit access needs a native iPhone app. This web build can load sample
              Apple Health nights locally so you can test the full product flow.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                size={compact ? "sm" : "default"}
                className="gap-2"
                disabled={importing}
                onClick={onImport}
              >
                <RefreshCw className={`h-4 w-4 ${importing ? "animate-spin" : ""}`} />
                {importing ? "Importing..." : "Import sample nights"}
              </Button>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Local-only demo data, no external account
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
