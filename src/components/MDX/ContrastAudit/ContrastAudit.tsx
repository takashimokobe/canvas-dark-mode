import { useLayoutEffect, useRef, useState } from 'react'
import { StatusIndicator } from '@workday/canvas-kit-preview-react/status-indicator'
import {
  checkIcon,
  exclamationCircleIcon,
} from '@workday/canvas-system-icons-web'

import { useBrand, useMode } from '@/lib/rootPreferences'
import { wcagContrastFromCssColors } from '@/lib/color/wcagContrastCss'

import styles from './ContrastAudit.module.css'

type PairKind = 'text' | 'nontext'

type Token = {
  name: string
  cssVar: string
}

type RolePair = {
  id: string
  group: string
  ink: Token
  ground: Token
  target: number
  kind: PairKind
  exempt?: boolean
}

type StepGround = number | 'default'

type StepPair = {
  bg: StepGround
  fg: number
  target: number
  kind: PairKind
}

type ResultState = 'pending' | 'pass' | 'fail' | 'exempt'

const CANVAS_FAMILIES = [
  'amber',
  'azure',
  'blue',
  'coral',
  'green',
  'indigo',
  'magenta',
  'neutral',
  'orange',
  'purple',
  'red',
  'slate',
  'teal',
] as const

const TENANT_FAMILIES = ['airbnb', 'discord', 'spotify'] as const

const FAMILIES = [...CANVAS_FAMILIES, ...TENANT_FAMILIES] as const

const STEP_PAIRS: StepPair[] = [
  { bg: 'default', fg: 500, target: 3, kind: 'nontext' },
  { bg: 'default', fg: 600, target: 4.5, kind: 'text' },
  { bg: 100, fg: 600, target: 4.5, kind: 'text' },
  { bg: 200, fg: 600, target: 3, kind: 'nontext' },
  { bg: 100, fg: 800, target: 7, kind: 'text' },
]

function roleToken(name: string, variable: string): Token {
  return { name, cssVar: variable }
}

const bg = {
  default: roleToken('bg-default', '--cnvs-sys-color-bg-default'),
  alt: roleToken('bg-alt', '--cnvs-sys-color-bg-alt-default'),
} as const

const surface = {
  default: roleToken('surface-default', '--cnvs-sys-color-surface-default'),
  popover: roleToken('surface-popover', '--cnvs-sys-color-surface-popover'),
  modal: roleToken('surface-modal', '--cnvs-sys-color-surface-modal'),
  alt: roleToken('surface-alt', '--cnvs-sys-color-surface-alt-default'),
  altStrong: roleToken(
    'surface-alt-strong',
    '--cnvs-sys-color-surface-alt-strong',
  ),
  info: roleToken('surface-info', '--cnvs-sys-color-surface-info-default'),
  infoStrong: roleToken(
    'surface-info-strong',
    '--cnvs-sys-color-surface-info-strong',
  ),
  danger: roleToken('surface-danger', '--cnvs-sys-color-surface-danger-default'),
  dangerStrong: roleToken(
    'surface-danger-strong',
    '--cnvs-sys-color-surface-danger-strong',
  ),
  warning: roleToken(
    'surface-warning',
    '--cnvs-sys-color-surface-warning-default',
  ),
  warningStrong: roleToken(
    'surface-warning-strong',
    '--cnvs-sys-color-surface-warning-strong',
  ),
  success: roleToken(
    'surface-success',
    '--cnvs-sys-color-surface-success-default',
  ),
  successStrong: roleToken(
    'surface-success-strong',
    '--cnvs-sys-color-surface-success-strong',
  ),
  ai: roleToken('surface-ai', '--cnvs-sys-color-surface-ai-default'),
  aiHover: roleToken('surface-ai-hover', '--cnvs-sys-color-surface-ai-hover'),
  contrast: roleToken(
    'surface-contrast',
    '--cnvs-sys-color-surface-contrast-default',
  ),
  contrastStrong: roleToken(
    'surface-contrast-strong',
    '--cnvs-sys-color-surface-contrast-strong',
  ),
  primary: roleToken(
    'surface-primary',
    '--cnvs-sys-color-brand-surface-primary-default',
  ),
  primaryStrong: roleToken(
    'surface-primary-strong',
    '--cnvs-sys-color-brand-surface-primary-strong',
  ),
  critical: roleToken(
    'surface-critical',
    '--cnvs-sys-color-brand-surface-critical-default',
  ),
  criticalStrong: roleToken(
    'surface-critical-strong',
    '--cnvs-sys-color-brand-surface-critical-strong',
  ),
  caution: roleToken(
    'surface-caution',
    '--cnvs-sys-color-brand-surface-caution-default',
  ),
  cautionStrong: roleToken(
    'surface-caution-strong',
    '--cnvs-sys-color-brand-surface-caution-strong',
  ),
  positive: roleToken(
    'surface-positive',
    '--cnvs-sys-color-brand-surface-positive-default',
  ),
  positiveStrong: roleToken(
    'surface-positive-strong',
    '--cnvs-sys-color-brand-surface-positive-strong',
  ),
  selected: roleToken('surface-selected', '--cnvs-sys-color-brand-surface-selected'),
  thumb: roleToken('surface-thumb', '--cnvs-sys-color-surface-thumb'),
  highlight: roleToken(
    'surface-text-highlight',
    '--cnvs-sys-color-surface-text-highlight',
  ),
  track: roleToken('switch-track', '--cnvs-sys-color-switch-track-default'),
} as const

