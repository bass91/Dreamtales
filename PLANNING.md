
# PLANNING.md — DreamTales MVP

This is the high‑level roadmap (what & when). See `TASK.md` for the detailed, one‑by‑one checklist.

## Goals (from PRD)
- Generate safe, age‑appropriate bedtime stories from a minimal prompt.
- Work both online (cloud API) and on LAN/local model later.
- Store and read stories locally (offline reading).

## Milestones

### M1 — Project Setup
**Outcome:** Clean Nuxt 3 + TS project with hygiene in place.  
**Includes:**
- Repo scaffold, ESLint/Prettier, MIT license, README, CONTRIBUTING, PR template.
- Folder layout per `AI_CODER_RULES.md`.
- Runtime config ready for provider keys.

### M2 — AI Plumbing & Safety (Server)
**Outcome:** Reliable `/api/story` endpoint with safety gates.  
**Includes:**
- `server/api/story.post.ts` (validate input, map word targets 300–400 / 500–700 / 900–1100).
- `/lib/ai/client.ts` (Vercel AI SDK; provider‑agnostic).
- `/lib/ai/generateStory.ts` (system+user composition, stricter retry path).
- `/lib/ai/safety.ts` (preModerate + postScan, basic sv/en keyword lists).
- Friendly error messages; never log prompts/stories.

### M3 — Persistence (Local)
**Outcome:** Stories stored and retrievable locally.  
**Includes:**
- `/lib/db/stories.ts` (IndexedDB: save, list, get).
- `/types/story.ts` for strict typing.
- Auto‑save on successful generation.

### M4 — UI Core (Create → Read)
**Outcome:** End‑to‑end story creation and reading.  
**Includes:**
- `pages/index.vue`: prompt, length (S/M/L), language (sv/en), child names, theme, tone, reading level, wind‑down; loading/error states.
- `pages/history.vue`: list saved stories (title + date) → open.
- `pages/story/[id].vue`: reading view, auto‑title, copy.
- Minimal i18n via `/lib/ui/i18n.ts` (sv default, en mirror).

### M5 — UX Polish & Offline/PWA
**Outcome:** Smooth usage and offline reading.  
**Includes:**
- Night mode toggle + font size slider (persist via localStorage).
- Offline behavior: history & reading work offline; index disables Generate with guidance.
- PWA installability (manifest + basic service worker).
- Performance pass (S ≤15s, M ≤30s, L ≤60s; main page ≤100KB JS).

## Acceptance (MVP)
- Long story generated ≤60s.  
- Stories auto‑save; history → open in reading view.  
- Reading works offline; index page shows “Connect to generate” when offline.  
- Age‑appropriate output with basic safety gates and one auto‑retry if flagged.  
- No analytics; no server logging of prompts/stories (unless local).

## Risks & Mitigations
- **Borderline content** → pre/post safety + stricter retry prompt.
- **Provider performance variance** → adjustable model/provider in runtime config.
- **IndexedDB limits** → keep text only; no images in MVP; prune oldest if needed (later).

## Dependencies
- Nuxt 3, Vercel AI SDK, IndexedDB (via `idb` or minimal wrapper).

## Ways of Working
- One task per PR (mirror `TASK.md`).  
- Conventional Commits; atomic diffs; ≤40 LOC per function guideline.  
- Keep UI components thin; move logic to `/lib` or composables.

---

**Track progress in** `TASK.md`.  
**When in doubt, prefer PRD & AI_CODER_RULES.md over ad‑hoc changes.`
