
# Codex_RUNBOOK.md — DreamTales (Complete)

This runbook contains:
1) The **Meta Guardrail** (always start here).  
2) All build steps in order with **full Codex prompts** (copy/paste).  
3) A **parallelization plan** to avoid conflicts.  

> Repo docs referenced: **AI_CODER_RULES.md** and **PRD.md**.

---

## 0) Meta Guardrail (pin this at the start of every Codex session)
```
Role: Senior Nuxt 3 + TS engineer.

Always read and obey:
- AI_CODER_RULES.md
- PRD.md

Hard constraints (MVP):
- Nuxt 3 PWA with server routes (no separate backend).
- IndexedDB for story history; localStorage only for light UI prefs.
- Vercel AI SDK (provider-agnostic; runtime-configurable).
- Lengths: short 300–400, medium 500–700, long 900–1100 words.
- Language: sv-SE default, en toggle in UI.
- Safety: preModerate + postScan; auto-regenerate once if unsafe.
- No analytics; never log prompts/stories to server logs.
- TS strict; explicit return types; ≤40 LOC per function when possible.
- Atomic diffs; Conventional Commits.

Execution:
- Return file diffs with filenames + brief reasons.
- Do not add new deps or change public APIs without asking first.
```

---

## 1) Build steps (ordered) with full Codex prompts

> Each step is **one task per prompt**. Paste into Codex verbatim.

### Step 1 — Repo setup
```
You are creating a new Nuxt 3 + TypeScript project named "dreamtales".

Tasks:
1) Scaffold project and enable TypeScript strict mode.
2) Add ESLint + Prettier with sensible defaults and fix-on-save.
3) Add files:
   - LICENSE (MIT)
   - README.md (what it is, how to run, MVP scope)
   - CONTRIBUTING.md (include Conventional Commits + one-task-per-PR rules)
   - .editorconfig
   - .nvmrc (latest LTS)
4) Create folders per AI_CODER_RULES.md:
   /server/api, /lib/ai, /lib/db, /lib/ui, /types, /pages, /styles, /prompts
5) Do NOT add tests. No analytics.

Output: commands to run, and atomic file diffs with reasons.
```

### Step 2 — Runtime config
```
Add runtime config in Nuxt for AI provider:

Files to add/edit:
- nuxt.config.ts: runtimeConfig with { ai: { provider: '', apiKey: '' } } and public: { appName: 'DreamTales' }
- .env.example with AI_PROVIDER and AI_API_KEY

Rules:
- Never hard-code keys.
- Document variables in README under "Miljövariabler & körning".

Return diffs for updated files.
```

### Step 3 — AI client
```
Create `/lib/ai/client.ts` exporting:
- generateText(options: { system: string; user: string; target: { min: number; max: number } }): Promise<string>

Requirements:
- Use Vercel AI SDK (provider-agnostic).
- Read provider + key from runtime config.
- No logging of prompts or completions.
- Keep function ≤40 LOC, explicit return type.
Provide code + a 10–20 line usage example text for the PR description.
```

### Step 4 — Types
```
Create `/types/story.ts`:

Export:
- export type StoryLength = 'short'|'medium'|'long'
- export type Lang = 'sv'|'en'
- export interface StoryMeta { language: Lang; length: StoryLength; wordTarget: { min:number; max:number }; tone?: 'cozy'|'silly'|'adventurous'|'calm'; readingLevel?: 'simple'|'normal'; windDown?: boolean }
- export interface StoryRecord { id: string; createdAt: string; text: string; meta: StoryMeta }

Also add `/lib/ai/wordTargets.ts` with:
\`\`\`
import type { StoryLength } from '@/types/story';
export function wordTargetFor(length: StoryLength){
  switch(length){
    case 'short': return {min:300,max:400};
    case 'medium': return {min:500,max:700};
    case 'long': return {min:900,max:1100};
  }
}
\`\`\`

Return diffs.
```

### Step 5 — Safety hooks
```
Create `/lib/ai/safety.ts` with:
- preModerate(prompt: string, lang: 'sv'|'en'): 'ok' | { reason: string }
- postScan(text: string, lang: 'sv'|'en'): 'ok' | { reason: string }
- tightenSystemPrompt(base: string): string  // increase safety mildly for one retry

Implementation:
- Minimal keyword/regex lists for sv/en covering violence, gore, adult topics, slurs.
- No logging of content.
- ≤40 LOC per function, explicit return types.

Return diffs.
```

### Step 6 — Story generator
```
Create `/lib/ai/generateStory.ts` exporting:
- generateStory(params: {
    prompt: string;
    language: 'sv'|'en';
    wordTarget: {min:number;max:number};
    tone?: string;
    readingLevel?: 'simple'|'normal';
    windDown?: boolean;
    systemOverride?: string; // optional stricter system prompt on retry
  }): Promise<string>

Behavior:
- Build a system prompt enforcing: age 4–8, gentle pacing, short paragraphs, safe content, target words within range, strict language (sv or en), optional tone, reading level (simpler vocabulary if 'simple'), and a calm goodnight ending (sv: "Godnatt …", en: "Good night …").
- Compose messages (system + user) → call generateText() from /lib/ai/client.
- Return only the story text (string).
- No logs.

Return file diff and a 10–20 line usage example for PR description.
```