const accent = {
  action: roleToken('accent-action', '--cnvs-sys-color-brand-accent-action'),
  critical: roleToken(
    'accent-critical',
    '--cnvs-sys-color-brand-accent-critical',
  ),
  caution: roleToken('accent-caution', '--cnvs-sys-color-brand-accent-caution'),
  positive: roleToken(
    'accent-positive',
    '--cnvs-sys-color-brand-accent-positive',
  ),
  ai: roleToken('accent-ai', '--cnvs-sys-color-accent-ai'),
  info: roleToken('accent-info', '--cnvs-sys-color-accent-info'),
  danger: roleToken('accent-danger', '--cnvs-sys-color-accent-danger'),
  warning: roleToken('accent-warning', '--cnvs-sys-color-accent-warning'),
  success: roleToken('accent-success', '--cnvs-sys-color-accent-success'),
  contrast: roleToken('accent-contrast', '--cnvs-sys-color-accent-contrast'),
  muted: roleToken('accent-muted', '--cnvs-sys-color-accent-muted-default'),
  mutedSoft: roleToken('accent-muted-soft', '--cnvs-sys-color-accent-muted-soft'),
} as const

const fg = {
  default: roleToken('fg-default', '--cnvs-sys-color-fg-default'),
  strong: roleToken('fg-strong', '--cnvs-sys-color-fg-strong'),
  stronger: roleToken('fg-stronger', '--cnvs-sys-color-fg-stronger'),
  disabled: roleToken('fg-disabled', '--cnvs-sys-color-fg-disabled'),
  muted: roleToken('fg-muted', '--cnvs-sys-color-fg-muted-default'),
  mutedStrong: roleToken('fg-muted-strong', '--cnvs-sys-color-fg-muted-strong'),
  inverse: roleToken('fg-inverse', '--cnvs-sys-color-fg-inverse'),
  info: roleToken('fg-info', '--cnvs-sys-color-fg-info-default'),
  infoStrong: roleToken('fg-info-strong', '--cnvs-sys-color-fg-info-strong'),
  danger: roleToken('fg-danger', '--cnvs-sys-color-fg-danger-default'),
  dangerStrong: roleToken('fg-danger-strong', '--cnvs-sys-color-fg-danger-strong'),
  warning: roleToken('fg-warning', '--cnvs-sys-color-fg-warning-default'),
  warningStrong: roleToken(
    'fg-warning-strong',
    '--cnvs-sys-color-fg-warning-strong',
  ),
  success: roleToken('fg-success', '--cnvs-sys-color-fg-success-default'),
  successStrong: roleToken(
    'fg-success-strong',
    '--cnvs-sys-color-fg-success-strong',
  ),
  link: roleToken('fg-link', '--cnvs-sys-color-fg-link-default'),
  linkHover: roleToken('fg-link-hover', '--cnvs-sys-color-fg-link-hover'),
  ai: roleToken('fg-ai', '--cnvs-sys-color-fg-ai'),
  contrast: roleToken('fg-contrast', '--cnvs-sys-color-fg-contrast-default'),
  contrastStrong: roleToken(
    'fg-contrast-strong',
    '--cnvs-sys-color-fg-contrast-strong',
  ),
  primary: roleToken('fg-primary', '--cnvs-sys-color-brand-fg-primary-default'),
  primaryStrong: roleToken(
    'fg-primary-strong',
    '--cnvs-sys-color-brand-fg-primary-strong',
  ),
  critical: roleToken(
    'fg-critical',
    '--cnvs-sys-color-brand-fg-critical-default',
  ),
  criticalStrong: roleToken(
    'fg-critical-strong',
    '--cnvs-sys-color-brand-fg-critical-strong',
  ),
  caution: roleToken('fg-caution', '--cnvs-sys-color-brand-fg-caution-default'),
  cautionStrong: roleToken(
    'fg-caution-strong',
    '--cnvs-sys-color-brand-fg-caution-strong',
  ),
  positive: roleToken(
    'fg-positive',
    '--cnvs-sys-color-brand-fg-positive-default',
  ),
  positiveStrong: roleToken(
    'fg-positive-strong',
    '--cnvs-sys-color-brand-fg-positive-strong',
  ),
  selected: roleToken('fg-selected', '--cnvs-sys-color-brand-fg-selected'),
  thumb: roleToken('fg-thumb', '--cnvs-sys-color-fg-thumb'),
} as const

