export type Oklch = { l: number; c: number; h: number }
export type LightSolid = Oklch & { name: string }
export type RemapParams = {
  chromaFactor: number
  darkAnchorL: number
  darkMaxL: number
  lLightMin: number
  lLightMax: number
  darkLExponent: number
  darkChromaTaper: number
  darkBgAltGap: number
  darkBgTargetL: number
  darkSurfaceStepDelta: number
  darkAccentHuePreserve: number
}

export type PaletteSource = {
  sourcePath: string
  css: string
}

export type GeneratedPalette = {
  sourcePath: string
  name: string
  sourceCss: string
  lines: string[]
  darkSolidMap: Map<number, Oklch>
}

export type ContrastFail = {
  family: string
  a: number
  b: number
  diff: number
  ratio: number
  target: number
  kind: 'text' | 'nontext'
}

export const PALETTE_PREFIX = 'cnvs-base-palette-'
export const DARK_BG_STEP = 50
export const DARK_ZONE_A_STEPS = [25, 50, 100, 150, 200]
export const DARK_CHROMA_PEAK_STEP = 500
/** Canvas amber exception: chroma peaks at 300–400, and caution fills live at 400. */
export const DARK_CHROMA_PEAK_BY_FAMILY: Record<string, number> = {
  amber: 400,
}
/** Envelope floor for steps above the chroma peak. Prevents 900–975 from
 *  collapsing to Neutral; still well below a neon fill. */
export const DARK_CHROMA_ENVELOPE_FLOOR = 0.6
/** After 700 (L ≈ 0.78), cap absolute chroma so 800–975 stay pastels on
 *  dark-neutral-50. Remaining-gamut % makes green/teal glow while blue
 *  stays quiet. 600 is the accent fill and is not capped. */
export const DARK_HIGH_L_CHROMA_START = 0.775
export const DARK_HIGH_L_CHROMA_AT_START = 0.08
export const DARK_HIGH_L_CHROMA_AT_MAX = 0.035
export const CHROMATIC_ALPHA_MAX = 300
export const FULL_ALPHA_FAMILIES = new Set(['neutral', 'slate'])
const ALPHA_FLOOR = 0.02

export const DEFAULT_PARAMS: RemapParams = {
  chromaFactor: 0.9,
  darkAnchorL: 0.193,
  darkMaxL: 0.97,
  lLightMin: 0.19,
  lLightMax: 0.99,
  darkLExponent: 1.1,
  darkChromaTaper: 0.75,
  darkBgAltGap: 0.03,
  darkBgTargetL: 0.18,
  darkSurfaceStepDelta: 0.04,
  darkAccentHuePreserve: 0.15,
}

export const PARAM_CSS_NAMES: Record<keyof RemapParams, string> = {
  chromaFactor: 'chroma-factor',
  darkAnchorL: 'dark-anchor-l',
  darkMaxL: 'dark-max-l',
  lLightMin: 'l-light-min',
  lLightMax: 'l-light-max',
  darkLExponent: 'dark-l-exponent',
  darkChromaTaper: 'dark-chroma-taper',
  darkBgAltGap: 'dark-bg-alt-gap',
  darkBgTargetL: 'dark-bg-target-l',
  darkSurfaceStepDelta: 'dark-surface-step-delta',
  darkAccentHuePreserve: 'dark-accent-hue-preserve',
}

export function familyOf(name: string) {
  return name.startsWith(PALETTE_PREFIX)
    ? name.slice(PALETTE_PREFIX.length)
    : name
}

export function darkNameOf(name: string) {
  return name.startsWith(PALETTE_PREFIX)
    ? `${PALETTE_PREFIX}dark-${familyOf(name)}`
    : `dark-${name}`
}

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function srgbFromLinear(channel: number) {
  return channel <= 0.0031308
    ? 12.92 * channel
    : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055
}

function linearFromSrgb(channel: number) {
  return channel <= 0.04045
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4)
}

function linearSrgbFromOklch({ l, c, h }: Oklch) {
  const hr = (h * Math.PI) / 180
  const a = c * Math.cos(hr)
  const b = c * Math.sin(hr)
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b
  const lc = l_ ** 3
  const mc = m_ ** 3
  const sc = s_ ** 3
  return [
    4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc,
    -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc,
    -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc,
  ]
}

function isInSrgbGamut(color: Oklch, epsilon = 1e-5) {
  return linearSrgbFromOklch(color).every(
    (channel) => channel >= -epsilon && channel <= 1 + epsilon,
  )
}

