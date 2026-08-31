import { ClientOnly, createFileRoute } from '@tanstack/react-router'

import { Conversation, ConversationFallback } from '@/components/Conversation'
import { PageShell } from '@/components/PageChrome'

import styles from './chat.module.css'

export const Route = createFileRoute('/chat')({
  head: () => ({
    meta: [{ title: 'Chat · Canvas Dark Mode' }],
  }),
  component: ChatRoute,
})

function ChatRoute() {
  return (
    <PageShell className={styles.Page}>
      <ClientOnly fallback={<ConversationFallback />}>
        <Conversation />
      </ClientOnly>
    </PageShell>
  )
}