const border = {
  input: roleToken('border-input', '--cnvs-sys-color-border-input-default'),
  inputHover: roleToken(
    'border-input-hover',
    '--cnvs-sys-color-border-input-hover',
  ),
  info: roleToken('border-info', '--cnvs-sys-color-border-info'),
  danger: roleToken('border-danger', '--cnvs-sys-color-border-danger'),
  warning: roleToken('border-warning', '--cnvs-sys-color-border-warning'),
  ai: roleToken('border-ai', '--cnvs-sys-color-border-ai'),
  inverse: roleToken('border-inverse', '--cnvs-sys-color-border-inverse-default'),
  contrast: roleToken(
    'border-contrast',
    '--cnvs-sys-color-border-contrast-default',
  ),
  primary: roleToken('border-primary', '--cnvs-sys-color-brand-border-primary'),
  critical: roleToken(
    'border-critical',
    '--cnvs-sys-color-brand-border-critical',
  ),
  caution: roleToken('border-caution', '--cnvs-sys-color-brand-border-caution'),
  thumb: roleToken('border-thumb', '--cnvs-sys-color-border-thumb'),
} as const

const PAGE_STACK: Token[] = [
  bg.default,
  bg.alt,
  surface.default,
  surface.popover,
  surface.modal,
]

const INVERSE_ACCENTS: Token[] = [
  accent.action,
  accent.critical,
  accent.positive,
  accent.ai,
  accent.info,
  accent.danger,
  accent.success,
  accent.muted,
  accent.contrast,
]

const CAUTION_ACCENTS: Token[] = [accent.caution, accent.warning]

function pair(
  ink: Token,
  ground: Token,
  group: string,
  kind: PairKind,
  target: number,
  exempt = false,
): RolePair {
  return {
    id: `${ink.name}/${ground.name}`,
    group,
    ink,
    ground,
    kind,
    target,
    exempt,
  }
}

