import { useCallback, useRef } from 'react'
import { useChat } from '@tanstack/ai-react'
import type { ContentPart } from '@tanstack/ai'

import { chatConnection } from '@/lib/chat/connection'
import type { ChatRequestFlags } from '@/lib/chat/send'

const DEFAULT_FLAGS: ChatRequestFlags = {
  searchWeb: false,
  thinkLonger: false,
}

type SendContent = string | { content: string | Array<ContentPart> }

/** TanStack AI chat state for the conversation. */
export function useConversation() {
  const flags = useRef<ChatRequestFlags>({ ...DEFAULT_FLAGS })
  const chat = useChat({
    connection: chatConnection,
    forwardedProps: flags.current,
  })

  const sendMessage = useCallback(
    async (content: SendContent, next: ChatRequestFlags = DEFAULT_FLAGS) => {
      flags.current.searchWeb = next.searchWeb
      flags.current.thinkLonger = next.thinkLonger
      try {
        await chat.sendMessage(content)
      } finally {
        flags.current.searchWeb = false
        flags.current.thinkLonger = false
      }
    },
    [chat],
  )

  return { ...chat, sendMessage }
}
