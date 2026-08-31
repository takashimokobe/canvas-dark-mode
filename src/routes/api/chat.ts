import {
  chat,
  chatParamsFromRequest,
  toServerSentEventsResponse,
} from '@tanstack/ai'
import { createOpenaiChat } from '@tanstack/ai-openai'
import { webSearchTool } from '@tanstack/ai-openai/tools'
import { createFileRoute } from '@tanstack/react-router'

import {
  CANVAS_CHAT_SYSTEM_PROMPT,
  THINK_LONGER_SYSTEM_PROMPT,
} from '@/lib/chat/systemPrompts'

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.OPEN_API_KEY
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: 'OPEN_API_KEY is not configured' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }

        try {
          const { messages, forwardedProps } =
            await chatParamsFromRequest(request)
          const searchWeb = forwardedProps.searchWeb === true
          const thinkLonger = forwardedProps.thinkLonger === true
          const systemPrompts = [CANVAS_CHAT_SYSTEM_PROMPT]
          if (thinkLonger) {
            systemPrompts.push(THINK_LONGER_SYSTEM_PROMPT)
          }

          const stream = chat({
            adapter: createOpenaiChat('gpt-4o-mini', apiKey),
            messages,
            systemPrompts,
            ...(searchWeb
              ? { tools: [webSearchTool({ type: 'web_search' })] }
              : {}),
          })

          return toServerSentEventsResponse(stream)
        } catch (error) {
          if (error instanceof Response) {
            return error
          }

          return new Response(
            JSON.stringify({
              error:
                error instanceof Error ? error.message : 'An error occurred',
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }
      },
    },
  },
})
