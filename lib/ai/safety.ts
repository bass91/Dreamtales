type Lang = 'sv' | 'en'

type SafetyResult = 'ok' | { reason: string }

const patterns: Record<Lang, RegExp[]> = {
  sv: [
    /\bdöda/i,
    /\bblod/i,
    /\bmord/i,
    /\bsex/i,
    /\bporr/i,
    /\bnaken/i,
    /\bjävla/i,
    /\bhora/i,
    /\bbög/i,
    /\bneger/i,
  ],
  en: [
    /\bkill/i,
    /\bblood/i,
    /\bgore/i,
    /\bmurder/i,
    /\bsex/i,
    /\bporn/i,
    /\bnude/i,
    /\bfuck/i,
    /\bshit/i,
    /\bbitch/i,
    /\bnigger/i,
    /\bfaggot/i,
  ],
}

function scan(text: string, lang: Lang): SafetyResult {
  const lower = text.toLowerCase()
  for (const re of patterns[lang]) {
    if (re.test(lower)) return { reason: 'contains disallowed content' }
  }
  return 'ok'
}

/** Pre-check user prompt for obvious unsafe content */
export function preModerate(prompt: string, lang: Lang): SafetyResult {
  return scan(prompt, lang)
}

/** Scan generated text for unsafe content */
export function postScan(text: string, lang: Lang): SafetyResult {
  return scan(text, lang)
}

/** Slightly tighten the system prompt for a safety retry */
export function tightenSystemPrompt(base: string): string {
  return `${base}\nEnsure the story is gentle and free of violence, gore, adult themes, or slurs.`
}