function on(
  ink: Token,
  grounds: Token[],
  group: string,
  kind: PairKind,
  target: number,
  exempt = false,
) {
  return grounds.map((ground) => pair(ink, ground, group, kind, target, exempt))
}

function matchingStatus(
  defaultInk: Token,
  defaultGround: Token,
  strongInk: Token,
  strongGround: Token,
  group: string,
) {
  return [
    pair(defaultInk, defaultGround, group, 'text', 4.5),
    pair(defaultInk, bg.default, group, 'text', 4.5),
    pair(defaultInk, surface.default, group, 'text', 4.5),
    pair(strongInk, strongGround, group, 'text', 4.5),
  ]
}

function matchingStatusBorder(
  ink: Token,
  tinted: Token,
  group: string,
) {
  return [
    pair(ink, tinted, group, 'nontext', 3),
    pair(ink, bg.default, group, 'nontext', 3),
    pair(ink, surface.default, group, 'nontext', 3),
  ]
}

const TEXT_PAIRS: RolePair[] = [
  ...[fg.default, fg.strong, fg.stronger, fg.muted, fg.mutedStrong].flatMap(
    (ink) => on(ink, PAGE_STACK, 'Neutral', 'text', 4.5),
  ),
  pair(fg.default, surface.alt, 'Neutral', 'text', 4.5),
  pair(fg.strong, surface.altStrong, 'Neutral', 'text', 4.5),
  pair(fg.default, surface.highlight, 'Neutral', 'text', 4.5),
  ...on(fg.disabled, [bg.default, surface.default], 'Disabled', 'text', 4.5, true),
  ...[fg.link, fg.linkHover].flatMap((ink) =>
    on(ink, PAGE_STACK, 'Links', 'text', 4.5),
  ),
  ...matchingStatus(
    fg.info,
    surface.info,
    fg.infoStrong,
    surface.infoStrong,
    'Status',
  ),
  ...matchingStatus(
    fg.danger,
    surface.danger,
    fg.dangerStrong,
    surface.dangerStrong,
    'Status',
  ),
  ...matchingStatus(
    fg.warning,
    surface.warning,
    fg.warningStrong,
    surface.warningStrong,
    'Status',
  ),
  ...matchingStatus(
    fg.success,
    surface.success,
    fg.successStrong,
    surface.successStrong,
    'Status',
  ),
  pair(fg.ai, surface.ai, 'Status', 'text', 4.5),
  pair(fg.ai, surface.aiHover, 'Status', 'text', 4.5),
  pair(fg.ai, bg.default, 'Status', 'text', 4.5),
  pair(fg.ai, surface.default, 'Status', 'text', 4.5),
  ...matchingStatus(
    fg.primary,
    surface.primary,
    fg.primaryStrong,
    surface.primaryStrong,
    'Brand',
  ),
  ...matchingStatus(
    fg.critical,
    surface.critical,
    fg.criticalStrong,
    surface.criticalStrong,
    'Brand',
  ),
  ...matchingStatus(
    fg.caution,
    surface.caution,
    fg.cautionStrong,
    surface.cautionStrong,
    'Brand',
  ),
  ...matchingStatus(
    fg.positive,
    surface.positive,
    fg.positiveStrong,
    surface.positiveStrong,
    'Brand',
  ),
  ...INVERSE_ACCENTS.flatMap((ground) => [
    pair(fg.inverse, ground, 'Accents', 'text', 4.5),
  ]),
  pair(fg.inverse, surface.contrast, 'Accents', 'text', 4.5),
  pair(fg.inverse, surface.contrastStrong, 'Accents', 'text', 4.5),
  ...CAUTION_ACCENTS.flatMap((ground) => [
    pair(fg.contrast, ground, 'Caution', 'text', 4.5),
    pair(fg.contrastStrong, ground, 'Caution', 'text', 4.5),
  ]),
  pair(fg.contrast, accent.mutedSoft, 'Caution', 'text', 4.5),
  pair(fg.selected, surface.selected, 'Selection', 'text', 4.5),
  pair(fg.thumb, surface.thumb, 'Selection', 'text', 4.5),
]

