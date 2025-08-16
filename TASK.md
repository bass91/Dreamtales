
# DreamTales — Development Tasks

This checklist follows the PRD (`PRD.md`) and coding standards (`AI_CODER_RULES.md`).  
MVP scope only. One task per commit/PR.

## Core Setup
- [ ] Initialize Nuxt 3 + TypeScript project with ESLint/Prettier, MIT LICENSE, README, CONTRIBUTING, PR template.

## Backend / API
- [ ] Implement `server/api/story.post.ts`:
  - Validate inputs (prompt, language, length, tone?, readingLevel?, windDown?).
  - Map length → word targets (short 300–400, medium 500–700, long 900–1100).
  - Run `preModerate` before generation.
  - Generate story via `/lib/ai/generateStory.ts`.
  - Run `postScan` after generation; auto-regenerate once if unsafe.
  - Return `{ id, text, meta }`. Never log content.

- [ ] Add `/lib/ai/client.ts` using Vercel AI SDK (provider configurable via runtime config).

- [ ] Add `/lib/ai/safety.ts` with `preModerate` and `postScan` keyword checks.

## Persistence
- [ ] Create `/lib/db/stories.ts` with `saveStory`, `listStories`, `getStory` using IndexedDB.
- [ ] Define `/types/story.ts` with StoryLength, Lang, StoryMeta, StoryRecord.

## Frontend UI
- [ ] Build `pages/index.vue`:
  - Prompt textarea.
  - Length radio (short/medium/long, default medium).
  - Language toggle (sv/en, default sv).
  - Inputs: child names, theme, tone, reading level, wind-down toggle.
  - Generate button with loading state + error feedback.
  - On success, auto-save to IndexedDB.
  - Links: History + Reading view.

- [ ] Build `pages/history.vue`:
  - Show saved stories list from IndexedDB (title + date).
  - Click → open in reading view.
  - Empty state message.

- [ ] Build `pages/story/[id].vue`:
  - Load story by id.
  - Auto-generate title if missing.
  - Font size slider (persist via localStorage).
  - Night mode toggle.
  - Copy-to-clipboard button.

## Internationalization
- [ ] Add `/lib/ui/i18n.ts` with SV (default) and EN translations.
- [ ] Wire all UI labels through i18n.

## Offline Support
- [ ] Ensure history & story view work offline from IndexedDB.
- [ ] On index page, disable "Generate" if offline with friendly message ("Connect to generate").

## Non-Functional Requirements
- [ ] Performance: S ≤15s, M ≤30s, L ≤60s.
- [ ] Bundle ≤100KB JS on main page.
- [ ] App installable as PWA.
- [ ] All functions ≤40 LOC, explicit return types, no logs of prompts/stories.