### Step 7 — API endpoint
```
Create `server/api/story.post.ts`:

Flow:
1) Parse JSON body:
   {
     prompt: string;
     language: 'sv'|'en';
     length: 'short'|'medium'|'long';
     tone?: string;
     readingLevel?: 'simple'|'normal';
     windDown?: boolean;
     childNames?: string;
     theme?: string;
   }
2) Validate required fields; map length -> wordTarget via wordTargetFor.
3) Run preModerate(prompt, language). If not ok → return 400 with friendly message.
4) Build generation params; include tone/readingLevel/windDown; pass language; pass wordTarget.
   - If childNames/theme present, append to the user prompt contextually.
5) Call generateStory(params).
6) Run postScan(text, language). If fail → retry once using systemOverride = tightenSystemPrompt(baseSystem); if still fails → 400 with friendly message.
7) Shape response:
   {
     id: crypto.randomUUID(),
     text,
     meta: { language, length, wordTarget, tone, readingLevel, windDown }
   }
8) Never log prompt or story.
9) Proper 400/500 messages with guidance (“Prova kortare prompt”, “Byt språk”, “Försök igen om en stund”).

Return diffs for new files.
```

### Step 8 — IndexedDB utils
```
Create `/lib/db/stories.ts` with:
- saveStory(record: StoryRecord): Promise<void>
- listStories(): Promise<Array<{ id: string; createdAt: string; title: string; meta: StoryMeta }>>  // title = first line or first sentence of record.text
- getStory(id: string): Promise<StoryRecord | null>

Notes:
- Use 'idb' or minimal vanilla IndexedDB. No network calls.
- Keep each function ≤40 LOC; explicit return types.

Return diffs.
```

### Step 9 — UI i18n
```
Create `/lib/ui/i18n.ts` exporting:
- t(locale: 'sv'|'en', key: string): string
- In-memory maps for labels/buttons/messages; sv as default, en mirror.
Optionally add a `useI18n()` composable that exposes `locale` + `t`.
No heavy i18n library.

Return diffs.
```

### Step 10 — UI index page
```
Create `pages/index.vue` (script setup TS). Requirements:
- Controls:
  - Textarea "Berätta om…"
  - Radio group length (Kort/Medel/Lång; default Medel)
  - Language toggle (Svenska/Engelska; default sv)
  - Inputs: child names, theme, tone, reading level (enkel/normal), wind-down toggle
- Generate button with loading state "Skapar saga…".
- On submit: POST /api/story, handle success/error; show friendly errors with hints.
- On success: auto-save via /lib/db/stories.saveStory and navigate to reading view or show inline result with copy.
- Links: "Historik" -> /history
- Accessibility: labels, aria-live for status.
- No extra UI deps; simple CSS vars.

Return diff.
```

### Step 11 — UI history page
```
Create `pages/history.vue`:
- On mount: listStories().
- Render list: title + date; empty state text.
- Click → navigate to /story/[id].

Return diff.
```

### Step 12 — UI reading view
```
Create `pages/story/[id].vue`:
- Load story by id via getStory.
- Auto-title (first line/first sentence) if needed.
- Night mode toggle (toggle html[data-theme="dark"]).
- Font-size slider; persist to localStorage.
- "Kopiera sagan" button using Clipboard API.

Return diff.
```

### Step 13 — Offline + PWA
```
Add minimal PWA:
- app/manifest.webmanifest with name "DreamTales".
- Register a basic service worker that caches the app shell (do not attempt to sync stories; they live in IndexedDB).
- If navigator.onLine === false on the index page: disable Generate and show a translated message ("Anslut för att skapa berättelser" / "Connect to generate").

Return diffs + README note on installability.
```

### Step 14 — Performance & polish
```
Add a "Performance" section to README with steps:
- Measure story generation times for S/M/L (targets: ≤15s/≤30s/≤60s).
- Keep main page JS ≤ ~100KB: avoid heavy deps; lazy-import if needed.
- Quick pass: remove dead code; ensure key functions ≤40 LOC; explicit return types.

Provide any tiny refactors as separate atomic diffs if needed.
```

---

## 2) What can run in parallel (low-conflict)

- **Stream A: Server/AI**
  - Step 2 Runtime config
  - Step 3 AI client
  - Step 5 Safety hooks
  - Step 6 Story generator
  - Step 7 API endpoint  
  *(#3 and #5 can run in parallel; #7 depends on #3 + #6 + #5 + types from #4.)*

- **Stream B: Data layer**
  - Step 4 Types
  - Step 8 IndexedDB utils  
  *(Independent of Stream A; only relies on types.)*

- **Stream C: UI**
  - Step 9 UI i18n
  - Step 10 Index page
  - Step 11 History page
  - Step 12 Reading view  
  *(#9 can start immediately. #10 can stub API until #7 lands. #11/#12 need #8.)*

- **Stream D: PWA & Perf**
  - Step 13 Offline + PWA
  - Step 14 Performance & polish  
  *(Begin once UI skeleton exists.)*

### Minimal dependency edges
- Step 7 → requires 3, 5, 6, and 4.
- Step 10 benefits from 7 (can stub temporarily).
- Step 11/12 → require 8.
- Step 13 → follows 10–12.

**Suggested assignment (4 contributors):**
- Dev 1: Steps 2, 3, 6, 7
- Dev 2: Steps 4, 8
- Dev 3: Steps 9, 10
- Dev 4: Steps 11, 12, 13, 14
