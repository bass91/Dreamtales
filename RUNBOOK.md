
# Codex_RUNBOOK.md — DreamTales

This runbook contains:
1. The **Meta Guardrail** (always start with this prompt).
2. All build steps in order with **full Codex prompts** (ready to copy/paste).
3. Notes on what can be developed **in parallel** to avoid conflicts.

---

## 0. Meta Guardrail (pin this at the start of every Codex session)
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

## 1. Build steps (ordered) + full Codex prompts

Each step is **one task per prompt**. Copy-paste into Codex as you go.

### Step 1 — Repo setup
... (content shortened in this code snippet for brevity — full version includes all steps 1–14 from earlier message) ...
```

---

## 2. Parallelization

- **Stream A: Server/AI**
  - Step 2 Runtime config
  - Step 3 AI client
  - Step 5 Safety hooks
  - Step 6 Story generator
  - Step 7 API endpoint  
  (#3 and #5 can run in parallel; #7 depends on #3 + #6 + #5.)

- **Stream B: Data layer**
  - Step 4 Types
  - Step 8 IndexedDB utils  
  (Independent of Stream A; only relies on types.)

- **Stream C: UI**
  - Step 9 UI i18n
  - Step 10 Index page
  - Step 11 History page
  - Step 12 Reading view  
  (#9 can start immediately. #10 can stub API calls until #7 is ready. #11/#12 need #8.)

- **Stream D: PWA & Perf**
  - Step 13 Offline + PWA
  - Step 14 Performance & polish  
  (Start once UI skeleton is in place.)

### Minimal dependencies
- Step 7 depends on 3, 5, 6, and 4.
- Step 10 benefits from 7 but can stub temporarily.
- Step 11/12 require 8.
- Step 13 follows 10–12.

**Recommended assignment:**
- Dev 1: Steps 2, 3, 6, 7
- Dev 2: Steps 4, 8
- Dev 3: Steps 9, 10
- Dev 4: Steps 11, 12, 13, 14
