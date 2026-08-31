import { useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { PrimaryButton } from '@workday/canvas-kit-react/button'

import styles from './AccentOverlayDemo.module.css'

const ACCENTS = [
  {
    id: 'primary',
    name: 'Primary',
    fill: 'var(--cnvs-sys-color-brand-accent-primary)',
    ink: 'var(--cnvs-sys-color-fg-inverse)',
  },
  {
    id: 'positive',
    name: 'Positive',
    fill: 'var(--cnvs-sys-color-brand-accent-positive)',
    ink: 'var(--cnvs-sys-color-fg-inverse)',
  },
  {
    id: 'critical',
    name: 'Critical',
    fill: 'var(--cnvs-sys-color-brand-accent-critical)',
    ink: 'var(--cnvs-sys-color-fg-inverse)',
  },
  {
    id: 'caution',
    name: 'Caution',
    fill: 'var(--cnvs-sys-color-brand-accent-caution)',
    ink: 'var(--cnvs-sys-color-fg-contrast)',
  },
] as const

export function AccentOverlayDemo() {
  const [pressed, setPressed] = useState(false)

  const press = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setPressed(true)
  }

  const release = () => {
    setPressed(false)
  }

  const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      setPressed(true)
    }
  }

  const keyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      setPressed(false)
    }
  }

  return (
    <div
      className={styles.Root}
      data-fill-container
      data-scheme="dark"
      data-pressed={pressed || undefined}
    >
      <ul className={styles.Row}>
        {ACCENTS.map((accent) => (
          <li key={accent.id} className={styles.Item}>
            <div className={styles.Stack} aria-hidden>
              <div
                className={styles.Fill}
                style={{
                  backgroundColor: accent.fill,
                  color: accent.ink,
                }}
              >
                {accent.name}
              </div>
              <div className={styles.Overlay}>
                {pressed ? 'Pressed' : 'Hover'}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <PrimaryButton
        type="button"
        aria-pressed={pressed}
        onPointerDown={press}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={release}
        onKeyDown={keyDown}
        onKeyUp={keyUp}
        onBlur={release}
      >
        Press
      </PrimaryButton>
    </div>
  )
}