const BORDER_PAIRS: RolePair[] = [
  ...on(border.input, PAGE_STACK, 'Inputs', 'nontext', 3),
  ...on(border.inputHover, PAGE_STACK, 'Inputs', 'nontext', 3),
  ...matchingStatusBorder(border.info, surface.info, 'Status'),
  ...matchingStatusBorder(border.danger, surface.danger, 'Status'),
  ...matchingStatusBorder(border.warning, surface.warning, 'Status'),
  ...matchingStatusBorder(border.ai, surface.ai, 'Status'),
  ...on(border.critical, [bg.default, surface.default], 'Status', 'nontext', 3),
  ...on(border.caution, [bg.default, surface.default], 'Status', 'nontext', 3),
  ...on(border.primary, [bg.default, surface.default], 'Brand', 'nontext', 3),
  ...INVERSE_ACCENTS.flatMap((ground) => [
    pair(border.inverse, ground, 'Inverse', 'nontext', 3),
  ]),
  ...CAUTION_ACCENTS.flatMap((ground) => [
    pair(border.contrast, ground, 'Contrast', 'nontext', 3),
  ]),
  pair(border.contrast, bg.default, 'Contrast', 'nontext', 3),
  pair(border.thumb, surface.track, 'Thumb', 'nontext', 3),
  pair(border.thumb, surface.thumb, 'Thumb', 'nontext', 3),
]

const CANVAS_FAMILY_SET = new Set<string>(CANVAS_FAMILIES)

function cssPaint(item: Token) {
  return `var(${item.cssVar})`
}

function stepPaint(family: string, step: number) {
  if (CANVAS_FAMILY_SET.has(family)) {
    return `light-dark(var(--cnvs-base-palette-${family}-${step}), var(--cnvs-base-palette-dark-${family}-${step}))`
  }

  return `light-dark(var(--${family}-${step}), var(--dark-${family}-${step}))`
}

function groundPaint(family: string, bg: StepGround) {
  if (bg === 'default') {
    return 'var(--cnvs-sys-color-bg-default)'
  }

  return stepPaint(family, bg)
}

function groundLabel(bg: StepGround) {
  return bg === 'default' ? 'bg' : String(bg)
}

function pairId(family: string, bg: StepGround, fg: number) {
  return `${family}-${bg}-${fg}`
}

function passes(
  ratio: number | undefined,
  target: number,
  exempt?: boolean,
) {
  if (exempt) {
    return true
  }

  return ratio != null && ratio + 1e-9 >= target
}

function formatRatio(ratio: number | undefined) {
  return ratio == null ? '—' : `${ratio.toFixed(2)}:1`
}

function compliance(kind: PairKind, ratio: number | undefined, target: number) {
  if (ratio == null) {
    return '—'
  }

  if (!passes(ratio, target)) {
    return 'Fail'
  }

  switch (kind) {
    case 'text':
      return ratio + 1e-9 >= 7 ? 'AAA' : 'AA'
    case 'nontext':
      return ratio + 1e-9 >= 4.5 ? 'AAA' : 'AA'
    default: {
      const _exhaustive: never = kind
      return _exhaustive
    }
  }
}

function kindLabel(kind: PairKind) {
  switch (kind) {
    case 'text':
      return 'Text'
    case 'nontext':
      return 'Non-text'
    default: {
      const _exhaustive: never = kind
      return _exhaustive
    }
  }
}

function resultState(
  ratio: number | undefined,
  target: number,
  exempt?: boolean,
): ResultState {
  if (exempt) {
    return 'exempt'
  }

  if (ratio == null) {
    return 'pending'
  }

  return passes(ratio, target) ? 'pass' : 'fail'
}

