/** A prior bubble attached to the composer as extra context. */
export interface MessageContext {
  id: string
  role: 'user' | 'assistant'
  text: string
}

export function contextChipLabel(item: MessageContext) {
  switch (item.role) {
    case 'assistant':
      return `Assistant: ${item.text}`
    case 'user':
      return `You: ${item.text}`
    default: {
      const _exhaustive: never = item.role
      return _exhaustive
    }
  }
}

function excerptLabel(item: MessageContext) {
  switch (item.role) {
    case 'assistant':
      return `Quoted from the assistant:\n${item.text}`
    case 'user':
      return `Quoted from your message:\n${item.text}`
    default: {
      const _exhaustive: never = item.role
      return _exhaustive
    }
  }
}

/** Prefix quoted bubbles onto the outgoing user message. */
export function composeMessageWithContext(
  text: string,
  contexts: readonly MessageContext[],
) {
  if (contexts.length === 0) {
    return text
  }

  const excerpts = contexts.map((item) => excerptLabel(item)).join('\n\n')

  return `The following excerpts are attached as context for this question.\n\n${excerpts}\n\nQuestion:\n${text}`
}
