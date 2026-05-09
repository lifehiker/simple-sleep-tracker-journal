"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Crown, Check, Zap } from "lucide-react";
import { getUserSettings, updateUserSettings } from "@/lib/storage";
import { toast } from "sonner";
import { useIsClient } from "@/lib/use-is-client";

const features = [
  "30-day trends & charts",
  "Full journal history (unlimited)",
  "Sleep debt history",
  "Bedtime consistency analytics",
  "Advanced trend insights",
  "Custom reminder times",
];

const freeFeatures = [
  "Last 7 days of history",
  "Manual sleep logging",
  "Nightly summary",
  "Basic sleep debt (7-day)",
  "1 daily reminder",
];

export default function PremiumPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");
  const [loading, setLoading] = useState(false);
  const mounted = useIsClient();

  if (!mounted) return null;
  const isPremium = getUserSettings().isPremium;

  const handleUpgrade = () => {
    setLoading(true);
    // Simulate purchase flow (in production: StoreKit or Stripe)
    setTimeout(() => {
      updateUserSettings({ isPremium: true });
      setLoading(false);
      toast.success("Premium unlocked! Enjoy full access.");
    }, 1500);
  };

  const handleRestore = () => {
    toast.info("No previous purchase found. Contact support if this is wrong.");
  };

  if (isPremium) {
    return (
      <div className="py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-bold">Premium</h2>
        </div>

        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <Crown className="h-10 w-10 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-2">You&apos;re Premium!</h3>
          <p className="text-muted-foreground mb-6">
            All features are unlocked. Thank you for your support!
          </p>
          <Button variant="outline" onClick={() => router.back()}>
            Back to Settings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold">Upgrade to Premium</h2>
      </div>

      {/* Hero */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Crown className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-1">Simple Sleep Tracker: Premium</h3>
        <p className="text-sm text-muted-foreground">
          Deeper insights. Longer history. Better sleep habits.
        </p>
      </div>

      {/* Plan selector */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => setSelectedPlan("monthly")}
          className={`rounded-xl border p-4 text-left transition-all ${
            selectedPlan === "monthly"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="text-sm text-muted-foreground mb-1">Monthly</div>
          <div className="text-2xl font-bold">$3.99</div>
          <div className="text-xs text-muted-foreground">per month</div>
        </button>

        <button
          onClick={() => setSelectedPlan("annual")}
          className={`rounded-xl border p-4 text-left transition-all relative ${
            selectedPlan === "annual"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <Badge className="absolute -top-2 -right-2 text-xs bg-green-500">
            Save 58%
          </Badge>
          <div className="text-sm text-muted-foreground mb-1">Annual</div>
          <div className="text-2xl font-bold">$19.99</div>
          <div className="text-xs text-muted-foreground">per year · 7-day trial</div>
        </button>
      </div>

      {/* Features */}
      <Card className="mb-4">
        <CardContent className="pt-4 pb-4">
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Premium includes</span>
            </div>
            <div className="space-y-2">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-3 mt-3">
            <div className="text-xs text-muted-foreground mb-2 font-medium">Free includes</div>
            <div className="space-y-1.5">
              {freeFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="h-3 w-3 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full h-12 text-base font-semibold mb-3"
      >
        {loading
          ? "Processing..."
          : selectedPlan === "annual"
          ? "Start 7-Day Free Trial — $19.99/yr"
          : "Subscribe — $3.99/month"}
      </Button>

      <button
        onClick={handleRestore}
        className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
      >
        Restore previous purchase
      </button>

      <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
        Annual plan includes a 7-day free trial. Cancel anytime. No commitment required.
        Subscription renews automatically.
      </p>
    </div>
  );
}
