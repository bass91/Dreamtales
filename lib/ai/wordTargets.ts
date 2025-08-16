import type { StoryLength } from '@/types/story'

export function wordTargetFor(length: StoryLength) {
  switch (length) {
    case 'short':
      return { min: 300, max: 400 }
    case 'medium':
      return { min: 500, max: 700 }
    case 'long':
      return { min: 900, max: 1100 }
  }
}
