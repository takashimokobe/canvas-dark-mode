export const COMPOSER_PROMPTS = {
  'prompt-tokens': {
    label: 'Explain these tokens',
    text: 'Explain how these color tokens work in light and dark.',
  },
  'prompt-contrast': {
    label: 'Review this contrast',
    text: 'Check this UI for contrast issues in light and dark.',
  },
} as const

export type PromptId = keyof typeof COMPOSER_PROMPTS
