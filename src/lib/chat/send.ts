import type { ContentPart } from '@tanstack/ai'

import { composeMessageWithContext } from './composeContext'
import type { MessageContext } from './composeContext'

export const COMPOSER_TOOLS = ['search-web', 'think-longer'] as const
export type ComposerTool = (typeof COMPOSER_TOOLS)[number]

/** Soft cap so image payloads stay within a few megabytes. */
export const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024

export type ChatSendPayload = {
  text: string
  attachments: File[]
  tools: ReadonlyArray<ComposerTool>
  contexts: MessageContext[]
}

export type ChatRequestFlags = {
  searchWeb: boolean
  thinkLonger: boolean
}

export function flagsFromTools(
  tools: ReadonlyArray<ComposerTool>,
): ChatRequestFlags {
  return {
    searchWeb: tools.includes('search-web'),
    thinkLonger: tools.includes('think-longer'),
  }
}

export function attachmentError(file: File) {
  if (file.size > MAX_ATTACHMENT_BYTES) {
    return `${file.name} is too large. Attach files under 4 MB.`
  }

  return null
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isMarkdownFile(file: File) {
  if (file.type === 'text/markdown' || file.type === 'text/x-markdown') {
    return true
  }

  const name = file.name.toLowerCase()
  return name.endsWith('.md') || name.endsWith('.markdown')
}

function isReadableTextFile(file: File) {
  return file.type.startsWith('text/') || isMarkdownFile(file)
}

function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error(`Could not read ${file.name}.`))
        return
      }

      const comma = result.indexOf(',')
      resolve(comma === -1 ? result : result.slice(comma + 1))
    }
    reader.onerror = () => {
      reject(reader.error ?? new Error(`Could not read ${file.name}.`))
    }
    reader.readAsDataURL(file)
  })
}

type AttachmentParts = {
  images: ContentPart[]
  notes: string[]
}

async function partsFromAttachment(file: File): Promise<AttachmentParts> {
  const error = attachmentError(file)
  if (error) {
    throw new Error(error)
  }

  if (file.type.startsWith('image/')) {
    const value = await readFileAsBase64(file)
    return {
      images: [
        {
          type: 'image',
          source: {
            type: 'data',
            value,
            mimeType: file.type || 'image/png',
          },
        },
      ],
      notes: [`Attached image: ${file.name}`],
    }
  }

  if (isReadableTextFile(file)) {
    const contents = await file.text()
    return {
      images: [],
      notes: [`Attached file ${file.name}:\n${contents}`],
    }
  }

  const type = file.type || 'unknown type'
  return {
    images: [],
    notes: [
      `Attached file: ${file.name}, ${type}, ${formatFileSize(file.size)}`,
    ],
  }
}

/** Build the user turn from composer text, quoted context, and attachments. */
export async function composeSendContent(payload: ChatSendPayload) {
  const text = composeMessageWithContext(payload.text, payload.contexts)
  const images: ContentPart[] = []
  const notes: string[] = []

  for (const file of payload.attachments) {
    const next = await partsFromAttachment(file)
    images.push(...next.images)
    notes.push(...next.notes)
  }

  const fullText = [text, ...notes]
    .filter((part) => part.length > 0)
    .join('\n\n')

  if (images.length === 0) {
    return fullText
  }

  const content: ContentPart[] = fullText
    ? [{ type: 'text', content: fullText }, ...images]
    : images

  return { content }
}
