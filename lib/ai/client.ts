import { generateText as aiGenerateText, type Message } from 'ai'
import { useRuntimeConfig } from '#imports'

interface GenerateTextOptions {
  system: string
  user: string
  target: { min: number; max: number }
}

export async function generateText({ system, user, target }: GenerateTextOptions): Promise<string> {
  const { provider, apiKey } = useRuntimeConfig().ai
  const [vendor, model] = provider.split(':')

  const messages: Message[] = [
    { role: 'system', content: `${system}\nWrite between ${target.min} and ${target.max} words.` },
    { role: 'user', content: user },
  ]

  let selectedModel
  if (vendor === 'openai') {
    const { openai } = await import('@ai-sdk/openai')
    selectedModel = openai({ apiKey })(model)
  } else {
    throw new Error(`Unsupported provider: ${vendor}`)
  }

  const { text } = await aiGenerateText({ model: selectedModel, messages })
  return text
}
