import type { UIMessage } from '@tanstack/ai-react'

/** Concatenate streamed `text` parts from a TanStack AI UI message. */
export function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is Extract<typeof part, { type: 'text' }> => {
      return part.type === 'text'
    })
    .map((part) => part.content)
    .join('')
}