export function maxChromaAt(l: number, h: number) {
  let lo = 0
  let hi = 0.4
  if (isInSrgbGamut({ l, c: hi, h })) return hi
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    if (isInSrgbGamut({ l, c: mid, h })) lo = mid
    else hi = mid
  }
  return lo
}

export function srgbFromOklch(color: Oklch) {
  return linearSrgbFromOklch(color).map((channel) =>
    clamp01(srgbFromLinear(channel)),
  )
}

export function oklchFromSrgb([r, g, blue]: number[]): Oklch {
  const rl = linearFromSrgb(r)
  const gl = linearFromSrgb(g)
  const bl = linearFromSrgb(blue)
  const lc = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl
  const mc = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl
  const sc = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl
  const l_ = Math.cbrt(lc)
  const m_ = Math.cbrt(mc)
  const s_ = Math.cbrt(sc)
  const l = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
  const bStar = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_
  const c = Math.hypot(a, bStar)
  let h = (Math.atan2(bStar, a) * 180) / Math.PI
  if (h < 0) h += 360
  return { l, c, h: c < 1e-6 ? 0 : h }
}

export function remapDarkL(l: number, params: RemapParams) {
  const norm = clamp01(
    (l - params.lLightMin) / (params.lLightMax - params.lLightMin),
  )
  return (
    params.darkAnchorL +
    (params.darkMaxL - params.darkAnchorL) *
      Math.pow(norm, params.darkLExponent)
  )
}

function remapDark({ l, c, h }: Oklch, params: RemapParams): Oklch {
  return { l: remapDarkL(l, params), c, h }
}

function solveOverlay(target: number[], bg: number[]) {
  let aMin = 0
  for (let i = 0; i < 3; i++) {
    const t = target[i]
    const b = bg[i]
    if (t > b) aMin = Math.max(aMin, b >= 1 ? 1 : (t - b) / (1 - b))
    else if (t < b) aMin = Math.max(aMin, b <= 0 ? 1 : (b - t) / b)
  }
  const alpha = Math.min(1, Math.max(ALPHA_FLOOR, Math.ceil(aMin * 1e4) / 1e4))
  const overlay = target.map((t, i) =>
    clamp01((t - (1 - alpha) * bg[i]) / alpha),
  )
  return { overlay, alpha }
}

function trimNumber(value: number, digits: number) {
  return Number(value.toFixed(digits)).toString()
}

export function formatOklch({ l, c, h }: Oklch) {
  const chroma = Number(c.toFixed(4))
  return `oklch(${trimNumber(l, 4)} ${trimNumber(chroma, 4)} ${chroma === 0 ? 0 : trimNumber(h, 2)})`
}

function formatOklchAlpha(srgb: number[], alpha: number) {
  const { l, c, h } = oklchFromSrgb(srgb)
  const parts = `${trimNumber(l, 4)} ${trimNumber(c, 4)} ${trimNumber(h, 2)}`
  return alpha >= 0.9995
    ? `oklch(${parts})`
    : `oklch(${parts} / ${trimNumber(alpha, 4)})`
}

export function formatParam(value: number) {
  return Number(value.toFixed(3)).toString()
}

function blendHue(from: number, to: number, weight: number) {
  const delta = ((to - from + 540) % 360) - 180
  return (from + delta * weight + 360) % 360
}

function chromaPeakStep(steps: number[], preferred = DARK_CHROMA_PEAK_STEP) {
  return steps.includes(preferred)
    ? preferred
    : steps.reduce((best, candidate) =>
        Math.abs(candidate - preferred) < Math.abs(best - preferred)
          ? candidate
          : best,
      )
}

function chromaPeakForFamily(family: string, steps: number[]) {
  const key = familyOf(family)
  return chromaPeakStep(
    steps,
    DARK_CHROMA_PEAK_BY_FAMILY[key] ?? DARK_CHROMA_PEAK_STEP,
  )
}

function chromaPeakDistance(step: number, steps: number[], peak: number) {
  const min = Math.min(...steps)
  const max = Math.max(...steps)
  const span = step <= peak ? peak - min : max - peak
  if (span === 0) return 0
  return Math.abs(step - peak) / span
}

function chromaEnvelope(
  step: number,
  steps: number[],
  taper: number,
  peak: number,
) {
  const t = chromaPeakDistance(step, steps, peak)
  const endTaper = step > peak ? taper : taper * 0.65
  const envelope = Math.max(0, 1 - endTaper * t ** 2)
  if (step > peak) return Math.max(DARK_CHROMA_ENVELOPE_FLOOR, envelope)
  return envelope
}

