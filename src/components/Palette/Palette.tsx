import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Divider } from '@workday/canvas-kit-preview-react'
import { Switch } from '@workday/canvas-kit-preview-react/switch'
import { FormField } from '@workday/canvas-kit-react/form-field'
import { SystemIcon } from '@workday/canvas-kit-react/icon'

import {
  BRANDS,
  formatBrandLabel,
  useBrand,
  useMode,
} from '@/lib/rootPreferences'
import type { Brand, Mode } from '@/lib/rootPreferences'
import { BRAND_ICONS } from '@/registry/brandIcon'

import styles from './Palette.module.css'

const CHIP_ICON_SIZE = 16
const SCHEME_ICON_SIZE = 20

function BrandMark({ brand, size }: { brand: Brand; size: number }) {
  return (
    <span className={styles.BrandIcon} aria-hidden>
      <SystemIcon icon={BRAND_ICONS[brand]} size={size} color="currentColor" />
    </span>
  )
}

const CHROME_STEPS = [
  25, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950, 975,
] as const

const CHROMATIC_STEPS = [
  25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 975,
] as const

const CHROMATIC_ALPHA = [25, 50, 100, 200, 300] as const

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

type Layer = 'base' | 'brand'

type Family = {
  name: string
  layer: Layer
  solids?: readonly number[]
  alphas: readonly number[]
  paired: boolean
}

const BRAND_FAMILIES: readonly Family[] = [
  {
    name: 'primary',
    layer: 'brand',
    solids: CHROMATIC_STEPS,
    alphas: CHROMATIC_ALPHA,
    paired: true,
  },
  {
    name: 'critical',
    layer: 'brand',
    solids: CHROMATIC_STEPS,
    alphas: CHROMATIC_ALPHA,
    paired: true,
  },
  {
    name: 'neutral',
    layer: 'brand',
    solids: CHROME_STEPS,
    alphas: CHROME_STEPS,
    paired: true,
  },
  {
    name: 'caution',
    layer: 'brand',
    solids: CHROMATIC_STEPS,
    alphas: CHROMATIC_ALPHA,
    paired: true,
  },
  {
    name: 'positive',
    layer: 'brand',
    solids: CHROMATIC_STEPS,
    alphas: CHROMATIC_ALPHA,
    paired: true,
  },
]

const BASE_FAMILIES: readonly Family[] = [
  {
    name: 'neutral',
    layer: 'base',
    solids: CHROME_STEPS,
    alphas: CHROME_STEPS,
    paired: true,
  },
  {
    name: 'slate',
    layer: 'base',
    solids: CHROME_STEPS,
    alphas: CHROME_STEPS,
    paired: true,
  },
  ...CHROMATIC_FAMILIES.map(
    (name): Family => ({
      name,
      layer: 'base',
      solids: CHROMATIC_STEPS,
      alphas: CHROMATIC_ALPHA,
      paired: true,
    }),
  ),
  {
    name: 'white',
    layer: 'base',
    alphas: CHROME_STEPS,
    paired: false,
  },
]

const GROUPS = [
  { title: 'Brand', families: BRAND_FAMILIES },
  { title: 'Base', families: BASE_FAMILIES },
] as const

const COPIED_MS = 1600

function shade(step: number, alpha: boolean) {
  return alpha ? `A${step}` : String(step)
}

function tokenName(
  family: string,
  layer: Layer,
  step: number,
  mode: Mode,
  alpha: boolean,
  paired: boolean,
) {
  const key = shade(step, alpha)
  const dark = paired && mode === 'dark' ? 'dark-' : ''

  switch (layer) {
    case 'brand':
      return `--cnvs-brand-${dark}${family}-${key}`
    case 'base':
      return `--cnvs-base-palette-${dark}${family}-${key}`
    default: {
      const unreachable: never = layer
      return unreachable
    }
  }
}

function tokenFill(
  family: string,
  layer: Layer,
  step: number,
  alpha: boolean,
  paired: boolean,
) {
  const key = shade(step, alpha)

  switch (layer) {
    case 'brand':
      return paired
        ? `light-dark(var(--cnvs-brand-${family}-${key}), var(--cnvs-brand-dark-${family}-${key}))`
        : `var(--cnvs-brand-${family}-${key})`
    case 'base':
      return paired
        ? `light-dark(var(--cnvs-base-palette-${family}-${key}), var(--cnvs-base-palette-dark-${family}-${key}))`
        : `var(--cnvs-base-palette-${family}-${key})`
    default: {
      const unreachable: never = layer
      return unreachable
    }
  }
}