function groupedPairs(pairs: RolePair[]) {
  const groups: { name: string; pairs: RolePair[] }[] = []

  for (const item of pairs) {
    const last = groups.at(-1)
    if (last?.name === item.group) {
      last.pairs.push(item)
      continue
    }

    groups.push({ name: item.group, pairs: [item] })
  }

  return groups
}

function ResultIndicator({ state }: { state: ResultState }) {
  switch (state) {
    case 'pending':
      return (
        <StatusIndicator emphasis="low" variant="neutral">
          <StatusIndicator.Label>Measuring</StatusIndicator.Label>
        </StatusIndicator>
      )
    case 'pass':
      return (
        <StatusIndicator emphasis="low" variant="positive">
          <StatusIndicator.Icon icon={checkIcon} size="xxs" />
          <StatusIndicator.Label>Pass</StatusIndicator.Label>
        </StatusIndicator>
      )
    case 'fail':
      return (
        <StatusIndicator emphasis="low" variant="critical">
          <StatusIndicator.Icon icon={exclamationCircleIcon} size="xxs" />
          <StatusIndicator.Label>Fail</StatusIndicator.Label>
        </StatusIndicator>
      )
    case 'exempt':
      return (
        <StatusIndicator emphasis="low" variant="neutral">
          <StatusIndicator.Label>Exempt</StatusIndicator.Label>
        </StatusIndicator>
      )
    default: {
      const _exhaustive: never = state
      return _exhaustive
    }
  }
}

function ProbeSwatch({
  id,
  background,
  color,
  tone,
  compact = false,
}: {
  id: string
  background: string
  color: string
  tone: PairKind
  compact?: boolean
}) {
  switch (tone) {
    case 'text':
      return (
        <span
          className={styles.SwatchStage}
          aria-hidden
          data-compact={compact || undefined}
        >
          <span
            className={styles.Swatch}
            data-probe={id}
            style={{ background, color }}
          >
            {compact ? null : 'Ag'}
          </span>
        </span>
      )
    case 'nontext':
      return (
        <span
          className={styles.SwatchStage}
          aria-hidden
          data-compact={compact || undefined}
        >
          <span
            className={styles.BorderSwatch}
            data-probe={id}
            style={{ background, color }}
          />
        </span>
      )
    default: {
      const _exhaustive: never = tone
      return _exhaustive
    }
  }
}

