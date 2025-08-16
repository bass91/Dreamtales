# DreamTales

Nuxt 3 PWA for generating safe bedtime stories.

## Setup

```bash
npm install
```

## Environment variables & running 

Create a `.env` file in the project root:

```bash
AI_PROVIDER=<provider name>
AI_API_KEY=<your API key>
```

Run the development server:

```bash
npm run dev
```

## MVP scope

- Nuxt 3 PWA with server routes only
- IndexedDB for story history; localStorage for UI prefs
- Vercel AI SDK (provider-agnostic, runtime-configurable)
- Word count presets: short 300–400, medium 500–700, long 900–1100
- Default language sv-SE with English toggle
- Safety: preModerate + postScan; auto-regenerate once if unsafe
- No analytics; never log prompts or stories to server logs
