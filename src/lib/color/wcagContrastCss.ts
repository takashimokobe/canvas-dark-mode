import { srgbFromOklch } from '@/lib/color/darkRemap'

export type CssRgba = { r: number; g: number; b: number; a: number }

function channelToUnit(value: string) {
  const trimmed = value.trim()
  if (trimmed.endsWith('%')) {
    return Number(trimmed.slice(0, -1)) / 100
  }

  const number = Number(trimmed)
  if (!Number.isFinite(number)) {
    return undefined
  }

  return number / 255
}

function alphaToUnit(value: string | undefined) {
  if (value == null || value.trim() === '') {
    return 1
  }

  const trimmed = value.trim()
  if (trimmed.endsWith('%')) {
    return Number(trimmed.slice(0, -1)) / 100
  }

  const number = Number(trimmed)
  return Number.isFinite(number) ? number : 1
}

function parseRgbFunction(color: string): CssRgba | undefined {
  const modern = color.match(
    /^rgba?\(\s*([\d.%]+)\s+([\d.%]+)\s+([\d.%]+)(?:\s*\/\s*([\d.%]+))?\s*\)$/i,
  )
  if (modern) {
    const r = channelToUnit(modern[1])
    const g = channelToUnit(modern[2])
    const b = channelToUnit(modern[3])
    if (r == null || g == null || b == null) {
      return undefined
    }

    return { r, g, b, a: alphaToUnit(modern[4]) }
  }

  const legacy = color.match(
    /^rgba?\(\s*([\d.%]+)\s*,\s*([\d.%]+)\s*,\s*([\d.%]+)(?:\s*,\s*([\d.%]+))?\s*\)$/i,
  )
  if (!legacy) {
    return undefined
  }

  const r = channelToUnit(legacy[1])
  const g = channelToUnit(legacy[2])
  const b = channelToUnit(legacy[3])
  if (r == null || g == null || b == null) {
    return undefined
  }

  return { r, g, b, a: alphaToUnit(legacy[4]) }
}

function parseColorSrgb(color: string): CssRgba | undefined {
  const match = color.match(
    /^color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.%]+))?\s*\)$/i,
  )
  if (!match) {
    return undefined
  }

  const r = Number(match[1])
  const g = Number(match[2])
  const b = Number(match[3])
  if (![r, g, b].every(Number.isFinite)) {
    return undefined
  }

  return { r, g, b, a: alphaToUnit(match[4]) }
}

function parseViaCanvas(color: string): CssRgba | undefined {
  if (typeof document === 'undefined') {
    return undefined
  }

  try {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const context =
      canvas.getContext('2d', { colorSpace: 'srgb' }) ?? canvas.getContext('2d')
    if (!context) {
      return undefined
    }

    context.fillStyle = color
    const fromFillStyle = parseRgbFunction(String(context.fillStyle))
    if (fromFillStyle) {
      return fromFillStyle
    }

    context.clearRect(0, 0, 1, 1)
    context.fillRect(0, 0, 1, 1)
    const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data
    return { r: r / 255, g: g / 255, b: b / 255, a: a / 255 }
  } catch {
    return undefined
  }
}

function parseOklchFunction(color: string): CssRgba | undefined {
  const match = color.match(
    /^oklch\(\s*([\d.]+%?|none)\s+([\d.]+%?|none)\s+(-?[\d.]+(?:deg)?|none)(?:\s*\/\s*([\d.%]+))?\s*\)$/i,
  )
  if (!match) {
    return undefined
  }

  const lToken = match[1]
  const cToken = match[2]
  const hToken = match[3]
  const l =
    lToken === 'none'
      ? 0
      : lToken.endsWith('%')
        ? Number(lToken.slice(0, -1)) / 100
        : Number(lToken)
  const c =
    cToken === 'none'
      ? 0
      : cToken.endsWith('%')
        ? (Number(cToken.slice(0, -1)) / 100) * 0.4
        : Number(cToken)
  const h = hToken === 'none' ? 0 : Number(hToken.replace(/deg$/i, ''))

  if (![l, c, h].every(Number.isFinite)) {
    return undefined
  }

  const [r, g, b] = srgbFromOklch({ l, c, h })
  return { r, g, b, a: alphaToUnit(match[4]) }
}

/** Parse a computed CSS color into 0–1 sRGB plus alpha. */
export function parseCssRgba(color: string): CssRgba | undefined {
  return (
    parseRgbFunction(color) ??
    parseColorSrgb(color) ??
    parseOklchFunction(color) ??
    parseViaCanvas(color)
  )
}

function relativeLuminance({ r, g, b }: CssRgba) {
  const linear = (channel: number) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4

  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

function composite(fg: CssRgba, bg: CssRgba): CssRgba {
  const a = fg.a + bg.a * (1 - fg.a)
  if (a <= 0) {
    return { r: bg.r, g: bg.g, b: bg.b, a: 0 }
  }

  const mix = (f: number, b: number) => (f * fg.a + b * bg.a * (1 - fg.a)) / a
  return {
    r: mix(fg.r, bg.r),
    g: mix(fg.g, bg.g),
    b: mix(fg.b, bg.b),
    a,
  }
}

export function wcagContrastFromCssColors(
  foreground: string,
  background: string,
  backdrop?: string,
) {
  const fg = parseCssRgba(foreground)
  const bg = parseCssRgba(background)
  if (!fg || !bg) {
    return undefined
  }

  const base = backdrop ? parseCssRgba(backdrop) : undefined
  const paintedBg =
    bg.a + 1e-6 < 1 && base ? composite(bg, { ...base, a: 1 }) : bg
  const paintedFg = composite(fg, paintedBg)
  const hi = Math.max(
    relativeLuminance(paintedFg),
    relativeLuminance(paintedBg),
  )
  const lo = Math.min(
    relativeLuminance(paintedFg),
    relativeLuminance(paintedBg),
  )
  return (hi + 0.05) / (lo + 0.05)
}
