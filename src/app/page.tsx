import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Moon,
  BarChart2,
  BookOpen,
  TrendingDown,
  Check,
  Star,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Moon,
    title: "Nightly Summary",
    desc: "See last night's total sleep, efficiency, bedtime, and wake time at a glance",
  },
  {
    icon: TrendingDown,
    title: "Sleep Debt Tracker",
    desc: "Know exactly how much sleep you owe yourself — or how much surplus you've built",
  },
  {
    icon: BarChart2,
    title: "Bedtime Consistency",
    desc: "Track how regular your sleep schedule is with a simple consistency score",
  },
  {
    icon: BookOpen,
    title: "Sleep Journal",
    desc: "Add private notes to every night — mood, stress, what changed on bad nights",
  },
];

const comparisons = [
  { label: "Clean nightly summary", us: true, apple: false, others: false },
  { label: "Sleep debt calculation", us: true, apple: false, others: true },
  { label: "Bedtime consistency score", us: true, apple: false, others: false },
  { label: "Private sleep journal", us: true, apple: false, others: false },
  { label: "Manual logging fallback", us: true, apple: true, others: true },
  { label: "Simple, focused UI", us: true, apple: false, others: false },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Moon className="h-5 w-5 text-primary" />
            Simple Sleep Tracker
          </div>
          <Link href="/onboarding">
            <Button size="sm">Try Free</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
        <Badge className="mb-4 text-xs" variant="secondary">
          Sleep debt, bedtime consistency, notes
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
          Your sleep, finally{" "}
          <span className="text-primary">simple</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
          Track your sleep debt, see bedtime consistency, and keep a private sleep
          journal — without the bloated wellness platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/onboarding">
            <Button size="lg" className="h-12 px-8 text-base font-semibold gap-2">
              Start Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/onboarding?demo=1">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              View Demo
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Free forever · No account required · Premium from $3.99/mo
        </p>
      </section>

      {/* Mock App Preview */}
      <section className="max-w-sm mx-auto px-4 mb-16">
        <div className="rounded-3xl border-2 border-border bg-card shadow-2xl overflow-hidden">
          <div className="bg-muted h-10 flex items-center justify-center">
            <div className="w-20 h-1.5 rounded-full bg-foreground/20" />
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground">Wednesday, May 6</p>
                <p className="text-lg font-bold">Good morning</p>
              </div>
              <div className="h-8 w-20 rounded-lg bg-primary/10 flex items-center justify-center gap-1 text-xs text-primary font-medium">
                + Log Sleep
              </div>
            </div>
            <div className="rounded-xl border border-border p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Moon className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold">Last Night</span>
                <div className="ml-auto bg-muted rounded px-1.5 py-0.5 text-xs">Manual</div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold text-primary">7h 23m</span>
                <span className="text-xs text-muted-foreground">of sleep<br />37min short</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-2">
                <div className="h-full bg-primary rounded-full" style={{ width: "92%" }} />
              </div>
              <div className="grid grid-cols-3 gap-1 text-center">
                {["10:45 PM", "7h 38m", "6:23 AM"].map((v, i) => (
                  <div key={i}>
                    <div className="text-xs text-muted-foreground">
                      {["Bedtime", "In bed", "Wake up"][i]}
                    </div>
                    <div className="text-xs font-medium">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingDown className="h-3.5 w-3.5 text-orange-500" />
                <span className="text-xs font-semibold">7-Day Sleep Debt</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-orange-500">+3h 12m</span>
                <span className="text-xs text-muted-foreground">sleep debt this week</span>
              </div>
            </div>
          </div>
          <div className="border-t border-border bg-card/90 px-4 py-2 flex justify-around">
            {["Tonight", "Journal", "Trends", "Settings"].map((t) => (
              <div key={t} className="flex flex-col items-center gap-0.5">
                <div className="w-4 h-4 rounded bg-muted" />
                <span className="text-xs text-muted-foreground">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Everything you need, nothing you don&apos;t
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          Built for people who want useful sleep insights, not a lifestyle app
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-5 space-y-2"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Why not just use Apple Health?
        </h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-4 bg-muted text-xs font-semibold">
            <div className="p-3">Feature</div>
            <div className="p-3 text-primary text-center">Simple Sleep</div>
            <div className="p-3 text-center text-muted-foreground">Apple Health</div>
            <div className="p-3 text-center text-muted-foreground">Others</div>
          </div>
          {comparisons.map(({ label, us, apple, others }, i) => (
            <div
              key={label}
              className={`grid grid-cols-4 text-sm ${i % 2 === 0 ? "" : "bg-muted/30"}`}
            >
              <div className="p-3">{label}</div>
              <div className="p-3 flex justify-center">
                {us ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
              <div className="p-3 flex justify-center">
                {apple ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
              <div className="p-3 flex justify-center">
                {others ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Simple pricing</h2>
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-1">Free</h3>
            <div className="text-3xl font-bold mb-3">$0</div>
            <div className="space-y-2 text-sm text-muted-foreground">
              {["Last 7 days", "Manual logging", "Nightly summary", "Basic sleep debt"].map(
                (f) => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-muted-foreground" />
                    {f}
                  </div>
                )
              )}
            </div>
            <Link href="/onboarding">
              <Button variant="outline" className="w-full mt-4">
                Get Started
              </Button>
            </Link>
          </div>
          <div className="rounded-xl border-2 border-primary bg-primary/5 p-6 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
              Most Popular
            </Badge>
            <h3 className="font-semibold mb-1">Premium</h3>
            <div className="text-3xl font-bold mb-1">$19.99</div>
            <div className="text-xs text-muted-foreground mb-3">per year · 7-day free trial</div>
            <div className="space-y-2 text-sm">
              {[
                "Everything in Free",
                "30-day trends",
                "Full journal history",
                "Consistency analytics",
                "Sleep debt history",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-primary" />
                  {f}
                </div>
              ))}
            </div>
            <Link href="/onboarding">
              <Button className="w-full mt-4">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">What people are saying</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              name: "Sarah M.",
              text: "Finally a sleep app that doesn't feel like a full-time job. I just log, see my debt, done.",
            },
            {
              name: "James K.",
              text: "The consistency score made me realize my weekends were wrecking my whole sleep schedule.",
            },
            {
              name: "Alex R.",
              text: "Simple enough to actually stick with. I've tried 5 other apps, this is the first I use daily.",
            },
          ].map(({ name, text }) => (
            <div key={name} className="rounded-xl border border-border bg-card p-4">
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">&ldquo;{text}&rdquo;</p>
              <p className="text-xs font-medium">{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
          <Moon className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Start sleeping smarter tonight</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            No account required. Works in your browser. Track your first sleep in 30 seconds.
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="h-12 px-8 text-base font-semibold gap-2">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Moon className="h-4 w-4 text-primary" />
            Simple Sleep Tracker: Journal
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/app" className="hover:text-foreground transition-colors">
              Open App
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 Simple Sleep Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
