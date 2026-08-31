export type ColorRoleGroup =
  | 'bg'
  | 'surface'
  | 'accent'
  | 'fg'
  | 'border'
  | 'focus'
  | 'switch'
  | 'shadow'
  | 'overlay'

export function formatTokenName(name: string): string {
  return name.replaceAll(/[./]/g, '-')
}

export function formatVariableName(name: string): string {
  return formatTokenName(name.replace(/\.default$/, ''))
}

/** Palette path, or ink plus the alpha the token actually paints. */
export function formatAliasName(name: string): string {
  const alpha = name.match(/\/(\d+(?:\.\d+)?%)$/)
  if (alpha && alpha.index !== undefined) {
    return `${formatVariableName(name.slice(0, alpha.index))} / ${alpha[1]}`
  }

  return formatVariableName(name)
}

/**
 * Depth 1–6 key/ambient output. Strength, step, and ambient ratio must
 * match `--cnvs-sys-shadow-*` in `src/styles/theme/color.css`.
 */
function shadowOutput(
  step: 1 | 2 | 3 | 4 | 5 | 6,
  layer: 'key' | 'ambient',
): readonly [string, string] {
  const light = 1 + 2 * step
  const dark = 10 + 6 * step
  const ratio = layer === 'ambient' ? 0.667 : 1

  return [
    `black/${formatShadowAlpha(light * ratio)}`,
    `dark-neutral/25/${formatShadowAlpha(dark * ratio)}`,
  ]
}

