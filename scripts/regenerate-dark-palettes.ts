import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  DEFAULT_PARAMS,
  applyDarkTokensToCss,
  auditDarkPalettes,
  generatePalettes,
  type PaletteSource,
  type RemapParams,
} from '../src/lib/color/darkRemap.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BASE = path.join(ROOT, 'src/styles/base')
const INDEX = path.join(BASE, 'index.css')

async function readSources(dir: string): Promise<PaletteSource[]> {
  const files = (await readdir(dir))
    .filter((name) => name.endsWith('.css'))
    .sort()

  return Promise.all(
    files.map(async (name) => ({
      sourcePath: path.join(dir, name),
      css: await readFile(path.join(dir, name), 'utf8'),
    })),
  )
}

function withExponent(exponent: number): RemapParams {
  return { ...DEFAULT_PARAMS, darkLExponent: exponent }
}

async function main() {
  const paletteDir = path.join(BASE, 'palette')
  const tenantDir = path.join(BASE, 'tenant')
  const palettes = await readSources(paletteDir)
  const tenants = await readSources(tenantDir)
  const sources = [...palettes, ...tenants]
  const neutralCss =
    palettes.find((source) => source.sourcePath.endsWith('/neutral.css'))?.css ??
    ''
  const slateCss =
    palettes.find((source) => source.sourcePath.endsWith('/slate.css'))?.css ??
    ''
  const keys = { neutralCss, slateCss }

  let chosen = DEFAULT_PARAMS.darkLExponent
  let generation = generatePalettes(withExponent(chosen), sources, keys)
  let audit = auditDarkPalettes(generation.palettes)

  const sweep = [1.0, 1.1, 1.2, 1.3, 1.4, 1.5]
  for (const exponent of sweep) {
    const next = generatePalettes(withExponent(exponent), sources, keys)
    const nextAudit = auditDarkPalettes(next.palettes)
    const ok = nextAudit.fails.length === 0
    const worst = nextAudit.fails
      .slice()
      .sort((a, b) => a.ratio / a.target - b.ratio / b.target)[0]
    console.log(
      `exponent ${exponent.toFixed(1)}  fails ${nextAudit.fails.length}` +
        (worst
          ? `  worst ${worst.family} ${worst.a}/${worst.b} ${worst.ratio.toFixed(2)}:1 need ${worst.target}`
          : ''),
    )
    if (ok) {
      chosen = exponent
      generation = next
      audit = nextAudit
      break
    }
    generation = next
    audit = nextAudit
    chosen = exponent
  }

  if (audit.fails.length > 0) {
    console.error('No exponent in 1.0–1.5 cleared the dark contrast contract.')
    for (const fail of audit.fails.slice(0, 20)) {
      console.error(
        `  ${fail.family} ${fail.a}/${fail.b} Δ${fail.diff} ${fail.ratio.toFixed(2)}:1 < ${fail.target} (${fail.kind})`,
      )
    }
    process.exit(1)
  }

  const params = withExponent(chosen)
  generation = generatePalettes(params, sources, keys)
  audit = auditDarkPalettes(generation.palettes)

  for (const source of sources) {
    const next = applyDarkTokensToCss(source.css, generation.generatedValues)
    if (next !== source.css) {
      await writeFile(source.sourcePath, next)
      console.log(`wrote ${path.relative(ROOT, source.sourcePath)}`)
    }
  }

  const indexCss = await readFile(INDEX, 'utf8')
  const nextIndex = indexCss.replace(
    /--dark-l-exponent:\s*[\d.]+;/,
    `--dark-l-exponent: ${chosen};`,
  )
  if (nextIndex !== indexCss) {
    await writeFile(INDEX, nextIndex)
    console.log(`wrote ${path.relative(ROOT, INDEX)}`)
  }

  const remapPath = path.join(ROOT, 'src/lib/color/darkRemap.ts')
  const remapSrc = await readFile(remapPath, 'utf8')
  const nextRemap = remapSrc.replace(
    /darkLExponent: [\d.]+,/,
    `darkLExponent: ${chosen},`,
  )
  if (nextRemap !== remapSrc) {
    await writeFile(remapPath, nextRemap)
    console.log(`wrote ${path.relative(ROOT, remapPath)}`)
  }
}

await main()