function capChromaOnDarkPage(l: number, c: number, maxL: number) {
  if (l <= DARK_HIGH_L_CHROMA_START) return c
  const t = clamp01(
    (l - DARK_HIGH_L_CHROMA_START) / (maxL - DARK_HIGH_L_CHROMA_START),
  )
  const cap =
    DARK_HIGH_L_CHROMA_AT_START * (1 - t) + DARK_HIGH_L_CHROMA_AT_MAX * t
  return Math.min(c, cap)
}

function familyPeakChromaPercent(
  solids: Map<number, LightSolid>,
  peakStep: number,
) {
  const peak =
    solids.get(peakStep) ??
    [...solids.values()].reduce((best, color) =>
      color.c > best.c ? color : best,
    )
  const maxC = maxChromaAt(peak.l, peak.h)
  return maxC < 1e-6 ? 0 : clamp01(peak.c / maxC)
}

function zoneAL(step: number, params: RemapParams) {
  if (step < DARK_BG_STEP) return params.darkBgTargetL - params.darkBgAltGap
  const bgIndex = DARK_ZONE_A_STEPS.indexOf(DARK_BG_STEP)
  const stepsAboveBg = DARK_ZONE_A_STEPS.indexOf(step) - bgIndex
  return params.darkBgTargetL + stepsAboveBg * params.darkSurfaceStepDelta
}

function buildDarkLightnessSpine(
  steps: number[],
  reversed: number[],
  spineSolids: Map<number, LightSolid>,
  params: RemapParams,
) {
  const remapped = new Map(
    steps.map((step, i) => {
      const source = spineSolids.get(reversed[i])
      if (!source)
        throw new Error(`Missing light solid for step ${reversed[i]}`)
      return [step, remapDarkL(source.l, params)]
    }),
  )

  const zoneATop = DARK_ZONE_A_STEPS[DARK_ZONE_A_STEPS.length - 1]
  const zoneATopL = zoneAL(zoneATop, params)
  const remappedTop = remapped.get(zoneATop)
  const remappedMax = remapped.get(Math.max(...steps))
  if (remappedTop === undefined || remappedMax === undefined) {
    throw new Error('Dark lightness spine is missing zone endpoints')
  }

  const next = new Map<number, number>()
  for (const step of steps) {
    const sourceL = remapped.get(step)
    if (sourceL === undefined) continue
    if (DARK_ZONE_A_STEPS.includes(step)) {
      next.set(step, zoneAL(step, params))
    } else {
      const t = (sourceL - remappedTop) / (remappedMax - remappedTop)
      next.set(step, zoneATopL + t * (remappedMax - zoneATopL))
    }
  }
  return next
}

function buildAuthoredNeutralDarkSolids(
  steps: number[],
  reversed: number[],
  solids: Map<number, LightSolid>,
  params: RemapParams,
) {
  const remapped = new Map(
    steps.map((step, i) => {
      const source = solids.get(reversed[i])
      if (!source)
        throw new Error(`Missing light solid for step ${reversed[i]}`)
      return [step, remapDark(source, params)]
    }),
  )
  const lightness = buildDarkLightnessSpine(steps, reversed, solids, params)

  const next = new Map<number, Oklch>()
  for (const step of steps) {
    const source = remapped.get(step)
    const l = lightness.get(step)
    if (!source || l === undefined) continue
    next.set(step, { ...source, l })
  }
  return next
}

