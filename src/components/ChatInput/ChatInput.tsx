import { useId, useRef, useState } from 'react'
import type { ComponentProps } from 'react'
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from '@workday/canvas-kit-react/button'
import { Menu } from '@workday/canvas-kit-react/menu'
import { Tooltip } from '@workday/canvas-kit-react/tooltip'
import {
  arrowUpIcon,
  cloudArrowUpIcon,
  configureIcon,
  imageIcon,
  lightbulbIcon,
  plusIcon,
  promptsIcon,
  searchSparkleIcon,
} from '@workday/canvas-system-icons-web'
import type { CanvasSystemIcon } from '@workday/canvas-system-icons-web'

import { contextChipLabel } from '@/lib/chat/composeContext'
import type { MessageContext } from '@/lib/chat/composeContext'
import { COMPOSER_PROMPTS } from '@/lib/chat/prompts'
import type { PromptId } from '@/lib/chat/prompts'
import { attachmentError, COMPOSER_TOOLS } from '@/lib/chat/send'
import type { ChatSendPayload, ComposerTool } from '@/lib/chat/send'

import { Attachment } from '@/components/Attachment'
import styles from './ChatInput.module.css'

export interface ChatInputProps {
  onSend: (payload: ChatSendPayload) => void
  onAttach?: () => void
  isLoading?: boolean
  onStop?: () => void
  error?: string | null
  placeholder?: string
  contexts?: MessageContext[]
  onRemoveContext?: (id: string) => void
  disabled?: boolean
}

const TOOL_LABELS: Record<ComposerTool, string> = {
  'search-web': 'Search the web',
  'think-longer': 'Think longer',
}

type AddMenuAction = 'upload-file' | 'add-photos' | ComposerTool | PromptId

const ADD_MENU_ACTIONS: readonly AddMenuAction[] = [
  'upload-file',
  'add-photos',
  'search-web',
  'think-longer',
  'prompt-tokens',
  'prompt-contrast',
]

function isAddMenuAction(id: string): id is AddMenuAction {
  return (ADD_MENU_ACTIONS as readonly string[]).includes(id)
}

type ComposerAttachment = {
  id: string
  file: File
}

function createAttachment(file: File): ComposerAttachment {
  return { id: crypto.randomUUID(), file }
}

function AddMenuItem({
  id,
  icon,
  children,
}: {
  id: AddMenuAction
  icon: CanvasSystemIcon
  children: string
}) {
  return (
    <Menu.Item data-id={id} data-text={children}>
      <Menu.Item.Icon icon={icon} />
      <Menu.Item.Text>{children}</Menu.Item.Text>
    </Menu.Item>
  )
}

