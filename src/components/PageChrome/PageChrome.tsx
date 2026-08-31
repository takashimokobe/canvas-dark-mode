import type { ReactNode } from 'react'
import { PrimaryButton } from '@workday/canvas-kit-react/button'
import { Tooltip } from '@workday/canvas-kit-react/tooltip'
import { CanvasIconTypes } from '@workday/canvas-system-icons-web'
import type { CanvasSystemIcon } from '@workday/canvas-system-icons-web'
import { useKBar, VisualState } from 'kbar'

import { cn } from '@/lib/utils/mergeClasses'

import styles from './PageChrome.module.css'

const keyCommandIcon = {
  name: 'key-command',
  type: CanvasIconTypes.System,
  filename: 'wd-icon-key-command.svg',
  svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="wd-icon wd-icon-key-command" viewBox="0 0 24 24" role="presentation" focusable="false"><path fill="currentColor" d="M16.75 4a3.25 3.25 0 0 1 0 6.5H15.5v3h1.25a3.25 3.25 0 1 1-3.25 3.25V15.5h-3v1.25a3.25 3.25 0 1 1-3.25-3.25H8.5v-3H7.25a3.25 3.25 0 1 1 3.25-3.25V8.5h3V7.25A3.25 3.25 0 0 1 16.75 4m-9.5 11.5a1.25 1.25 0 1 0 1.25 1.25V15.5zm8.25 1.25a1.25 1.25 0 1 0 1.25-1.25H15.5zm-5-3.25h3v-3h-3zM7.25 6a1.25 1.25 0 1 0 0 2.5H8.5V7.25C8.5 6.56 7.94 6 7.25 6m9.5 0c-.69 0-1.25.56-1.25 1.25V8.5h1.25a1.25 1.25 0 1 0 0-2.5" class="wd-icon-fill"/></svg>',
} satisfies CanvasSystemIcon

function CommandButton() {
  const { query, visualState } = useKBar((state) => ({
    visualState: state.visualState,
  }))
  const expanded =
    visualState === VisualState.showing ||
    visualState === VisualState.animatingIn ||
    visualState === VisualState.animatingOut

  return (
    <Tooltip title="Open command menu">
      <PrimaryButton
        type="button"
        size="large"
        icon={keyCommandIcon}
        aria-label="Open command menu"
        aria-haspopup="dialog"
        aria-expanded={expanded}
        onClick={() => {
          query.toggle()
        }}
      />
    </Tooltip>
  )
}

export function PageChrome() {
  return (
    <>
      <a href="#main" className={styles.Skip}>
        Skip to main content
      </a>
      <header className={styles.Bar}>
        <span className={styles.Command}>
          <CommandButton />
        </span>
      </header>
    </>
  )
}

export function PageShell({
  children,
  className,
  before,
  frameClassName,
  variant,
}: {
  children: ReactNode
  className?: string
  before?: ReactNode
  frameClassName?: string
  variant?: 'doc'
}) {
  const main = (
    <main
      id="main"
      tabIndex={-1}
      className={cn(
        styles.SkipTarget,
        variant === 'doc' && styles.Doc,
        className,
      )}
    >
      {children}
    </main>
  )

  return (
    <>
      <PageChrome />
      {before || frameClassName ? (
        <div className={frameClassName}>
          {before}
          {main}
        </div>
      ) : (
        main
      )}
    </>
  )
}
