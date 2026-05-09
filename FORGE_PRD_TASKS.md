# FORGE_PRD_TASKS.md — Simple Sleep Tracker & Journal

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Complete

## Phase 1: Foundation
- [x] Confirm local framework constraints from `AGENTS.md` and local `node_modules/next/dist/docs/`
- [x] Keep `next.config.ts` on `output: "standalone"`
- [x] Keep build safe for offline/CI environments
- [x] Replace stale completion assumptions from the interrupted prior session with verified status

## Phase 2: Data Model
- [x] `SleepEntry` model for bedtime, sleep start, wake time, awake minutes, note, source, timestamps
- [x] `UserSettings` model covers target sleep, premium, onboarding state, reminder settings, and Health/manual source preference
- [x] Mock/demo Apple Health import model and storage helpers for safe local fallback
- [x] Storage utilities support CRUD, import, reset/demo data, and route-friendly reads

## Phase 3: Auth
- [x] PRD does not require user auth
- [x] Safe fallback is anonymous local-only usage with no account required

## Phase 4: Core User Pages
- [x] Landing page `/` with product positioning, pricing, and CTAs
- [x] Onboarding `/onboarding` asks about Apple Health access, target sleep duration, reminder preference, and manual fallback
- [x] App summary `/app` shows last night summary, debt, consistency, trends, and correct empty/import states
- [x] Journal list `/app/journal` shows reverse-chronological history with premium gating
- [x] Add entry `/app/journal/add` supports full manual log fields
- [x] Entry detail `/app/journal/[id]` supports review, edit, and delete for manual entries
- [x] Trends `/app/trends` supports 7-day and premium 30-day insights
- [x] Settings `/app/settings` supports goal, reminder preference, data controls, premium access, and source status
- [x] Premium `/app/settings/premium` provides mock-safe billing fallback with clear feature gating
- [x] Legal pages `/privacy` and `/terms`

## Phase 5: Core Workflows
- [x] Manual sleep logging flow: add, validate, save, edit, delete
- [x] Apple Health import flow: web-safe mock/demo import with clear limitation messaging
- [x] Last night summary flow with empty-state CTA to log manually or import
- [x] Sleep debt calculation flow
- [x] Bedtime consistency calculation flow
- [x] 7-day and 30-day trends flow
- [x] Premium gating flow for 30-day insights and unlimited history
- [x] Reminder preference flow with browser-safe permission handling

## Phase 6: API / Server Actions
- [x] PRD does not require backend APIs or server actions
- [x] Safe fallback is a fully local browser implementation

## Phase 7: Integrations / External Services
- [x] Billing: mock local premium unlock path exists as safe fallback
- [x] Billing copy and docs clearly distinguish mock flow from real Stripe/StoreKit integration
- [x] Email: not required by PRD
- [x] Storage: local browser storage is the primary safe fallback
- [x] Apple Health: UI + guarded local fallback implemented and documented as native-only for real integration

## Phase 8: Marketing / SEO
- [x] Metadata and landing copy align with PRD keyword strategy
- [x] Demo CTA does not silently pollute real user data
- [x] Legal/footer/support copy is polished and internally consistent

## Phase 9: Deployment
- [x] Production Dockerfile exists
- [~] Dockerfile only copies directories that exist and is validated with `docker build .` if Docker is available
- [x] Deployment docs reflect standalone Next.js output

## Phase 10: Verification
- [x] `npm run build` passes on current codebase
- [x] `npm run lint` passes
- [x] Dev server starts without crashing
- [x] Primary routes smoke-tested
- [x] Interactive flows checked and fixed where necessary
- [x] `FORGE_COMPLETION_AUDIT.md` created mapping PRD requirements to implementation
- [x] `HUMAN_INPUT_NEEDED.md` updated to only list true external requirements

## Current Focus
- [x] Repair lint-invalid client state patterns and stale demo/onboarding behavior
- [x] Implement Health import fallback UX and supporting storage/settings changes
- [x] Re-audit all routes after edits, then update this checklist with completed status

## Notes
- [~] `docker build .` could not be completed here because the Docker CLI could not access `/var/run/docker.sock`, even though Docker is installed.
