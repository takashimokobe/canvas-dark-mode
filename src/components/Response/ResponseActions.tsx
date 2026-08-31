import { useState } from 'react'
import { TertiaryButton } from '@workday/canvas-kit-react/button'
import { Menu } from '@workday/canvas-kit-react/menu'
import { Tooltip } from '@workday/canvas-kit-react/tooltip'
import {
  copyIcon,
  loopIcon,
  thumbsDownIcon,
  thumbsUpIcon,
} from '@workday/canvas-system-icons-web'
import type { CanvasSystemIcon } from '@workday/canvas-system-icons-web'

import styles from './ResponseActions.module.css'

type Feedback = 'up' | 'down' | null

export type ResponseActionsProps = {
  text: string
  inContext: boolean
  onToggleContext: () => void
  onRegenerate?: () => void
}

function IconAction({
  icon,
  label,
  pressed,
  onClick,
}: {
  icon: CanvasSystemIcon
  label: string
  pressed?: boolean
  onClick?: () => void
}) {
  return (
    <Tooltip title={label}>
      <TertiaryButton
        type="button"
        size="small"
        icon={icon}
        aria-label={label}
        aria-pressed={pressed}
        onClick={onClick}
      />
    </Tooltip>
  )
}

export function ResponseActions({
  text,
  inContext,
  onToggleContext,
  onRegenerate,
}: ResponseActionsProps) {
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [copied, setCopied] = useState(false)

  const copy = () => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    })
  }

  const toggleFeedback = (next: Exclude<Feedback, null>) => {
    setFeedback((current) => (current === next ? null : next))
  }

  return (
    <div className={styles.Actions}>
      <div className={styles.Group} role="group" aria-label="Response actions">
        <IconAction
          icon={thumbsUpIcon}
          label="Good response"
          pressed={feedback === 'up'}
          onClick={() => toggleFeedback('up')}
        />
        <IconAction
          icon={thumbsDownIcon}
          label="Bad response"
          pressed={feedback === 'down'}
          onClick={() => toggleFeedback('down')}
        />
        <IconAction
          icon={copyIcon}
          label={copied ? 'Copied' : 'Copy'}
          onClick={copy}
        />
        <Menu
          onSelect={({ id }) => {
            if (id === 'try-again') {
              onRegenerate?.()
            }
          }}
        >
          <Menu.Target
            as={TertiaryButton}
            type="button"
            size="small"
            icon={loopIcon}
            aria-label="Regenerate"
          />
          <Menu.Popper placement="bottom-start">
            <Menu.Card>
              <Menu.List>
                <Menu.Item data-id="try-again" aria-disabled={!onRegenerate}>
                  Try again
                </Menu.Item>
              </Menu.List>
            </Menu.Card>
          </Menu.Popper>
        </Menu>
      </div>
      <TertiaryButton
        type="button"
        size="small"
        aria-pressed={inContext}
        onClick={onToggleContext}
      >
        {inContext ? 'Remove from context' : 'Add as context'}
      </TertiaryButton>
    </div>
  )
}
