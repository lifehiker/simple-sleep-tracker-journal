import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon } from "lucide-react";

export default function PrivacyPage() {
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

      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground text-sm mb-8">Last updated: May 9, 2026</p>

      <div className="prose prose-sm max-w-none space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold mb-2">Data Storage</h2>
          <p className="text-muted-foreground">
            Simple Sleep Tracker stores all your sleep data locally in your browser using
            localStorage. We do not transmit, collect, or store your sleep data on any
            external server.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">What We Collect</h2>
          <p className="text-muted-foreground">
            We collect no personal information. Sleep entries, notes, and settings are
            stored entirely on your device and never leave it. We do not use analytics,
            tracking, or advertising.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Notifications</h2>
          <p className="text-muted-foreground">
            If you enable reminders, we request browser notification permission. This
            permission is stored locally and can be revoked at any time in your browser
            settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Third-Party Services</h2>
          <p className="text-muted-foreground">
            We do not integrate with any third-party analytics, advertising, or tracking
            services. Apple Health sample imports in this web build are generated locally
            on-device for demonstration purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Data Deletion</h2>
          <p className="text-muted-foreground">
            You can delete all your data at any time from Settings → Clear all sleep data.
            Clearing browser storage will also remove all app data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Contact</h2>
          <p className="text-muted-foreground">
            For privacy questions, please contact us through the app&apos;s support page.
          </p>
        </section>
      </div>
    </div>
  );
}
