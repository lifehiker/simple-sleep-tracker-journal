import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 font-semibold">
          <Moon className="h-5 w-5 text-primary" />
          Simple Sleep Tracker
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground text-sm mb-8">Last updated: May 9, 2026</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold mb-2">Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By using Simple Sleep Tracker: Journal, you agree to these terms. If you do not
            agree, please do not use the app.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Use of Service</h2>
          <p className="text-muted-foreground">
            Simple Sleep Tracker is provided for personal, non-commercial sleep tracking
            purposes. You may not use it for medical diagnosis or treatment decisions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Premium Subscriptions</h2>
          <p className="text-muted-foreground">
            Premium subscriptions are presented as monthly ($3.99) or annual ($19.99)
            plans. In this web build, premium unlock is a local demo flow and no payment
            method is charged. A production billing integration would need Stripe, StoreKit,
            or another payment provider before live sales.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Disclaimer</h2>
          <p className="text-muted-foreground">
            Sleep data and metrics are estimates for personal awareness purposes only.
            They are not medical advice. Consult a healthcare professional for sleep
            disorders or medical concerns.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Limitation of Liability</h2>
          <p className="text-muted-foreground">
            Simple Sleep Tracker is provided &ldquo;as is&rdquo; without warranty. We are not liable
            for any data loss or decisions made based on the app&apos;s data.
          </p>
        </section>
      </div>
    </div>
  );
}
