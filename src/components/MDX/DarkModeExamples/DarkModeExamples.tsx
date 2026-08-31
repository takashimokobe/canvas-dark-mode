import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from '@workday/canvas-kit-react/button'

import { BarChart } from '@/components/Chart'
import type { Brand } from '@/lib/rootPreferences'

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
    <div className={styles.TaskStage} data-fill-container data-ground="black">
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
  ink: 'light' | 'dark' | 'glow'
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

export function RoleModes() {
  const [refined, setRefined] = useState(false)

  return (
    <Stage
      hidden={
        refined ? 'accent-action Publish button' : 'Raw hex Publish button'
      }
    >
      <div className={styles.RoleCard}>
        <p>Ready to publish</p>
        {refined ? (
          <PrimaryButton size="medium">Publish</PrimaryButton>
        ) : (
          <button type="button" className={styles.HexFill}>
            Publish
          </button>
        )}
      </div>
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

export function SurfaceStack() {
  return <DepthCompare />
}

export function ThumbRing() {
  const [refined, setRefined] = useState(false)

  return (
    <Stage
      hidden={
        refined
          ? 'White-A200 thumb with a hairline ring'
          : 'Solid white thumb on a dark track'
      }
    >
      <div className={styles.Setting}>
        <span>Airplane Mode</span>
        <div className={styles.Track} data-ink={refined ? 'dark' : 'light'}>
          <span className={styles.Thumb} />
        </div>
      </div>
      <DemoToggle
        label="Refined"
        checked={refined}
        onChange={() => setRefined(!refined)}
      />
    </Stage>
  )
}

export function ChartColors() {
  const [refined, setRefined] = useState(false)

  return (
    <Stage
      hidden={
        refined
          ? 'Chart series use categorical fills'
          : 'Chart series use accent-action'
      }
    >
      <div className={styles.Widget} data-series={refined ? 'chart' : 'action'}>
        <p className={styles.WidgetTitle}>Visits</p>
        <BarChart className={styles.Chart} defaultIndex={1} />
      </div>
      <DemoToggle
        label="Refined"
        checked={refined}
        onChange={() => setRefined(!refined)}
      />
    </Stage>
  )
}

export function QuietChrome() {
  const [refined, setRefined] = useState(false)

  return (
    <Stage
      hidden={
        refined
          ? 'Quiet chrome: tertiary, secondary, and one primary'
          : 'Every action uses the primary fill'
      }
    >
      <div className={styles.Editor}>
        <p className={styles.EditorTitle}>Shift notes</p>
        <div className={styles.Toolbar} aria-label="Page actions">
          {refined ? (
            <>
              <TertiaryButton size="medium">Preview</TertiaryButton>
              <SecondaryButton size="medium">Save draft</SecondaryButton>
              <PrimaryButton size="medium">Publish</PrimaryButton>
            </>
          ) : (
            <>
              <PrimaryButton size="medium">Preview</PrimaryButton>
              <PrimaryButton size="medium">Save draft</PrimaryButton>
              <PrimaryButton size="medium">Publish</PrimaryButton>
            </>
          )}
        </div>
      </div>
      <DemoToggle
        label="Refined"
        checked={refined}
        onChange={() => setRefined(!refined)}
      />
    </Stage>
  )
}

export function StepJobs() {
  const [refined, setRefined] = useState(false)

  return (
    <Stage
      hidden={
        refined
          ? 'Input at 25 and 500, accent at 600, body at 800'
          : 'Four jobs painted with blue 500'
      }
    >
      <div
        className={styles.JobRow}
        data-jobs={refined ? 'on' : 'off'}
        aria-hidden
      >
        <span className={styles.JobField}>Name</span>
        <span className={styles.JobAccent}>Save</span>
        <span className={styles.JobCopy}>Keep the chrome quiet</span>
      </div>
      <DemoToggle
        label="Refined"
        checked={refined}
        onChange={() => setRefined(!refined)}
      />
    </Stage>
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

export function ChromaPeak() {
  return (
    <Stage hidden="Dark blue 500 peaks in chroma; 800 is quieter">
      <div className={styles.ChromaRow} aria-hidden>
        <figure className={styles.ChromaTile}>
          <p className={styles.ChromaWord} data-step="500">
            Blue
          </p>
          <figcaption>500</figcaption>
        </figure>
        <figure className={styles.ChromaTile}>
          <p className={styles.ChromaWord} data-step="800">
            Blue
          </p>
          <figcaption>800</figcaption>
        </figure>
      </div>
    </Stage>
  )
}

export function SpinePair() {
  return (
    <Stage hidden="Neutral 100 and Blue 100, same lightness">
      <div className={styles.Spine} aria-hidden>
        <figure className={styles.SpineTile}>
          <div
            className={styles.SpineCard}
            style={{ background: 'var(--cnvs-base-palette-dark-neutral-100)' }}
          />
          <figcaption>Neutral 100</figcaption>
        </figure>
        <figure className={styles.SpineTile}>
          <div
            className={styles.SpineCard}
            style={{ background: 'var(--cnvs-base-palette-dark-blue-100)' }}
          />
          <figcaption>Blue 100</figcaption>
        </figure>
      </div>
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

export function WhiteInk() {
  const [refined, setRefined] = useState(false)

  return (
    <Stage
      hidden={
        refined
          ? 'White-A900, A800, and A600 on dark-neutral-50'
          : 'Pure white type on dark-neutral-50'
      }
    >
      <div className={styles.TypeStack} data-ink={refined ? 'soft' : 'hot'}>
        <p data-role="heading">The marks are light</p>
        <p data-role="body">Body text for a long shift at the desk.</p>
        <p data-role="muted">Muted helper</p>
      </div>
      <DemoToggle
        label="Refined"
        checked={refined}
        onChange={() => setRefined(!refined)}
      />
    </Stage>
  )
}

export function InputContrast() {
  const [refined, setRefined] = useState(false)

  return (
    <Stage
      hidden={
        refined
          ? 'Input border at white-A300'
          : 'Input border at dark-neutral-400'
      }
    >
      <label className={styles.Field}>
        Workspace
        <input
          className={styles.Input}
          data-fail={refined ? undefined : ''}
          type="text"
          name="workspace"
          placeholder="Acme"
          autoComplete="off"
          spellCheck={false}
        />
      </label>
      <DemoToggle
        label="Refined"
        checked={refined}
        onChange={() => setRefined(!refined)}
      />
    </Stage>
  )
}

export function FocusStay() {
  const [refined, setRefined] = useState(false)

  return (
    <Stage
      hidden={
        refined
          ? 'Selected follows primary; focus stays blue 500'
          : 'Focus follows the brand fill'
      }
    >
      <ul
        className={styles.Select}
        data-brand="spotify"
        data-focus={refined ? 'blue' : 'brand'}
      >
        <li>Draft</li>
        <li data-selected data-focused>
          Ready
        </li>
        <li>Published</li>
      </ul>
      <DemoToggle
        label="Refined"
        checked={refined}
        onChange={() => setRefined(!refined)}
      />
    </Stage>
  )
}

export function ShadowInk() {
  const [refined, setRefined] = useState(false)

  return (
    <Stage
      hidden={
        refined
          ? 'Depth 1 in dark-neutral-25'
          : 'White glow standing in for a shadow'
      }
    >
      <ShadowCard ink={refined ? 'dark' : 'glow'} />
      <DemoToggle
        label="Refined"
        checked={refined}
        onChange={() => setRefined(!refined)}
      />
    </Stage>
  )
}

export function TenantChrome() {
  const [refined, setRefined] = useState(false)
  const brand: Brand = refined ? 'spotify' : 'default'

  return (
    <Stage
      hidden={
        refined
          ? 'Spotify accent-action on tinted chrome'
          : 'Default Neutral 975 action on Neutral chrome'
      }
    >
      <div className={styles.Chrome} data-brand={brand}>
        <span>Inbox</span>
        <PrimaryButton size="medium">Publish</PrimaryButton>
      </div>
      <DemoToggle
        label="Refined"
        checked={refined}
        onChange={() => setRefined(!refined)}
      />
    </Stage>
  )
}

const CHROME_STEPS = [
  25, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950, 975,
] as const

const CHROMATIC_STEPS = [
  25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 975,
] as const

const CHROMATIC_FAMILIES = [
  'amber',
  'azure',
  'blue',
  'coral',
  'green',
  'indigo',
  'magenta',
  'orange',
  'purple',
  'red',
  'teal',
] as const

type ChromeFamily = 'neutral' | 'slate' | 'white'

const CHROME_RAMPS: Record<
  ChromeFamily,
  { alpha: boolean; label: string }
> = {
  neutral: { alpha: false, label: 'Neutral' },
  slate: { alpha: false, label: 'Slate' },
  white: { alpha: true, label: 'White' },
}

function paletteFill(family: string, step: number, alpha: boolean) {
  const key = alpha ? `A${step}` : String(step)

  if (family === 'white') {
    return `var(--cnvs-base-palette-white-${key})`
  }

  return `light-dark(var(--cnvs-base-palette-${family}-${key}), var(--cnvs-base-palette-dark-${family}-${key}))`
}

function familyLabel(family: string) {
  return family.slice(0, 1).toUpperCase() + family.slice(1)
}

function PaletteRamp({
  family,
  steps,
  alpha,
  label,
}: {
  family: string
  steps: readonly number[]
  alpha: boolean
  label: string
}) {
  const nameId = useId()

  return (
    <div className={styles.RampRow}>
      <p id={nameId} className={styles.RampName}>
        {label}
      </p>
      <ol
        className={styles.RampCells}
        data-count={steps.length}
        aria-labelledby={nameId}
      >
        {steps.map((step) => (
          <li key={step} className={styles.RampCell}>
            <span
              className={styles.RampSwatch}
              style={{ background: paletteFill(family, step, alpha) }}
              aria-hidden
            />
            <span className={styles.RampStep}>
              <span className="visually-hidden">{label} </span>
              {alpha ? `A${step}` : step}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function NeutralRamps() {
  return (
    <div className={styles.RampBoard}>
      {(Object.keys(CHROME_RAMPS) as ChromeFamily[]).map((family) => {
        const ramp = CHROME_RAMPS[family]

        return (
          <PaletteRamp
            key={family}
            family={family}
            steps={CHROME_STEPS}
            alpha={ramp.alpha}
            label={ramp.label}
          />
        )
      })}
    </div>
  )
}

export function SaturatedRamps() {
  return (
    <div className={styles.RampBoard}>
      {CHROMATIC_FAMILIES.map((family) => (
        <PaletteRamp
          key={family}
          family={family}
          steps={CHROMATIC_STEPS}
          alpha={false}
          label={familyLabel(family)}
        />
      ))}
    </div>
  )
}