function formatShadowAlpha(percent: number): string {
  const rounded = Math.round(percent * 10) / 10
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`
}

export type ColorRoleToken = {
  name: string
  cssVar: string
  description: string
  light: string
  dark: string
}

type TokenRow = readonly [name: string, cssVar: string, description?: string]

function tokens(rows: readonly TokenRow[]): ColorRoleToken[] {
  return rows.map(([name, cssVar, description = '']) => {
    const alias = TOKEN_ALIASES[name]
    if (!alias) {
      throw new Error(`Missing alias for ${name}`)
    }
    return {
      name,
      cssVar,
      description,
      light: alias[0],
      dark: alias[1],
    }
  })
}

const TOKEN_ALIASES: Record<string, readonly [string, string]> = {
  'accent.action': ['action/base', 'dark/action/base'],
  'accent.ai': ['blue/950', 'dark/blue/600'],
  'accent.caution': ['caution/400', 'dark/caution/600'],
  'accent.contrast': ['neutral/900', 'white/A900'],
  'accent.critical': ['critical/600', 'dark/critical/600'],
  'accent.danger': ['red/600', 'dark/red/600'],
  'accent.info': ['blue/600', 'dark/blue/600'],
  'accent.muted': ['neutral/600', 'dark/neutral/600'],
  'accent.muted-soft': ['neutral/400', 'dark/neutral/400'],
  'accent.overlay.hover': ['white/A200', 'neutral/A200'],
  'accent.overlay.mixin': ['white', 'black'],
  'accent.overlay.pressed': ['white/A300', 'neutral/A300'],
  'accent.positive': ['positive/600', 'dark/positive/600'],
  'accent.primary': ['action/base', 'dark/action/base'],
  'accent.success': ['green/600', 'dark/green/600'],
  'accent.warning': ['amber/400', 'dark/amber/600'],
  'bg.alt': ['neutral/50', 'dark/neutral/25'],
  'bg.default': ['white', 'dark/neutral/50'],
  'border.ai': ['blue/950', 'dark/blue/500'],
  'border.caution': ['caution/500', 'dark/caution/500'],
  'border.contrast': ['neutral/A900', 'white/A900'],
  'border.critical': ['critical/500', 'dark/critical/500'],
  'border.danger': ['red/500', 'dark/red/500'],
  'border.default': ['neutral/A100', 'dark/neutral/A200'],
  'border.elevated': ['white', 'dark/neutral/150'],
  'border.info': ['blue/500', 'dark/blue/500'],
  'border.input': ['neutral/A500', 'dark/neutral/A500'],
  'border.input-hover': ['neutral/A700', 'dark/neutral/A600'],
  'border.inverse': ['white', 'black'],
  'border.inverse-strong': ['white/A700', 'white/A700'],
  'border.primary': ['blue/500', 'dark/blue/500'],
  'border.strong': ['neutral/A200', 'dark/neutral/A300'],
  'border.thumb': ['white/transparent', 'white/A400'],
  'border.transparent': ['white/transparent', 'black/transparent'],
  'border.warning': ['amber/500', 'dark/amber/500'],
  'fg.ai': ['blue/950', 'dark/blue/600'],
  'fg.caution.default': ['caution/600', 'dark/caution/600'],
  'fg.caution.strong': ['caution/700', 'dark/caution/700'],
  'fg.contrast.default': ['neutral/A900', 'neutral/A900'],
  'fg.contrast.strong': ['neutral/A950', 'neutral/A950'],
  'fg.critical.default': ['critical/600', 'dark/critical/600'],
  'fg.critical.strong': ['critical/700', 'dark/critical/700'],
  'fg.danger.default': ['red/600', 'dark/red/600'],
  'fg.danger.strong': ['red/700', 'dark/red/700'],
  'fg.default': ['neutral/A800', 'white/A800'],
  'fg.disabled': ['neutral/A400', 'white/A400'],
  'fg.info.default': ['blue/600', 'dark/blue/600'],
  'fg.info.strong': ['blue/700', 'dark/blue/700'],
  'fg.inverse': ['white', 'black'],
  'fg.link.default': ['blue/600', 'dark/blue/600'],
  'fg.link.hover': ['blue/700', 'dark/blue/700'],
  'fg.muted.default': ['neutral/A600', 'white/A600'],
  'fg.muted.strong': ['neutral/A700', 'white/A700'],
  'fg.positive.default': ['positive/600', 'dark/positive/600'],
  'fg.positive.strong': ['positive/700', 'dark/positive/700'],
  'fg.primary.default': ['neutral/A900', 'white/A900'],
  'fg.primary.strong': ['neutral/A950', 'white/A900'],
  'fg.selected': ['primary/700', 'dark/primary/700'],
  'fg.strong': ['neutral/A900', 'white/A900'],
  'fg.stronger': ['neutral/A950', 'white/A950'],
  'fg.success.default': ['green/600', 'dark/green/600'],
  'fg.success.strong': ['green/700', 'dark/green/700'],
  'fg.thumb': ['neutral/A900', 'white/A950'],
  'fg.warning.default': ['amber/600', 'dark/amber/600'],
  'fg.warning.strong': ['amber/700', 'dark/amber/700'],
  'focus.caution.inner': ['caution/400', 'dark/caution/400'],
  'focus.caution.outer': ['caution/500', 'dark/caution/500'],
  'focus.contrast': ['neutral/A950', 'white/A900'],
  'focus.critical': ['critical/500', 'dark/critical/500'],
  'focus.inverse': ['bg.default', 'bg.default'],
  'focus.primary': ['blue/500', 'dark/blue/500'],
  'shadow.1.ambient': shadowOutput(1, 'ambient'),
  'shadow.1.key': shadowOutput(1, 'key'),
  'shadow.2.ambient': shadowOutput(2, 'ambient'),
  'shadow.2.key': shadowOutput(2, 'key'),
  'shadow.3.ambient': shadowOutput(3, 'ambient'),
  'shadow.3.key': shadowOutput(3, 'key'),
  'shadow.4.ambient': shadowOutput(4, 'ambient'),
  'shadow.4.key': shadowOutput(4, 'key'),
  'shadow.5.ambient': shadowOutput(5, 'ambient'),
  'shadow.5.key': shadowOutput(5, 'key'),
  'shadow.6.ambient': shadowOutput(6, 'ambient'),
  'shadow.6.key': shadowOutput(6, 'key'),
  'shadow.ambient': ['neutral/A100', 'white/A150'],
  'shadow.base': ['neutral/A200', 'white/A150'],
  'shadow.base.dark': ['dark-neutral/25', 'dark-neutral/25'],
  'shadow.base.light': ['black', 'black'],
  'surface.ai.default': ['blue/A100', 'dark/blue/A100'],
  'surface.ai.hover': ['blue/A200', 'dark/blue/A200'],
  'surface.ai.pressed': ['blue/400', 'dark/blue/400'],
  'surface.alt.default': ['neutral/A50', 'white/A50'],
  'surface.alt.strong': ['neutral/A100', 'white/A100'],
  'surface.caution.default': ['caution/A50', 'dark/caution/A100'],
  'surface.caution.strong': ['caution/A100', 'dark/caution/A200'],
  'surface.contrast.default': ['neutral/A900', 'dark/neutral/A900'],
  'surface.contrast.strong': ['neutral/950', 'dark/neutral/950'],
  'surface.critical.default': ['critical/A50', 'dark/critical/A100'],
  'surface.critical.strong': ['critical/A100', 'dark/critical/A200'],
  'surface.danger.default': ['red/A50', 'dark/red/A100'],
  'surface.danger.strong': ['red/A100', 'dark/red/A200'],
  'surface.default': ['white', 'dark/neutral/100'],
  'surface.elevated': ['', 'surface.default'],
  'surface.info.default': ['blue/A50', 'dark/blue/A100'],
  'surface.info.strong': ['blue/A100', 'dark/blue/A200'],
  'surface.inverse': ['bg.default', 'bg.default'],
  'surface.loading': ['neutral/A100', 'white/A100'],
  'surface.modal': ['white', 'dark/neutral/200'],
  'surface.navigation': ['bg.alt', 'bg.alt'],
  'surface.overlay.hover.default': ['neutral/A50', 'white/A50'],
  'surface.overlay.hover.inverse': ['white/A150', 'white/A200'],
  'surface.overlay.mixin': [
    'surface.overlay.hover.default',
    'surface.overlay.hover.default',
  ],
  'surface.overlay.pressed.default': ['neutral/A100', 'white/A100'],
  'surface.overlay.pressed.inverse': ['white/A200', 'white/A300'],
  'surface.overlay.raised': ['white/A300', 'white/A200'],
  'surface.overlay.scrim': ['neutral/A400', 'neutral/A500'],
  'surface.popover': ['white', 'dark/neutral/150'],
  'surface.positive.default': ['positive/A50', 'dark/positive/A100'],
  'surface.positive.strong': ['positive/A100', 'dark/positive/A200'],
  'surface.primary.default': ['primary/A50', 'dark/primary/A100'],
  'surface.primary.strong': ['primary/A100', 'dark/primary/A200'],
  'surface.raised': ['surface.default', 'surface.default'],
  'surface.selected': ['primary/A50', 'dark/primary/A50'],
  'surface.sheet': ['surface.popover', 'surface.popover'],
  'surface.success.default': ['green/A50', 'dark/green/A100'],
  'surface.success.strong': ['green/A100', 'dark/green/A200'],
  'surface.text.highlight': ['indigo/A200', 'dark/indigo/A200'],
  'surface.thumb': ['white', 'white/A200'],
  'surface.transparent': ['white/transparent', 'white/transparent'],
  'surface.warning.default': ['amber/A50', 'dark/amber/A100'],
  'surface.warning.strong': ['amber/A100', 'dark/amber/A200'],
  'switch.icon': ['neutral/A600', 'white/A700'],
  'switch.icon.checked': ['fg.default', 'fg.default'],
  'switch.thumb': ['surface.thumb', 'surface.thumb'],
  'switch.thumb.checked': ['fg.inverse', 'fg.inverse'],
  'switch.track': ['surface.overlay.raised', 'surface.overlay.raised'],
}

export const COLOR_ROLE_TOKENS: Record<ColorRoleGroup, ColorRoleToken[]> = {
  bg: tokens([
    ['bg.default', '--cnvs-sys-color-bg-default', 'Main background'],
    ['bg.alt', '--cnvs-sys-color-bg-alt-default', 'Alternate background'],
  ]),
  surface: tokens([
    [
      'surface.default',
      '--cnvs-sys-color-surface-default',
      'Cards, containers',
    ],
    [
      'surface.navigation',
      '--cnvs-sys-color-surface-navigation',
      'Sticky navigation',
    ],
    [
      'surface.popover',
      '--cnvs-sys-color-surface-popover',
      'Dropdowns, tooltips',
    ],
    ['surface.modal', '--cnvs-sys-color-surface-modal', 'Modal dialogs'],
    [
      'surface.raised',
      '--cnvs-sys-color-surface-raised',
      'Elevated containers',
    ],
    ['surface.sheet', '--cnvs-sys-color-surface-sheet', 'Sheet containers'],
    ['surface.elevated', '--cnvs-sys-color-surface-elevated', 'Elevated cards'],
    [
      'surface.alt.default',
      '--cnvs-sys-color-surface-alt-default',
      'Muted containers',
    ],
    [
      'surface.alt.strong',
      '--cnvs-sys-color-surface-alt-strong',
      'Stronger muted containers',
    ],
    ['surface.loading', '--cnvs-sys-color-surface-loading', 'Skeleton loaders'],
    [
      'surface.info.default',
      '--cnvs-sys-color-surface-info-default',
      'Info callouts',
    ],
    [
      'surface.info.strong',
      '--cnvs-sys-color-surface-info-strong',
      'Strong info callouts',
    ],
    [
      'surface.danger.default',
      '--cnvs-sys-color-surface-danger-default',
      'Error containers',
    ],
    [
      'surface.danger.strong',
      '--cnvs-sys-color-surface-danger-strong',
      'Strong error containers',
    ],
    [
      'surface.warning.default',
      '--cnvs-sys-color-surface-warning-default',
      'Warning containers',
    ],
    [
      'surface.warning.strong',
      '--cnvs-sys-color-surface-warning-strong',
      'Strong warning containers',
    ],
    [
      'surface.success.default',
      '--cnvs-sys-color-surface-success-default',
      'Success containers',
    ],
    [
      'surface.success.strong',
      '--cnvs-sys-color-surface-success-strong',
      'Strong success containers',
    ],
    [
      'surface.ai.default',
      '--cnvs-sys-color-surface-ai-default',
      'AI content surfaces',
    ],
    ['surface.ai.hover', '--cnvs-sys-color-surface-ai-hover', 'AI hover state'],
    [
      'surface.ai.pressed',
      '--cnvs-sys-color-surface-ai-pressed',
      'AI pressed state',
    ],
    [
      'surface.transparent',
      '--cnvs-sys-color-surface-transparent',
      'Transparent background',
    ],
    [
      'surface.inverse',
      '--cnvs-sys-color-surface-inverse',
      'Inverted containers',
    ],
    [
      'surface.contrast.default',
      '--cnvs-sys-color-surface-contrast-default',
      'High-contrast containers',
    ],
    [
      'surface.contrast.strong',
      '--cnvs-sys-color-surface-contrast-strong',
      'Strong contrast containers',
    ],
    [
      'surface.primary.default',
      '--cnvs-sys-color-brand-surface-primary-default',
      'Brand surfaces',
    ],
    [
      'surface.primary.strong',
      '--cnvs-sys-color-brand-surface-primary-strong',
      'Strong brand surfaces',
    ],
    [
      'surface.critical.default',
      '--cnvs-sys-color-brand-surface-critical-default',
      'Destructive surfaces',
    ],
    [
      'surface.critical.strong',
      '--cnvs-sys-color-brand-surface-critical-strong',
      'Strong destructive surfaces',
    ],
    [
      'surface.caution.default',
      '--cnvs-sys-color-brand-surface-caution-default',
      'Caution surfaces',
    ],
    [
      'surface.caution.strong',
      '--cnvs-sys-color-brand-surface-caution-strong',
      'Strong caution surfaces',
    ],
    [
      'surface.positive.default',
      '--cnvs-sys-color-brand-surface-positive-default',
      'Positive surfaces',
    ],
    [
      'surface.positive.strong',
      '--cnvs-sys-color-brand-surface-positive-strong',
      'Strong positive surfaces',
    ],
    [
      'surface.selected',
      '--cnvs-sys-color-brand-surface-selected',
      'Selected items',
    ],
    ['surface.thumb', '--cnvs-sys-color-surface-thumb'],
    ['surface.text.highlight', '--cnvs-sys-color-surface-text-highlight'],
  ]),
  accent: tokens([
    [
      'accent.primary',
      '--cnvs-sys-color-brand-accent-primary',
      'Main brand accent',
    ],
    ['accent.action', '--cnvs-sys-color-brand-accent-action'],
    [
      'accent.critical',
      '--cnvs-sys-color-brand-accent-critical',
      'Destructive accent',
    ],
    [
      'accent.caution',
      '--cnvs-sys-color-brand-accent-caution',
      'Caution accent',
    ],
    [
      'accent.positive',
      '--cnvs-sys-color-brand-accent-positive',
      'Positive accent',
    ],
    ['accent.ai', '--cnvs-sys-color-accent-ai', 'AI accent'],
    ['accent.info', '--cnvs-sys-color-accent-info', 'Info accent'],
    ['accent.danger', '--cnvs-sys-color-accent-danger', 'Danger accent'],
    ['accent.warning', '--cnvs-sys-color-accent-warning', 'Warning accent'],
    ['accent.success', '--cnvs-sys-color-accent-success', 'Success accent'],
    [
      'accent.contrast',
      '--cnvs-sys-color-accent-contrast',
      'High-contrast accent',
    ],
    ['accent.muted', '--cnvs-sys-color-accent-muted-default', 'Muted accent'],
    [
      'accent.muted-soft',
      '--cnvs-sys-color-accent-muted-soft',
      'Soft muted accent',
    ],
  ]),
  fg: tokens([
    ['fg.default', '--cnvs-sys-color-fg-default', 'Body text, icons'],
    ['fg.strong', '--cnvs-sys-color-fg-strong', 'Headings, labels'],
    ['fg.stronger', '--cnvs-sys-color-fg-stronger', 'Titles'],
    ['fg.disabled', '--cnvs-sys-color-fg-disabled', 'Disabled text'],
    [
      'fg.muted.default',
      '--cnvs-sys-color-fg-muted-default',
      'Hints, placeholders',
    ],
    [
      'fg.muted.strong',
      '--cnvs-sys-color-fg-muted-strong',
      'Strong secondary text',
    ],
    ['fg.inverse', '--cnvs-sys-color-fg-inverse', 'Inverted text'],
    ['fg.info.default', '--cnvs-sys-color-fg-info-default', 'Info text'],
    ['fg.info.strong', '--cnvs-sys-color-fg-info-strong', 'Strong info text'],
    ['fg.danger.default', '--cnvs-sys-color-fg-danger-default', 'Error text'],
    [
      'fg.danger.strong',
      '--cnvs-sys-color-fg-danger-strong',
      'Strong error text',
    ],
    [
      'fg.warning.default',
      '--cnvs-sys-color-fg-warning-default',
      'Warning text',
    ],
    [
      'fg.warning.strong',
      '--cnvs-sys-color-fg-warning-strong',
      'Strong warning text',
    ],
    [
      'fg.success.default',
      '--cnvs-sys-color-fg-success-default',
      'Success text',
    ],
    [
      'fg.success.strong',
      '--cnvs-sys-color-fg-success-strong',
      'Strong success text',
    ],
    ['fg.link.default', '--cnvs-sys-color-fg-link-default', 'Links'],
    ['fg.link.hover', '--cnvs-sys-color-fg-link-hover', 'Link hover'],
    ['fg.ai', '--cnvs-sys-color-fg-ai', 'AI text'],
    [
      'fg.contrast.default',
      '--cnvs-sys-color-fg-contrast-default',
      'High-contrast text',
    ],
    [
      'fg.contrast.strong',
      '--cnvs-sys-color-fg-contrast-strong',
      'Strong contrast text',
    ],
    [
      'fg.primary.default',
      '--cnvs-sys-color-brand-fg-primary-default',
      'Brand text',
    ],
    [
      'fg.primary.strong',
      '--cnvs-sys-color-brand-fg-primary-strong',
      'Strong brand text',
    ],
    [
      'fg.critical.default',
      '--cnvs-sys-color-brand-fg-critical-default',
      'Critical text',
    ],
    [
      'fg.critical.strong',
      '--cnvs-sys-color-brand-fg-critical-strong',
      'Strong critical text',
    ],
    [
      'fg.caution.default',
      '--cnvs-sys-color-brand-fg-caution-default',
      'Caution text',
    ],
    [
      'fg.caution.strong',
      '--cnvs-sys-color-brand-fg-caution-strong',
      'Strong caution text',
    ],
    [
      'fg.positive.default',
      '--cnvs-sys-color-brand-fg-positive-default',
      'Positive text',
    ],
    [
      'fg.positive.strong',
      '--cnvs-sys-color-brand-fg-positive-strong',
      'Strong positive text',
    ],
    ['fg.selected', '--cnvs-sys-color-brand-fg-selected', 'Selected item text'],
    ['fg.thumb', '--cnvs-sys-color-fg-thumb'],
  ]),
  border: tokens([
    [
      'border.default',
      '--cnvs-sys-color-border-default',
      'Dividers, containers',
    ],
    ['border.strong', '--cnvs-sys-color-border-strong', 'Strong borders'],
    ['border.elevated', '--cnvs-sys-color-border-elevated'],
    ['border.input', '--cnvs-sys-color-border-input-default', 'Input borders'],
    [
      'border.input-hover',
      '--cnvs-sys-color-border-input-hover',
      'Input hover borders',
    ],
    ['border.info', '--cnvs-sys-color-border-info', 'Info borders'],
    ['border.danger', '--cnvs-sys-color-border-danger', 'Error borders'],
    ['border.warning', '--cnvs-sys-color-border-warning', 'Warning borders'],
    ['border.ai', '--cnvs-sys-color-border-ai'],
    [
      'border.inverse',
      '--cnvs-sys-color-border-inverse-default',
      'Inverted borders',
    ],
    [
      'border.inverse-strong',
      '--cnvs-sys-color-border-inverse-strong',
      'Strong inverted borders',
    ],
    [
      'border.contrast',
      '--cnvs-sys-color-border-contrast-default',
      'High-contrast borders',
    ],
    [
      'border.transparent',
      '--cnvs-sys-color-border-transparent',
      'Invisible spacer',
    ],
    [
      'border.primary',
      '--cnvs-sys-color-brand-border-primary',
      'Focus, brand border',
    ],
    [
      'border.critical',
      '--cnvs-sys-color-brand-border-critical',
      'Critical borders',
    ],
    [
      'border.caution',
      '--cnvs-sys-color-brand-border-caution',
      'Caution borders',
    ],
    ['border.thumb', '--cnvs-sys-color-border-thumb'],
  ]),
  focus: tokens([
    [
      'focus.inverse',
      '--cnvs-sys-color-focus-inverse',
      'Focus on inverse fills',
    ],
    [
      'focus.contrast',
      '--cnvs-sys-color-focus-contrast',
      'High-contrast focus',
    ],
    [
      'focus.primary',
      '--cnvs-sys-color-brand-focus-primary',
      'Default focus ring',
    ],
    [
      'focus.critical',
      '--cnvs-sys-color-brand-focus-critical',
      'Critical focus ring',
    ],
    [
      'focus.caution.outer',
      '--cnvs-sys-color-brand-focus-caution-outer',
      'Caution focus outer',
    ],
    [
      'focus.caution.inner',
      '--cnvs-sys-color-brand-focus-caution-inner',
      'Caution focus inner',
    ],
  ]),
  switch: tokens([
    ['switch.track', '--cnvs-sys-color-switch-track-default', 'Switch track'],
    ['switch.thumb', '--cnvs-sys-color-switch-thumb-default', 'Switch thumb'],
    [
      'switch.thumb.checked',
      '--cnvs-sys-color-switch-thumb-checked',
      'Checked thumb',
    ],
    ['switch.icon', '--cnvs-sys-color-switch-icon-default', 'Track icon'],
    [
      'switch.icon.checked',
      '--cnvs-sys-color-switch-icon-checked',
      'Checked icon',
    ],
  ]),
  shadow: tokens([
    ['shadow.base', '--cnvs-sys-color-shadow-base', 'Primary shadow'],
    ['shadow.ambient', '--cnvs-sys-color-shadow-ambient', 'Ambient shadow'],
    [
      'shadow.base.light',
      '--cnvs-sys-color-shadow-base-light',
      'Light-mode ink',
    ],
    ['shadow.base.dark', '--cnvs-sys-color-shadow-base-dark', 'Dark-mode ink'],
    ['shadow.1.key', '--cnvs-sys-color-shadow-1-key', 'Depth 1 key'],
    [
      'shadow.1.ambient',
      '--cnvs-sys-color-shadow-1-ambient',
      'Depth 1 ambient',
    ],
    ['shadow.2.key', '--cnvs-sys-color-shadow-2-key', 'Depth 2 key'],
    [
      'shadow.2.ambient',
      '--cnvs-sys-color-shadow-2-ambient',
      'Depth 2 ambient',
    ],
    ['shadow.3.key', '--cnvs-sys-color-shadow-3-key', 'Depth 3 key'],
    [
      'shadow.3.ambient',
      '--cnvs-sys-color-shadow-3-ambient',
      'Depth 3 ambient',
    ],
    ['shadow.4.key', '--cnvs-sys-color-shadow-4-key', 'Depth 4 key'],
    [
      'shadow.4.ambient',
      '--cnvs-sys-color-shadow-4-ambient',
      'Depth 4 ambient',
    ],
    ['shadow.5.key', '--cnvs-sys-color-shadow-5-key', 'Depth 5 key'],
    [
      'shadow.5.ambient',
      '--cnvs-sys-color-shadow-5-ambient',
      'Depth 5 ambient',
    ],
    ['shadow.6.key', '--cnvs-sys-color-shadow-6-key', 'Depth 6 key'],
    [
      'shadow.6.ambient',
      '--cnvs-sys-color-shadow-6-ambient',
      'Depth 6 ambient',
    ],
  ]),
  overlay: tokens([
    [
      'surface.overlay.hover.default',
      '--cnvs-sys-color-surface-overlay-hover-default',
      'Hover overlay',
    ],
    [
      'surface.overlay.hover.inverse',
      '--cnvs-sys-color-surface-overlay-hover-inverse',
      'Inverse hover overlay',
    ],
    [
      'surface.overlay.pressed.default',
      '--cnvs-sys-color-surface-overlay-pressed-default',
      'Pressed overlay',
    ],
    [
      'surface.overlay.pressed.inverse',
      '--cnvs-sys-color-surface-overlay-pressed-inverse',
      'Inverse pressed overlay',
    ],
    [
      'surface.overlay.mixin',
      '--cnvs-sys-color-surface-overlay-mixin',
      'Overlay mixin',
    ],
    ['surface.overlay.raised', '--cnvs-sys-color-surface-overlay-raised'],
    [
      'surface.overlay.scrim',
      '--cnvs-sys-color-surface-overlay-scrim',
      'Modal scrim',
    ],
    [
      'accent.overlay.hover',
      '--cnvs-sys-color-accent-overlay-hover',
      'Accent hover overlay',
    ],
    [
      'accent.overlay.pressed',
      '--cnvs-sys-color-accent-overlay-pressed',
      'Accent pressed overlay',
    ],
    [
      'accent.overlay.mixin',
      '--cnvs-sys-color-accent-overlay-mixin',
      'Accent overlay mixin',
    ],
  ]),
}

export function isColorRoleGroup(value: string): value is ColorRoleGroup {
  return value in COLOR_ROLE_TOKENS
}

export function colorRoleCaption(group: ColorRoleGroup): string {
  switch (group) {
    case 'bg':
      return 'Background colors'
    case 'surface':
      return 'Surface colors'
    case 'accent':
      return 'Accent colors'
    case 'fg':
      return 'Foreground colors'
    case 'border':
      return 'Border colors'
    case 'focus':
      return 'Focus colors'
    case 'switch':
      return 'Switch colors'
    case 'shadow':
      return 'Shadow colors'
    case 'overlay':
      return 'State overlay colors'
    default: {
      const _exhaustive: never = group
      return _exhaustive
    }
  }
}
