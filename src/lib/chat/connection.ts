import { fetchServerSentEvents } from '@tanstack/ai-react'

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')

/** Chat API path, respecting the Vite `base` (e.g. `/canvas-dark-mode/api/chat`). */
export const CHAT_API_URL = `${basePath}/api/chat`

/** SSE connection for {@link useConversation}. */
export const chatConnection = fetchServerSentEvents(CHAT_API_URL)
