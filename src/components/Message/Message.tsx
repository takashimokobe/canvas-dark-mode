import { TertiaryButton } from '@workday/canvas-kit-react/button'
import type { UIMessage } from '@tanstack/ai-react'

import { Bubble } from '@/components/Bubble'
import { Response, ResponseActions } from '@/components/Response'
import { getMessageText } from '@/lib/chat/messageText'
import type { MessageContext } from '@/lib/chat/composeContext'
import { cn } from '@/lib/utils/mergeClasses'

import styles from './Message.module.css'

type MessageSender = MessageContext['role']

export interface MessageProps {
  message: UIMessage
  inContext: boolean
  streaming: boolean
  onToggleContext: (item: MessageContext) => void
  onRegenerate?: () => void
}

export function Message({
  message,
  inContext,
  streaming,
  onToggleContext,
  onRegenerate,
}: MessageProps) {
  const text = getMessageText(message)
  if (!text) {
    return null
  }

  const sender: MessageSender =
    message.role === 'assistant' ? 'assistant' : 'user'
  const rowClass = sender === 'user' ? styles.RowUser : styles.RowAssistant
  const messageClass =
    sender === 'user' ? styles.MessageUser : styles.MessageAssistant

  let body
  switch (sender) {
    case 'assistant':
      body = <Response text={text} />
      break
    case 'user':
      body = <Bubble>{text}</Bubble>
      break
    default: {
      const _exhaustive: never = sender
      return _exhaustive
    }
  }

  return (
    <div className={cn(styles.Row, rowClass)}>
      <article className={cn(styles.Content, messageClass)}>
        {body}
        {streaming ? null : sender === 'assistant' ? (
          <ResponseActions
            text={text}
            inContext={inContext}
            onToggleContext={() =>
              onToggleContext({
                id: message.id,
                role: sender,
                text,
              })
            }
            onRegenerate={onRegenerate}
          />
        ) : (
          <div className={styles.Actions}>
            <TertiaryButton
              type="button"
              size="extraSmall"
              aria-pressed={inContext}
              onClick={() =>
                onToggleContext({
                  id: message.id,
                  role: sender,
                  text,
                })
              }
            >
              {inContext ? 'Remove from context' : 'Add as context'}
            </TertiaryButton>
          </div>
        )}
      </article>
    </div>
  )
}
