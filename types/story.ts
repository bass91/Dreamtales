export type StoryLength = 'short' | 'medium' | 'long'
export type Lang = 'sv' | 'en'

export interface StoryMeta {
  language: Lang
  length: StoryLength
  wordTarget: { min: number; max: number }
  tone?: 'cozy' | 'silly' | 'adventurous' | 'calm'
  readingLevel?: 'simple' | 'normal'
  windDown?: boolean
}

export interface StoryRecord {
  id: string
  createdAt: string
  text: string
  meta: StoryMeta
}
