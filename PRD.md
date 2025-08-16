# PRD/FRD – DreamTales MVP

## 1. Overview & Background
DreamTales is a web-based application (PWA) that allows parents—and optionally older children—to quickly create rich, age-appropriate bedtime stories using LLM-generated text. The goal is to turn vague story requests into engaging, safe, and enjoyable narratives without requiring the user to write detailed scripts.

**Primary audience:** Parents (secondary: older children comfortable with a simple interface)  
**Default age range:** 4–8 years  
**Initial deployment:** Local/LAN or cloud-based via provider-agnostic AI SDK (e.g., Vercel AI npm package).  

---

## 2. Goals & Success Metrics

### Goals
- Provide a fast, simple way to generate bedtime stories from minimal prompts.
- Ensure stories are safe, age-appropriate, and engaging.
- Allow local storage and retrieval of stories without requiring user accounts.
- Enable both cloud-hosted and LAN/local model execution.

### Success Metrics (MVP)
1. Long story generated in ≤60 seconds.  
2. Repeat use within 7 days by the same family.  
3. Positive kid approval (“thumbs-up” test).

---

## 3. User Stories & Use Cases

### User Stories
- *As a parent*, I want to quickly type a vague idea and get a long, engaging bedtime story so I can keep my child entertained before sleep.
- *As a parent*, I want stories to be safe for my 4–8-year-old so I don’t have to manually filter content.
- *As a user*, I want to save stories automatically so I can revisit favorites later.
- *As a parent*, I want to choose between short, medium, or long stories without worrying about exact time lengths.
- *As a bilingual family*, I want to switch between Swedish and English so my kids can enjoy stories in both languages.

### Use Cases
1. **Quick prompt story creation**
   - User enters a short prompt → chooses length → sets options (name, theme, tone, language, reading level, wind-down) → receives story.
2. **Reading saved stories offline**
   - User opens app → selects from history → reads without internet.
3. **Copy story to share manually**
   - After generation or from history, user taps "Copy" → text is in clipboard.

---

## 4. Functional Requirements

### 4.1 Story Creation Screen
- **Inputs:**
  - Prompt text field
  - Length slider (short / medium / long)
  - Language switch (SV/EN)
  - Child name(s) text input
  - Theme presets dropdown/list
  - Tone/style selector (silly, cozy, adventurous…)
  - Reading level toggle (simple / normal)
  - “Wind-down” ending toggle
- **Behavior:**
  - Defaults: Language = SV, Length = Medium, Tone = Cozy
  - Length slider maps to token limits (approx. short = 300–400 words, medium = 500–700, long = 900–1100)
  - All settings persist locally between sessions

### 4.2 Generation
- Uses provider-agnostic AI SDK
- Supports:
  - Cloud API (e.g., OpenAI) via Nuxt server route proxy
  - Local/LAN LLM server (e.g., Ollama)
- Guardrails:
  - System prompt enforcing safe content for ages 4–8
  - Pre-generation prompt moderation (keyword/regex)
  - Post-generation output scan (regex + keyword lists)
  - Auto-regenerate if safety fails

### 4.3 Reading View
- Simple scrollable layout
- Adjustable font size
- Night mode toggle
- Title auto-generated from story content (first line or summary)

### 4.4 Story History
- Stored in IndexedDB
- Auto-save after each generation
- Shows list: title + date
- Click to read
- No renaming/editing in MVP

### 4.5 Post-Generation Actions
- In-app reading
- One-click copy
- Auto-save to history

---

## 5. Non-Functional Requirements
- **Performance Targets:**
  - Short: ≤15s
  - Medium: ≤30s
  - Long: ≤60s
- **Offline Behavior:**
  - Read saved stories & draft prompts offline
  - Generation requires connectivity unless pointed to local LAN LLM
- **Platform:**
  - Web application, installable as PWA
  - Frontend: Nuxt (Vue)
  - Backend: Nuxt server functions
- **Storage:** IndexedDB for local persistence
- **No analytics** in MVP
- **No server logging** of story/prompt data unless running locally

---

## 6. Dependencies & Risks

### Dependencies
- Nuxt framework with server routes
- IndexedDB API
- Provider-agnostic AI SDK (e.g., @vercel/ai)
- LLM provider (OpenAI or local model server)
- Basic moderation lists for Swedish & English

### Risks
- LLM may still produce borderline content despite guardrails
- Performance variance depending on LLM provider/model
- IndexedDB space limitations for long-term storage

---

## 7. Acceptance Criteria
- ✅ User can generate a story by entering a prompt and adjusting settings.
- ✅ Generated stories meet age-appropriateness rules without manual edits.
- ✅ Long story generated within 60s in typical network conditions.
- ✅ Stories auto-save and can be reopened from history.
- ✅ App works offline for reading saved stories and drafting prompts.
- ✅ Adjustable font size and night mode work in reading view.

---

## 8. Appendix – Mermaid Screen Flow Diagram

```mermaid
flowchart TD
  %% Pages / States
  A[App Launch / PWA] --> B{Online?}
  B -- Yes --> C[Story Creation]
  B -- No --> H[Offline Mode]

  %% Story Creation
  C --> C1[Enter prompt]
  C --> C2[Length slider (S/M/L)]
  C --> C3[Language (SV/EN)]
  C --> C4[Child name(s)]
  C --> C5[Theme preset]
  C --> C6[Tone/style]
  C --> C7[Reading level (simple/normal)]
  C --> C8["Wind-down" toggle]
  C --> D[Generate]

  %% Pre-generation checks
  D --> E{Pre-gen moderation passes?}
  E -- No --> C9[Suggest rephrase / auto-sanitize]
  C9 --> D
  E -- Yes --> F[LLM request via Nuxt server]

  %% Provider path (abstracted)
  F --> F1{Provider}
  F1 -- Cloud API --> G[Call provider]
  F1 -- Local LAN --> G2[Call local model]

  %% Post-generation
  G --> I{Post-gen safety OK?}
  G2 --> I
  I -- No --> D2[Auto-regenerate with stricter prompt] --> D
  I -- Yes --> J[Assemble story + auto-title]
  J --> K[Auto-save to IndexedDB]
  K --> L[Reading View]

  %% Reading view features
  L --> L1[Night mode toggle]
  L --> L2[Adjust font size]
  L --> L3[Copy to clipboard]
  L --> M[Back]
  M --> C

  %% History
  A --> N[History List (local)]
  K --> N
  N --> O[Open saved story] --> L

  %% Offline branch
  H --> N
  H --> C10[Draft prompt (disabled Generate)]
  C10 --> P[Show "Connect to generate"]

  %% Errors
  G -->|Timeout/Error| Q[Show error + Retry]
  G2 -->|Timeout/Error| Q
  Q --> D
```
