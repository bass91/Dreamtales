# AI_CODER_RULES.md — DreamTales

> Purpose: make Codex (and similar tools) a predictable, safe, high-quality co-dev for the DreamTales MVP.

## 0) Context (essentials Codex should assume)
- **App:** Nuxt 3 PWA with server routes.  
- **Providers:** Use **Vercel AI SDK** abstraction for LLMs (cloud/local).  
- **Persistence:** **IndexedDB** for story history (plus light localStorage for UI prefs).  
- **MVP features:** Single prompt field, language toggle (SV default + EN), length presets **short/medium/long** mapping to ~**300–400 / 500–700 / 900–1100** words, safe/age-appropriate output, reading view with night mode + font size.  
- **No analytics; no server logging of stories/prompts (unless local).**  
- **License:** MIT.

---

## 1) Repo layout (create/keep)
```
/app
/components
/pages
/server/api
/lib/ai           # model plumbing + safety
/lib/db           # IndexedDB helpers
/lib/ui           # UI utilities (theme, i18n helpers, formatting)
/prompts          # (model prompts if/when needed)
/types
/styles
```

---

## 2) Tech & style rules

### TypeScript & Nuxt
- **TS:** strict mode on; prefer **explicit return types** for public funcs.
- **Nuxt 3:** use server routes in `/server/api/*`; no separate backend.
- **Imports:** use module path aliases (e.g., `@/lib/ai/generateStory`).
- **Reactivity:** keep components dumb; move logic to composables or `/lib`.

### Naming
- Files: `kebab-case.vue|ts`; composables `useXyz.ts`; server handlers `foo.get.ts` / `bar.post.ts`.
- Functions: `verbNoun()`, async functions end with verb (e.g., `saveStories()`).
- Types/Interfaces: `PascalCase`.

### Coding conventions
- Prefer **pure functions** in `/lib`.
- Keep functions ≤ ~40 LOC; split when they grow.
- Use **early returns**; no nested pyramids.
- Error objects must carry a **human message** and **machine code**.

### Lint/format
- ESLint + Prettier; fix on save. No TODOs left in committed code.

---

## 3) Boundaries & responsibilities

| Layer            | Responsibility                                                                    | Never do here                                      |
|------------------|------------------------------------------------------------------------------------|----------------------------------------------------|
| `/server/api`    | Validate input, call AI, map/shape response, return JSON.                          | UI decisions, storage writes (beyond response).    |
| `/lib/ai`        | Provider-agnostic LLM calls via Vercel AI SDK; word-range logic; safety gates.     | DOM access, IndexedDB.                             |
| `/lib/db`        | IndexedDB CRUD (stories, history list).                                            | Network calls, UI strings.                         |
| Components       | Render+events; call composables/`/lib` funcs.                                      | Business logic, AI calls.                          |

---

## 4) Safety, privacy, and keys
- **Never** log prompts or story text to server logs in MVP.
- Strip secrets from any error message shown to the user.
- All provider keys live in **Nuxt runtime config**; never hard-code.

---

## 5) “Ask-first” checklist (Codex must ask before doing)
- Introducing **new dependency** or build tool.
- Changing **public APIs** under `/server/api`.
- Modifying storage schema in `/lib/db`.
- Adding **telemetry/analytics** (disallowed in MVP).

---

## 6) Definition of Done (MVP)
- Builds with `nuxi build` and passes lint.
- Types OK, no `any` in public APIs.
- For user-visible flows, include minimal UX states: loading, error, empty.
- Docs updated if you changed behavior: inline JSDoc + README snippet.
- No tests required (explicit MVP call), but structure code so tests are trivial later.

---

## 7) Length & language contract (business rules Codex must preserve)
- **Lengths:**  
  - short: 300–400 words  
  - medium: 500–700 words  
  - long: 900–1100 words  
- **Language:** default **sv-SE**; allow **en** toggle in UI and pipe through to generator.  

---

## 8) Commit & PR hygiene
- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `style:`.
- Keep subject ≤ 72 chars; imperative mood.
- Open a PR template with: _Context_, _What changed_, _Why_, _Screenshots_, _Risk_, _Roll-back_.

---

## 9) Codex editing protocol (to avoid messy diffs)
- Prefer **surgical edits**: quote the target filename and the exact region to change.
- If a big refactor is needed, propose a **2-step PR plan** (move + adapt).
- When adding a new module, include a 10–20 line usage example in the PR description.

---

## 10) Ready-made Codex prompts

### A) Create story endpoint
> **Goal:** Add `/server/api/story.post.ts` that validates input, enforces length rules, calls Vercel AI SDK, and returns JSON.  
> **Constraints:** No analytics/logging of content; map `length` to word ranges above; language SV default with EN switch.

