import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode, Ref } from 'react'
import { SecondaryButton } from '@workday/canvas-kit-react/button'

import { ChatInput } from '@/components/ChatInput'
import { Message } from '@/components/Message'
import { getMessageText } from '@/lib/chat/messageText'
import { COMPOSER_PROMPTS } from '@/lib/chat/prompts'
import { composeSendContent, flagsFromTools } from '@/lib/chat/send'
import type { ChatSendPayload } from '@/lib/chat/send'
import type { MessageContext } from '@/lib/chat/composeContext'

import styles from './Conversation.module.css'
import { useConversation } from './useConversation'

/** Stick to the latest turn when the user is already this close to the bottom. */
const NEAR_BOTTOM_THRESHOLD_PX = 80

function ConversationLayout({
  overflowing = false,
  messagesRef,
  messages,
  composer,
}: {
  overflowing?: boolean
  messagesRef?: Ref<HTMLDivElement>
  messages: ReactNode
  composer: ReactNode
}) {
  const stageRef = useRef<HTMLElement>(null)
  const composerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const stage = stageRef.current
    const dock = composerRef.current
    if (!stage || !dock) {
      return
    }

    const syncComposerSpace = () => {
      stage.style.setProperty('--composer-space', `${dock.offsetHeight}px`)
    }

    syncComposerSpace()
    const observer = new ResizeObserver(syncComposerSpace)
    observer.observe(dock)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={stageRef} className={styles.Conversation}>
      <h1 className="visually-hidden">Chat</h1>
      <div
        ref={messagesRef}
        className={styles.Messages}
        data-overflow={overflowing || undefined}
        role="log"
        aria-relevant="additions text"
      >
        <div className={styles.Fade} aria-hidden />
        <div className={styles.List}>{messages}</div>
      </div>
      <div ref={composerRef} className={styles.Composer}>
        {composer}
      </div>
    </section>
  )
}

/** Docked chat chrome for the SSR/hydration placeholder. */
export function ConversationFallback() {
  return (
    <ConversationLayout
      messages={null}
      composer={<ChatInput disabled onSend={() => undefined} />}
    />
  )
}

export function Conversation() {
  const messagesRef = useRef<HTMLDivElement>(null)
  const { messages, sendMessage, isLoading, error, stop } = useConversation()
  const [contexts, setContexts] = useState<MessageContext[]>([])
  const [overflowing, setOverflowing] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  useEffect(() => {
    const node = messagesRef.current
    if (!node) {
      return
    }

    const syncOverflow = () => {
      setOverflowing(node.scrollTop > 1)
    }

    const stickToBottom = () => {
      const distance = node.scrollHeight - node.scrollTop - node.clientHeight
      if (distance < NEAR_BOTTOM_THRESHOLD_PX) {
        node.scrollTop = node.scrollHeight
      }
      syncOverflow()
    }

    stickToBottom()
    const observer = new ResizeObserver(stickToBottom)
    observer.observe(node)
    const list = node.lastElementChild
    if (list) {
      observer.observe(list)
    }
    node.addEventListener('scroll', syncOverflow, { passive: true })
    return () => {
      observer.disconnect()
      node.removeEventListener('scroll', syncOverflow)
    }
  }, [messages, isLoading])

  const toggleContext = (item: MessageContext) => {
    setContexts((current) => {
      if (current.some((entry) => entry.id === item.id)) {
        return current.filter((entry) => entry.id !== item.id)
      }
      return [...current, item]
    })
  }

  const handleSend = (payload: ChatSendPayload) => {
    setSendError(null)
    void composeSendContent(payload)
      .then((content) => sendMessage(content, flagsFromTools(payload.tools)))
      .catch((cause: unknown) => {
        setSendError(
          cause instanceof Error
            ? cause.message
            : 'Could not send that attachment.',
        )
      })
    setContexts([])
  }

  const empty = messages.length === 0
  const lastAssistantId = [...messages]
    .reverse()
    .find((message) => message.role === 'assistant')?.id
  const lastUserText = [...messages]
    .reverse()
    .find((message) => message.role === 'user')

  const regenerate = () => {
    const priorText = lastUserText ? getMessageText(lastUserText) : ''
    if (priorText) {
      void sendMessage(priorText)
    }
  }

  return (
    <ConversationLayout
      overflowing={overflowing}
      messagesRef={messagesRef}
      messages={
        empty ? (
          <EmptyState
            onPrompt={(text) =>
              handleSend({
                text,
                attachments: [],
                tools: [],
                contexts,
              })
            }
          />
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              inContext={contexts.some((item) => item.id === message.id)}
              streaming={
                isLoading &&
                message.role === 'assistant' &&
                message.id === lastAssistantId
              }
              onToggleContext={toggleContext}
              onRegenerate={
                !isLoading && message.id === lastAssistantId
                  ? regenerate
                  : undefined
              }
            />
          ))
        )
      }
      composer={
        <ChatInput
          isLoading={isLoading}
          contexts={contexts}
          onRemoveContext={(id) =>
            setContexts((current) => current.filter((item) => item.id !== id))
          }
          onSend={handleSend}
          onStop={stop}
          error={sendError ?? error?.message ?? null}
        />
      }
    />
  )
}

function EmptyState({ onPrompt }: { onPrompt: (text: string) => void }) {
  return (
    <div className={styles.Empty}>
      <p className={styles.EmptyLead}>
        Ask about Canvas semantic tokens, light and dark pairing, and contrast.
      </p>
      <div className={styles.EmptyActions}>
        {Object.entries(COMPOSER_PROMPTS).map(([id, prompt]) => (
          <SecondaryButton
            key={id}
            type="button"
            size="small"
            onClick={() => onPrompt(prompt.text)}
          >
            {prompt.label}
          </SecondaryButton>
        ))}
      </div>
    </div>
  )
}
