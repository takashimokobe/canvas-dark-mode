import { useState } from 'react'
import type { ReactNode } from 'react'

import styles from './DarkModeExamples.module.css'

function Stage({
  ground = 'neutral50',
  hidden,
  children,
}: {
  ground?: 'black' | 'neutral50'
  hidden: string
  children: ReactNode
}) {
  return (
    <div
      className={styles.TaskStage}
      data-fill-container
      data-ground={ground}
      data-scheme="dark"
    >
      <p className="visually-hidden">{hidden}</p>
      {children}
    </div>
  )
}

function DemoToggle({
  label,
  checked,
  onChange,
  name,
}: {
  label: string
  checked: boolean
  onChange: () => void
  name?: string
}) {
  return (
    <label className={styles.DemoToggle}>
      <input
        type="checkbox"
        className="visually-hidden"
        checked={checked}
        onChange={onChange}
        aria-label={name ?? label}
      />
      <span className={styles.DemoTrack} aria-hidden />
      {label}
    </label>
  )
}

const CONTEXT_GREY = 'var(--cnvs-base-palette-neutral-200)'
const RED_500 = 'var(--cnvs-base-palette-red-500)'
const DARK_RED_500 = 'var(--cnvs-base-palette-dark-red-500)'

export function GreyOnWhite() {
  return (
    <figure className={styles.Split} data-fill-container>
      <figcaption className="visually-hidden">
        The same Neutral 200 square on white and on black
      </figcaption>
      <div className={styles.SplitHalf} data-ground="white">
        <div
          className={styles.Patch}
          style={{ background: CONTEXT_GREY }}
          aria-hidden
        />
      </div>
      <div className={styles.SplitHalf} data-ground="black">
        <div
          className={styles.Patch}
          style={{ background: CONTEXT_GREY }}
          aria-hidden
        />
      </div>
    </figure>
  )
}

export function GlowCompare() {
  const [refined, setRefined] = useState(false)

  return (
    <div
      className={styles.TaskStage}
      data-fill-container
      data-ground="black"
      data-scheme="dark"
    >
      <p className="visually-hidden">
        {refined ? 'Dark red 500 on black' : 'Red 500 on black'}
      </p>
      <p
        className={styles.GlowWord}
        style={{ color: refined ? DARK_RED_500 : RED_500 }}
        aria-hidden
      >
        Error
      </p>
      <DemoToggle
        label="Refined"
        checked={refined}
        onChange={() => setRefined(!refined)}
      />
    </div>
  )
}

function ShadowCard({
  ink,
  tone,
}: {
  ink: 'light' | 'dark'
  tone?: 'light'
}) {
  return (
    <div className={styles.ShadowCard} data-card={tone} data-ink={ink}>
      <p className={styles.CardTitle}>Q3 hiring</p>
      <p className={styles.CardMeta}>12 open roles</p>
    </div>
  )
}

export function ShadowCompare() {
  const [refined, setRefined] = useState(false)
  const ink = refined ? 'dark' : 'light'

  return (
    <figure className={styles.Split} data-fill-container>
      <figcaption className="visually-hidden">
        {refined
          ? 'Dark-mode Depth 1 on white and on dark-neutral-50'
          : 'Light-mode Depth 1 on white and on dark-neutral-50'}
      </figcaption>
      <div className={styles.SplitHalf} data-ground="white">
        <div className={styles.ShadowStage}>
          <ShadowCard tone="light" ink={ink} />
          <DemoToggle
            label="Refined"
            name="Refined on light"
            checked={refined}
            onChange={() => setRefined(!refined)}
          />
        </div>
      </div>
      <div className={styles.SplitHalf} data-ground="neutral50">
        <div className={styles.ShadowStage}>
          <ShadowCard ink={ink} />
          <DemoToggle
            label="Refined"
            name="Refined on dark"
            checked={refined}
            onChange={() => setRefined(!refined)}
          />
        </div>
      </div>
    </figure>
  )
}

export function DepthCompare() {
  const [refined, setRefined] = useState(false)

  return (
    <Stage
      hidden={
        refined
          ? 'Card, menu, and dialog step from 100 to 200'
          : 'Card, menu, and dialog share dark-neutral-100'
      }
    >
      <ol
        className={styles.DepthStack}
        data-lift={refined ? 'on' : 'off'}
        aria-hidden
      >
        <li className={styles.DepthLayer}>Card</li>
        <li className={styles.DepthLayer}>Menu</li>
        <li className={styles.DepthLayer}>Dialog</li>
      </ol>
      <DemoToggle
        label="Refined"
        checked={refined}
        onChange={() => setRefined(!refined)}
      />
    </Stage>
  )
}

const HALATION_HEAD = 'Reading'
const HALATION_BODY =
  'White on black blooms at the edges. Soften the page and the ink.'

export function HalationCompare() {
  return (
    <figure className={styles.Split} data-fill-container>
      <figcaption className="visually-hidden">
        White on black versus white-A800 on dark-neutral-50
      </figcaption>
      <div className={styles.SplitHalf} data-ground="black">
        <div className={styles.HalationCopy} data-ink="hot">
          <p className={styles.HalationHead}>{HALATION_HEAD}</p>
          <p className={styles.HalationBody}>{HALATION_BODY}</p>
        </div>
      </div>
      <div className={styles.SplitHalf} data-ground="neutral50">
        <div className={styles.HalationCopy} data-ink="soft">
          <p className={styles.HalationHead}>{HALATION_HEAD}</p>
          <p className={styles.HalationBody}>{HALATION_BODY}</p>
        </div>
      </div>
    </figure>
  )
}

export function ContrastCompare() {
  const [refined, setRefined] = useState(false)

  return (
    <Stage
      hidden={
        refined
          ? 'Dark blue 800 on dark-neutral-50'
          : 'Dark blue 400 on dark-neutral-50'
      }
    >
      <p className={styles.Link} data-ink={refined ? 'pass' : 'fail'}>
        View report
      </p>
      <DemoToggle
        label="Refined"
        checked={refined}
        onChange={() => setRefined(!refined)}
      />
    </Stage>
  )
}

export function CautionInk() {
  const [refined, setRefined] = useState(false)

  return (
    <Stage
      hidden={
        refined ? 'fg-contrast on caution 400' : 'fg-inverse on caution 400'
      }
    >
      <p
        className={styles.Caution}
        data-ink={refined ? 'contrast' : 'inverse'}
      >
        Unsaved changes
      </p>
      <DemoToggle
        label="Refined"
        checked={refined}
        onChange={() => setRefined(!refined)}
      />
    </Stage>
  )
}