**Prompt to Codex**
```
You are editing a Nuxt 3 project. Create `server/api/story.post.ts`.

Requirements:
1) Parse JSON body with fields: prompt (string), language ('sv'|'en'), length ('short'|'medium'|'long'), tone (optional), readingLevel (optional), windDown (boolean).
2) Validate: prompt non-empty; language in set; length in set.
3) Map length to target word range: short 300-400, medium 500-700, long 900-1100.
4) Call a helper `generateStory(params)` from `@/lib/ai/generateStory`.
5) Return `{ id, text, meta: { language, length, wordTarget } }`.
6) Never log the prompt or story.
7) Handle errors with HTTP 400/500 and messages suitable for end users.

Also scaffold `@/lib/ai/generateStory.ts` with a `generateStory(params)` stub that uses Vercel AI SDK (provider-agnostic) and accepts `{ prompt, language, wordTarget, tone?, readingLevel?, windDown }`. Do not implement safety yet; just the call shape.
```

### B) Vercel AI SDK plumbing
```
Create `@/lib/ai/client.ts` that exports `ai` helpers using Vercel AI SDK.
- Provide a `generateText(options)` function that accepts system + user messages and a word target.
- Keep provider details configurable via runtime config.
- No direct console logging of content.
```

### C) IndexedDB utilities
```
Add `@/lib/db/stories.ts` with:
- `saveStory(record: { id: string; createdAt: string; text: string; meta: any })`
- `listStories(): Promise<Array<{ id; createdAt; title; meta }>>` (title = first line or first sentence)
- `getStory(id: string)`

Use `idb` or a minimal vanilla IndexedDB wrapper. No network calls here.
```

### D) Minimal UI (single prompt field)
```
Create `pages/index.vue` with:
- One large textarea for prompt.
- Language toggle (sv/en) default sv.
- Length radio group (short/medium/long) default medium.
- Generate button -> calls `/api/story` and streams or waits; show loading, error, then story.
- "Save automatically" (call db util after success).
- Links: "History" -> `pages/history.vue`; "Reading view" overlay with font size + night mode.

No extra dependencies. Keep styles minimal with CSS vars.
```

### E) History list page
```
Create `pages/history.vue`:
- On mount, load `listStories()`.
- Render title + date; click -> navigates to `/story/[id]`.
- Empty state friendly.
```

### F) Reading view
```
Create `pages/story/[id].vue`:
- Load from IndexedDB by id.
- Night mode toggle (html[data-theme="dark"]).
- Font size slider (persist to localStorage).
- Copy button.
```

### G) Safety hooks (thin, MVP)
```
Add `@/lib/ai/safety.ts`:
- `preModerate(prompt: string): 'ok' | { reason: string }`
- `postScan(text: string): 'ok' | { reason: string }`

For MVP: simple keyword lists for Swedish/English; do not log content.
Wire calls into `story.post.ts` before/after `generateStory`.
```

---

## 11) Error UX rules
- Errors must show **what to try next** (“Try a shorter prompt”, “Switch language”, “Retry in a moment”).
- If AI provider is unreachable, show a clear message; do **not** fallback to a dummy story.

---

## 12) i18n & UI copy
- **Default SV**, mirrored EN strings under a tiny local map (`/lib/ui/i18n.ts`) without pulling a heavy i18n lib for MVP.

---

## 13) Performance budget
- Keep main page JS under ~100 KB for MVP (avoid heavy deps).
- Use streaming if trivial with the chosen model; otherwise plain fetch is fine.

---

## 14) Refactor protocol
- If a function exceeds 40 LOC or mixes concerns, split into: `validate`, `mapWordTarget`, `invokeAI`, `shapeResponse`.
- Maintain single responsibility per module; keep “side-effects” isolated.

---

## 15) Quick scaffolds Codex may add on demand

**`/types/story.ts`**
```ts
export type StoryLength = 'short'|'medium'|'long';
export type Lang = 'sv'|'en';

export interface StoryMeta {
  language: Lang;
  length: StoryLength;
  wordTarget: { min: number; max: number };
  tone?: 'cozy'|'silly'|'adventurous'|'calm';
  readingLevel?: 'simple'|'normal';
  windDown?: boolean;
}

export interface StoryRecord {
  id: string;
  createdAt: string; // ISO
  text: string;
  meta: StoryMeta;
}
```

**`/lib/ai/wordTargets.ts`**
```ts
import type { StoryLength } from '@/types/story';

export function wordTargetFor(length: StoryLength) {
  switch (length) {
    case 'short': return { min: 300, max: 400 };
    case 'medium': return { min: 500, max: 700 };
    case 'long': return { min: 900, max: 1100 };
  }
}
```