function RoleTable({
  caption,
  inkHeading,
  pairs,
  ratios,
}: {
  caption: string
  inkHeading: string
  pairs: RolePair[]
  ratios: Record<string, number | undefined>
}) {
  return (
    <div className={styles.Wrap}>
      <table className={styles.Table}>
        <caption className={styles.Caption}>{caption}</caption>
        <thead>
          <tr>
            <th className={styles.PairHead} scope="col">
              Pair
            </th>
            <th scope="col">{inkHeading}</th>
            <th scope="col">Background</th>
            <th className={styles.NumHead} scope="col">
              Ratio
            </th>
            <th className={styles.NumHead} scope="col">
              Target
            </th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        {groupedPairs(pairs).map((group) => (
          <tbody key={group.name}>
            <tr>
              <th className={styles.GroupHead} colSpan={6} scope="col">
                {group.name}
              </th>
            </tr>
            {group.pairs.map((item) => {
              const ratio = ratios[item.id]
              const state = resultState(ratio, item.target, item.exempt)
              const failed = state === 'fail'

              return (
                <tr key={item.id} data-fail={failed ? '' : undefined}>
                  <td className={styles.PairCell}>
                    <ProbeSwatch
                      id={item.id}
                      background={cssPaint(item.ground)}
                      color={cssPaint(item.ink)}
                      tone={item.kind}
                    />
                  </td>
                  <th className={styles.TokenCell} scope="row">
                    {item.ink.name}
                  </th>
                  <td className={styles.TokenCell}>{item.ground.name}</td>
                  <td className={styles.NumCell}>{formatRatio(ratio)}</td>
                  <td className={styles.NumCell}>
                    {item.exempt ? '—' : `${item.target.toFixed(1)}:1`}
                  </td>
                  <td className={styles.ResultCell}>
                    <ResultIndicator state={state} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        ))}
      </table>
    </div>
  )
}

type ContrastAuditGroup = 'text' | 'border' | 'steps'

function useContrastRatios() {
  const { mode } = useMode()
  const { brand } = useBrand()
  const rootRef = useRef<HTMLDivElement>(null)
  const [ratios, setRatios] = useState<Record<string, number | undefined>>({})

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) {
      return
    }

    const next: Record<string, number | undefined> = {}
    for (const node of root.querySelectorAll<HTMLElement>('[data-probe]')) {
      const id = node.dataset.probe
      if (!id) {
        continue
      }

      const computed = getComputedStyle(node)
      const backdrop = node.parentElement
        ? getComputedStyle(node.parentElement).backgroundColor
        : undefined
      next[id] = wcagContrastFromCssColors(
        computed.color,
        computed.backgroundColor,
        backdrop,
      )
    }

    setRatios(next)
  }, [mode, brand])

  return { rootRef, ratios, mode }
}

function StepTable({
  ratios,
  mode,
}: {
  ratios: Record<string, number | undefined>
  mode: string
}) {
  return (
    <div className={styles.Wrap}>
      <table className={`${styles.Table} ${styles.StepTable}`}>
        <caption className={styles.Caption}>
          Family step contrast in {mode} mode
        </caption>
        <thead>
          <tr>
            <th className={styles.NameCell} scope="col">
              Family
            </th>
            {STEP_PAIRS.map((item) => (
              <th
                key={`${item.bg}-${item.fg}`}
                className={styles.StepHead}
                scope="col"
              >
                {groundLabel(item.bg)}/{item.fg}
                <span className={styles.Meta}>
                  {item.target}:1 {kindLabel(item.kind)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FAMILIES.map((family) => (
            <tr key={family}>
              <th className={styles.NameCell} scope="row">
                {family}
              </th>
              {STEP_PAIRS.map((item) => {
                const id = pairId(family, item.bg, item.fg)
                const ratio = ratios[id]
                const ok = passes(ratio, item.target)
                const failed = !ok && ratio != null

                return (
                  <td
                    key={id}
                    className={styles.StepCell}
                    data-fail={failed ? '' : undefined}
                  >
                    <span className={styles.StepPair}>
                      <ProbeSwatch
                        id={id}
                        background={groundPaint(family, item.bg)}
                        color={stepPaint(family, item.fg)}
                        tone={item.kind}
                        compact
                      />
                      <span className={styles.StepRatio}>
                        {ratio == null ? '—' : ratio.toFixed(2)}
                      </span>
                      <span
                        className={styles.StepResult}
                        data-pass={ok || undefined}
                        data-fail={failed ? '' : undefined}
                      >
                        {compliance(item.kind, ratio, item.target)}
                      </span>
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ContrastAudit({ group }: { group: ContrastAuditGroup }) {
  const { rootRef, ratios, mode } = useContrastRatios()

  switch (group) {
    case 'text': {
      return (
        <div ref={rootRef} className={styles.Root}>
          <RoleTable
            caption={`Text contrast in ${mode} mode`}
            inkHeading="Foreground"
            pairs={TEXT_PAIRS}
            ratios={ratios}
          />
        </div>
      )
    }
    case 'border': {
      return (
        <div ref={rootRef} className={styles.Root}>
          <RoleTable
            caption={`Border contrast in ${mode} mode`}
            inkHeading="Border"
            pairs={BORDER_PAIRS}
            ratios={ratios}
          />
        </div>
      )
    }
    case 'steps': {
      return (
        <div ref={rootRef} className={styles.Root}>
          <StepTable ratios={ratios} mode={mode} />
        </div>
      )
    }
    default: {
      const _exhaustive: never = group
      return _exhaustive
    }
  }
}
