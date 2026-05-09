# HUMAN_INPUT_NEEDED.md

No input is required to run this app as delivered.

The build is fully local-first:
- Sleep entries and settings are stored in browser `localStorage`
- Premium upgrade is a mock local unlock
- Apple Health import uses a local sample-data fallback
- Reminder preferences are stored locally and use browser notification permission when available

## Only needed if you want real external integrations later

### Real billing
- Provide Stripe or StoreKit integration details if you want paid subscriptions beyond the current mock unlock flow.
- For a Stripe web implementation, you would need:
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`

### Real Apple Health import
- A true Apple Health integration requires a native iOS app with HealthKit.
- The current web app already includes the UI path and a safe local fallback, so the product works without this.

### Reliable push reminders across devices
- The current build stores reminder preferences locally and requests browser notification permission when available.
- If you want robust cross-device or background delivery, you would need a production push-notification setup outside the scope of this local-first web build.