function familyLabel(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export function Palette() {
  const { mode } = useMode()
  const { brand, setBrand } = useBrand()
  const liveId = useId()
  const [copied, setCopied] = useState<string | null>(null)
  const [alpha, setAlpha] = useState(false)
  const timeoutRef = useRef(0)

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current)
  }, [])

  const copy = (name: string) => {
    setCopied(name)
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setCopied(null), COPIED_MS)
    void navigator.clipboard.writeText(name)
  }

  return (
    <article className={styles.Root}>
      <header className={styles.Header}>
        <h1 className={styles.Title}>Palette</h1>
        <p className={styles.Lead}>
          <BrandMark brand={brand} size={SCHEME_ICON_SIZE} />
          {formatBrandLabel(brand)} · {mode} {alpha ? 'alpha' : 'solid'} ramps
        </p>
        <Divider
          cs={{
            marginBlockEnd: 'var(--cnvs-sys-padding-lg)',
            borderColor: 'var(--cnvs-sys-color-border-default)',
            borderWidth: '2px',
          }}
        />
        <div className={styles.Toolbar}>
          <fieldset className={styles.Brands} aria-label="Brand">
            <div className={styles.BrandList}>
              {BRANDS.map((item) => {
                const selected = brand === item

                return (
                  <label
                    key={item}
                    className={styles.Brand}
                    data-selected={selected || undefined}
                  >
                    <input
                      className={styles.BrandInput}
                      type="radio"
                      name="palette-brand"
                      value={item}
                      checked={selected}
                      onChange={() => setBrand(item)}
                    />
                    <BrandMark brand={item} size={CHIP_ICON_SIZE} />
                    {formatBrandLabel(item)}
                  </label>
                )
              })}
            </div>
          </fieldset>
          <FormField orientation="horizontalStart" className={styles.Alpha}>
            <FormField.Label>Alpha</FormField.Label>
            <FormField.Field>
              <FormField.Input
                as={Switch}
                checked={alpha}
                onChange={() => setAlpha(!alpha)}
              />
            </FormField.Field>
          </FormField>
        </div>
      </header>

      <div id={liveId} className={styles.Live} aria-live="polite">
        {copied ? `Copied ${copied}` : ''}
      </div>

      <div className={styles.Groups}>
        {GROUPS.map((group) => (
          <section key={group.title} className={styles.Group}>
            <h2 className={styles.GroupTitle}>{group.title}</h2>
            <div className={styles.Scales}>
              {group.families.map((family) => {
                const steps = alpha ? family.alphas : family.solids
                if (!steps) {
                  return null
                }

                return (
                  <section
                    key={`${family.layer}-${family.name}`}
                    className={styles.Family}
                    style={
                      {
                        '--_columns': String(steps.length),
                      } as CSSProperties
                    }
                  >
                    <div className={styles.Row}>
                      <h3 className={styles.FamilyName}>
                        {familyLabel(family.name)}
                      </h3>
                      <Ramp
                        family={family.name}
                        layer={family.layer}
                        steps={steps}
                        mode={mode}
                        paired={family.paired}
                        alpha={alpha}
                        copied={copied}
                        onCopy={copy}
                      />
                    </div>
                  </section>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}

function Ramp({
  family,
  layer,
  steps,
  mode,
  paired,
  alpha = false,
  copied,
  onCopy,
}: {
  family: string
  layer: Layer
  steps: readonly number[]
  mode: Mode
  paired: boolean
  alpha?: boolean
  copied: string | null
  onCopy: (name: string) => void
}) {
  return (
    <div className={styles.Cells} data-alpha={alpha || undefined} role="list">
      {steps.map((step) => {
        const name = tokenName(family, layer, step, mode, alpha, paired)
        const fill = tokenFill(family, layer, step, alpha, paired)
        const isCopied = copied === name

        return (
          <div key={name} className={styles.Cell} role="listitem">
            <button
              type="button"
              className={styles.Swatch}
              aria-label={isCopied ? `Copied ${name}` : `Copy ${name}`}
              onClick={() => onCopy(name)}
            >
              <span
                className={styles.Fill}
                style={{ backgroundColor: fill }}
              />
            </button>
            <span className={styles.Step} aria-hidden>
              {alpha ? `A${step}` : step}
            </span>
          </div>
        )
      })}
    </div>
  )
}
