import { useId } from 'react'
import type { CSSProperties } from 'react'

import styles from './ContrastPairs.module.css'

type PairGround = number | 'default'

const PAIRS: {
  bg: PairGround
  fg: number
  ratio: string
  compliance: string
}[] = [
  { bg: 'default', fg: 500, ratio: '3:1', compliance: 'AA non-text' },
  { bg: 'default', fg: 600, ratio: '4.5:1', compliance: 'AA text' },
  { bg: 100, fg: 600, ratio: '4.5:1', compliance: 'AA text' },
  { bg: 200, fg: 600, ratio: '3:1', compliance: 'AA non-text' },
  { bg: 100, fg: 700, ratio: '7:1', compliance: 'AAA text' },
]

function blueStep(step: number, scheme: 'light' | 'dark') {
  if (scheme === 'dark') {
    return `var(--cnvs-base-palette-dark-blue-${step})`
  }

  return `var(--cnvs-base-palette-blue-${step})`
}

function groundPaint(bg: PairGround) {
  if (bg === 'default') {
    return 'var(--cnvs-sys-color-bg-default)'
  }

  return `light-dark(${blueStep(bg, 'light')}, ${blueStep(bg, 'dark')})`
}

function groundLabel(bg: PairGround) {
  return bg === 'default' ? 'bg-default' : String(bg)
}

function pairStyle(bg: PairGround, fg: number): CSSProperties {
  return {
    '--pair-bg': groundPaint(bg),
    '--pair-fg': `light-dark(${blueStep(fg, 'light')}, ${blueStep(fg, 'dark')})`,
  } as CSSProperties
}

export function ContrastPairs() {
  const captionId = useId()

  return (
    <div className={styles.Wrap}>
      <table className={styles.Table} aria-labelledby={captionId}>
        <caption id={captionId} className={styles.Caption}>
          Contrast pairings on the blue ramp. The same step differences hold for
          every family.
        </caption>
        <thead>
          <tr>
            <th className={styles.PairHead} scope="col">
              Pair
            </th>
            <th scope="col">Background</th>
            <th scope="col">Foreground</th>
            <th className={styles.NumHead} scope="col">
              Difference
            </th>
            <th className={styles.NumHead} scope="col">
              Target
            </th>
            <th scope="col">Compliance</th>
          </tr>
        </thead>
        <tbody>
          {PAIRS.map((pair) => (
            <tr key={`${pair.bg}-${pair.fg}`}>
              <td className={styles.PairCell}>
                <span
                  className={styles.Pair}
                  style={pairStyle(pair.bg, pair.fg)}
                >
                  <span aria-hidden>Ag</span>
                </span>
              </td>
              <th className={styles.StepCell} scope="row">
                {groundLabel(pair.bg)}
              </th>
              <td className={styles.StepCell}>{pair.fg}</td>
              <td className={styles.NumCell}>
                {pair.bg === 'default' ? '—' : pair.fg - pair.bg}
              </td>
              <td className={styles.NumCell}>{pair.ratio}</td>
              <td className={styles.LevelCell}>{pair.compliance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