function buildChromaticDarkSolids(
  steps: number[],
  reversed: number[],
  solids: Map<number, LightSolid>,
  params: RemapParams,
  canonicalSolids: Map<number, LightSolid>,
  family: string,
) {
  const peakStep = chromaPeakForFamily(family, steps)
  const peakPercent = clamp01(
    familyPeakChromaPercent(solids, peakStep) * params.chromaFactor,
  )
  const peakSolid = solids.get(peakStep) ?? solids.values().next().value
  if (!peakSolid) throw new Error('Chromatic family has no solids')
  const baseHue = peakSolid.h
  const lightness = buildDarkLightnessSpine(
    steps,
    reversed,
    canonicalSolids,
    params,
  )

  const raw = new Map<number, Oklch>()
  for (const [i, step] of steps.entries()) {
    const l = lightness.get(step)
    const sameStep = solids.get(step)
    const spine = canonicalSolids.get(reversed[i]) ?? solids.get(reversed[i])
    if (l === undefined || !sameStep || !spine) continue
    const h = blendHue(baseHue, sameStep.h, params.darkAccentHuePreserve)
    const cPct =
      peakPercent *
      chromaEnvelope(step, steps, params.darkChromaTaper, peakStep)
    const c = capChromaOnDarkPage(l, cPct * maxChromaAt(l, h), params.darkMaxL)
    raw.set(step, { l, c, h })
  }

  const ordered = [...steps].sort((a, b) => a - b)
  const peakIndex = ordered.indexOf(peakStep)
  const falloff = 0.98
  for (let i = peakIndex + 1; i < ordered.length; i++) {
    const prev = raw.get(ordered[i - 1])
    const cur = raw.get(ordered[i])
    if (prev && cur) cur.c = Math.min(cur.c, prev.c * falloff)
  }
  for (let i = peakIndex - 1; i >= 0; i--) {
    const prev = raw.get(ordered[i + 1])
    const cur = raw.get(ordered[i])
    if (prev && cur) cur.c = Math.min(cur.c, prev.c * falloff)
  }
  return raw
}

export function parseLightSolidsByFamily(css: string) {
  const byName = new Map<string, Map<number, LightSolid>>()
  const re = /--([a-z-]+?)-(\d+):\s*oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/g
  let match
  while ((match = re.exec(css)) !== null) {
    const [, name, step, l, c, h] = match
    if (name.includes('dark-') || name.endsWith('-A')) continue
    let solids = byName.get(name)
    if (!solids) {
      solids = new Map()
      byName.set(name, solids)
    }
    solids.set(Number(step), {
      name,
      l: Number(l),
      c: Number(c),
      h: Number(h),
    })
  }
  return byName
}

export function parseLightSolids(css: string) {
  const solids = new Map<number, LightSolid>()
  for (const [, familySolids] of parseLightSolidsByFamily(css)) {
    for (const [step, value] of familySolids) {
      solids.set(step, value)
    }
  }
  return solids
}

export function parseDecls(css: string, prefix: string) {
  const values = new Map<number, string>()
  const re = new RegExp(`--${prefix}-(\\d+):\\s*([^;]+);`, 'g')
  let match
  while ((match = re.exec(css)) !== null) {
    values.set(Number(match[1]), match[2].trim())
  }
  return values
}

export function parseAlphaDecls(css: string, prefix: string) {
  const values = new Map<number, string>()
  const re = new RegExp(`--${prefix}-A(\\d+):\\s*([^;]+);`, 'g')
  let match
  while ((match = re.exec(css)) !== null) {
    values.set(Number(match[1]), match[2].trim())
  }
  return values
}

function darkBgFromNeutralSolids(
  solids: Map<number, LightSolid>,
  params: RemapParams,
) {
  const steps = [...solids.keys()].sort((a, b) => a - b)
  const reversed = [...steps].reverse()
  const darkSolids = buildAuthoredNeutralDarkSolids(
    steps,
    reversed,
    solids,
    params,
  )
  const bg = darkSolids.get(DARK_BG_STEP)
  if (!bg) throw new Error('Dark background step is missing')
  return srgbFromOklch(bg)
}

function buildGeneratedLines(
  solids: Map<number, LightSolid>,
  params: RemapParams,
  darkBg: number[],
  canonicalSolids: Map<number, LightSolid>,
) {
  const first = solids.values().next().value
  if (!first) throw new Error('No light solids to expand')
  const name = first.name
  const family = familyOf(name)
  const white = [1, 1, 1]
  const steps = [...solids.keys()].sort((a, b) => a - b)
  const reversed = [...steps].reverse()
  const darkName = darkNameOf(name)
  const alphaSteps = FULL_ALPHA_FAMILIES.has(family)
    ? steps
    : steps.filter((step) => step <= CHROMATIC_ALPHA_MAX)

  const darkSolidMap = FULL_ALPHA_FAMILIES.has(family)
    ? buildAuthoredNeutralDarkSolids(steps, reversed, solids, params)
    : buildChromaticDarkSolids(
        steps,
        reversed,
        solids,
        params,
        canonicalSolids,
        family,
      )

  const lines: string[] = []
  for (const step of steps) {
    const color = darkSolidMap.get(step)
    if (color) lines.push(`  --${darkName}-${step}: ${formatOklch(color)};`)
  }
  for (const step of alphaSteps) {
    const solid = solids.get(step)
    if (!solid) continue
    const { overlay, alpha } = solveOverlay(srgbFromOklch(solid), white)
    lines.push(`  --${name}-A${step}: ${formatOklchAlpha(overlay, alpha)};`)
  }
  for (const step of alphaSteps) {
    const color = darkSolidMap.get(step)
    if (!color) continue
    const { overlay, alpha } = solveOverlay(srgbFromOklch(color), darkBg)
    lines.push(`  --${darkName}-A${step}: ${formatOklchAlpha(overlay, alpha)};`)
  }

  return { name, family, darkSolidMap, lines }
}