export function ChatInput({
  onSend,
  onAttach,
  isLoading = false,
  onStop,
  error,
  placeholder = 'Why is surface.default lighter than bg.default in dark?',
  contexts = [],
  onRemoveContext,
  disabled = false,
}: ChatInputProps) {
  const inputId = useId()
  const errorId = useId()
  const fileInputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([])
  const [tools, setTools] = useState<Set<ComposerTool>>(() => new Set())
  const [localError, setLocalError] = useState<string | null>(null)
  const shownError = localError ?? error ?? null
  const canSend =
    !disabled &&
    !isLoading &&
    (value.trim().length > 0 || attachments.length > 0)

  const expanded =
    attachments.length > 0 ||
    tools.size > 0 ||
    contexts.length > 0 ||
    value.includes('\n')

  const handleChange: NonNullable<ComponentProps<'textarea'>['onChange']> = (
    event,
  ) => {
    setLocalError(null)
    setValue(event.target.value)
  }

  const handleKeyDown: NonNullable<ComponentProps<'textarea'>['onKeyDown']> = (
    event,
  ) => {
    if (
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return
    }

    event.preventDefault()
    if (!canSend) {
      return
    }

    event.currentTarget.form?.requestSubmit()
  }

  const openFilePicker = (accept: string) => {
    const input = fileInputRef.current
    if (!input || disabled) {
      return
    }

    onAttach?.()
    input.accept = accept
    input.click()
  }

  const toggleTool = (tool: ComposerTool) => {
    if (disabled) {
      return
    }

    setTools((current) => {
      const next = new Set(current)
      if (next.has(tool)) {
        next.delete(tool)
      } else {
        next.add(tool)
      }
      return next
    })
  }

  const insertPrompt = (id: PromptId) => {
    if (disabled) {
      return
    }

    const prompt = COMPOSER_PROMPTS[id].text
    setValue((current) => {
      const trimmed = current.trim()
      return trimmed ? `${trimmed}\n${prompt}` : prompt
    })
  }

  const handleMenuSelect = (data: { id: string }) => {
    if (!isAddMenuAction(data.id)) {
      return
    }

    switch (data.id) {
      case 'upload-file':
        openFilePicker('')
        return
      case 'add-photos':
        openFilePicker('image/*')
        return
      case 'search-web':
      case 'think-longer':
        toggleTool(data.id)
        return
      case 'prompt-tokens':
      case 'prompt-contrast':
        insertPrompt(data.id)
        return
      default: {
        const _exhaustive: never = data.id
        return _exhaustive
      }
    }
  }

  const handleFiles: NonNullable<ComponentProps<'input'>['onChange']> = (
    event,
  ) => {
    const files = event.currentTarget.files
    if (!files?.length) {
      return
    }

    const next: ComposerAttachment[] = []
    for (const file of files) {
      const problem = attachmentError(file)
      if (problem) {
        setLocalError(problem)
        event.currentTarget.value = ''
        event.currentTarget.accept = ''
        return
      }
      next.push(createAttachment(file))
    }

    setLocalError(null)
    setAttachments((current) => [...current, ...next])
    event.currentTarget.value = ''
    event.currentTarget.accept = ''
  }

  const handleSubmit: NonNullable<ComponentProps<'form'>['onSubmit']> = (
    event,
  ) => {
    event.preventDefault()
    const text = value.trim()
    if (disabled || isLoading || (!text && attachments.length === 0)) {
      return
    }

    for (const attachment of attachments) {
      const problem = attachmentError(attachment.file)
      if (problem) {
        setLocalError(problem)
        return
      }
    }

    onSend({
      text,
      attachments: attachments.map((item) => item.file),
      tools: COMPOSER_TOOLS.filter((tool) => tools.has(tool)),
      contexts,
    })
    setValue('')
    setAttachments([])
    setTools(new Set())
    setLocalError(null)
  }

  const extrasVisible =
    attachments.length > 0 || tools.size > 0 || contexts.length > 0

  return (
    <form className={styles.Form} onSubmit={handleSubmit}>
      <div
        className={styles.Composer}
        data-expanded={expanded || undefined}
      >
        <label htmlFor={inputId} className="visually-hidden">
          Message
        </label>
        <input
          ref={fileInputRef}
          id={fileInputId}
          className="visually-hidden"
          type="file"
          multiple
          tabIndex={-1}
          disabled={disabled}
          onChange={handleFiles}
        />
        {extrasVisible ? (
          <div className={styles.Extras}>
            {contexts.length > 0 ? (
              <ul className={styles.Contexts} aria-label="Context">
                {contexts.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={styles.Context}
                      onClick={() => onRemoveContext?.(item.id)}
                      aria-label={`Remove ${contextChipLabel(item)}`}
                    >
                      {contextChipLabel(item)}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {attachments.length > 0 ? (
              <ul className={styles.Attachments} aria-label="Attachments">
                {attachments.map((attachment) => (
                  <li key={attachment.id}>
                    <Attachment
                      file={attachment.file}
                      onRemove={() =>
                        setAttachments((current) =>
                          current.filter((item) => item.id !== attachment.id),
                        )
                      }
                    />
                  </li>
                ))}
              </ul>
            ) : null}
            {tools.size > 0 ? (
              <ul className={styles.Tools} aria-label="Tools">
                {COMPOSER_TOOLS.filter((tool) => tools.has(tool)).map(
                  (tool) => (
                    <li key={tool}>
                      <button
                        type="button"
                        className={styles.Tool}
                        onClick={() => toggleTool(tool)}
                        aria-label={`Remove ${TOOL_LABELS[tool]}`}
                      >
                        {TOOL_LABELS[tool]}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            ) : null}
          </div>
        ) : null}
        <div className={styles.Add}>
          <Menu onSelect={handleMenuSelect}>
            <Menu.Target
              as={TertiaryButton}
              type="button"
              icon={plusIcon}
              disabled={disabled}
              aria-label="Add to message"
            />
            <Menu.Popper placement="top-start">
              <Menu.Card>
                <Menu.List>
                  <Menu.Group title="Add">
                    <AddMenuItem id="upload-file" icon={cloudArrowUpIcon}>
                      Upload file
                    </AddMenuItem>
                    <AddMenuItem id="add-photos" icon={imageIcon}>
                      Add photos
                    </AddMenuItem>
                  </Menu.Group>
                  <Menu.Divider />
                  <Menu.Group title="Tools">
                    <AddMenuItem id="search-web" icon={searchSparkleIcon}>
                      Search the web
                    </AddMenuItem>
                    <AddMenuItem id="think-longer" icon={lightbulbIcon}>
                      Think longer
                    </AddMenuItem>
                  </Menu.Group>
                  <Menu.Divider />
                  <Menu.Group title="Prompts">
                    <AddMenuItem id="prompt-tokens" icon={promptsIcon}>
                      {COMPOSER_PROMPTS['prompt-tokens'].label}
                    </AddMenuItem>
                    <AddMenuItem id="prompt-contrast" icon={configureIcon}>
                      {COMPOSER_PROMPTS['prompt-contrast'].label}
                    </AddMenuItem>
                  </Menu.Group>
                </Menu.List>
              </Menu.Card>
            </Menu.Popper>
          </Menu>
        </div>
        <textarea
          id={inputId}
          className={styles.Input}
          name="message"
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          disabled={disabled}
          aria-invalid={shownError ? true : undefined}
          aria-describedby={shownError ? errorId : undefined}
        />
        <div className={styles.Send}>
          {isLoading && onStop ? (
            <SecondaryButton type="button" onClick={() => onStop()}>
              Stop
            </SecondaryButton>
          ) : (
            <Tooltip title="Send">
              <PrimaryButton
                type="submit"
                icon={arrowUpIcon}
                aria-label="Send"
                disabled={!canSend}
              />
            </Tooltip>
          )}
        </div>
      </div>
      {shownError ? (
        <p id={errorId} className={styles.Error} role="alert">
          {shownError}
        </p>
      ) : null}
    </form>
  )
}