export function generatePalettes(
  params: RemapParams,
  sources: PaletteSource[],
  keys: { neutralCss: string; slateCss: string },
) {
  const neutralSolids = parseLightSolids(keys.neutralCss)
  const slateSolids = parseLightSolids(keys.slateCss)
  const darkBgs = {
    neutral: darkBgFromNeutralSolids(neutralSolids, params),
    slate: darkBgFromNeutralSolids(slateSolids, params),
  }

  const palettes: GeneratedPalette[] = []

  for (const source of sources) {
    if (source.sourcePath.endsWith('/white.css')) continue
    for (const [name, solids] of parseLightSolidsByFamily(source.css)) {
      const isSlate = name === `${PALETTE_PREFIX}slate` || name === 'slate'
      const generated = buildGeneratedLines(
        solids,
        params,
        isSlate ? darkBgs.slate : darkBgs.neutral,
        neutralSolids,
      )
      palettes.push({
        sourcePath: source.sourcePath,
        name,
        sourceCss: source.css,
        lines: generated.lines,
        darkSolidMap: generated.darkSolidMap,
      })
    }
  }

  const generatedValues = new Map<string, string>()
  for (const palette of palettes) {
    for (const line of palette.lines) {
      const match = line.match(/^\s*(--[a-zA-Z0-9-]+):\s*([^;]+);/)
      if (match) generatedValues.set(match[1], match[2].trim())
    }
  }

  return { palettes, generatedValues }
}

function relativeLuminance(srgb: number[]) {
  const lin = (channel: number) =>
    channel <= 0.04045
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)

  return 0.2126 * lin(srgb[0]) + 0.7152 * lin(srgb[1]) + 0.0722 * lin(srgb[2])
}

export function wcagContrast(a: Oklch, b: Oklch) {
  const light = relativeLuminance(srgbFromOklch(a))
  const dark = relativeLuminance(srgbFromOklch(b))
  const hi = Math.max(light, dark)
  const lo = Math.min(light, dark)
  return (hi + 0.05) / (lo + 0.05)
}

export function auditDarkFamily(
  family: string,
  darkSolidMap: Map<number, Oklch>,
) {
  const steps = [...darkSolidMap.keys()].sort((a, b) => a - b)
  const fails: ContrastFail[] = []

  for (let i = 0; i < steps.length; i++) {
    for (let j = i + 1; j < steps.length; j++) {
      const a = steps[i]
      const b = steps[j]
      const left = darkSolidMap.get(a)
      const right = darkSolidMap.get(b)
      if (!left || !right) continue
      const diff = b - a
      const ratio = wcagContrast(left, right)

      if (diff >= 500 && ratio + 1e-9 < 4.5) {
        fails.push({
          family,
          a,
          b,
          diff,
          ratio,
          target: 4.5,
          kind: 'text',
        })
      }

      if (diff >= 400 && a >= 200 && ratio + 1e-9 < 3) {
        fails.push({
          family,
          a,
          b,
          diff,
          ratio,
          target: 3,
          kind: 'nontext',
        })
      }
    }
  }

  return fails
}

export function auditDarkPalettes(palettes: GeneratedPalette[]) {
  const fails: ContrastFail[] = palettes.flatMap((palette) =>
    auditDarkFamily(palette.name, palette.darkSolidMap),
  )

  return {
    fails,
    fail500: fails.filter((fail) => fail.kind === 'text'),
    fail400: fails.filter((fail) => fail.kind === 'nontext'),
  }
}

export function isDarkCustomProperty(name: string) {
  return name.startsWith('--dark-') || name.includes('-dark-')
}

export function applyDarkTokensToCss(
  css: string,
  generatedValues: Map<string, string>,
) {
  return css.replace(
    /^(\s*)(--[a-zA-Z0-9-]+):\s*([^;]+);/gm,
    (full, indent: string, name: string) => {
      if (!isDarkCustomProperty(name)) return full
      const next = generatedValues.get(name)
      return next ? `${indent}${name}: ${next};` : full
    },
  )
}
