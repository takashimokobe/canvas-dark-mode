import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { ExternalHyperlink } from '@workday/canvas-kit-react/button'
import {
  SegmentedControl,
  useSegmentedControlModel,
} from '@workday/canvas-kit-react/segmented-control'
import { moonIcon, sunIcon } from '@workday/canvas-system-icons-web'
import { BRAND_ICONS } from '@/registry/brandIcon'
import { CanvasKitSpecimenView } from '@/registry/specimens'
import { CATEGORY_LABELS, getCanvasKitByCategory } from '@/registry/index'
import { CANVAS_KIT_CATEGORIES } from '@/registry/types'
import type { CanvasKitEntry, CanvasKitSlug } from '@/registry/types'
import {
  BRANDS,
  formatBrandLabel,
  isBrand,
  useBrand,
  useMode,
} from '@/lib/rootPreferences'

import styles from './index.module.css'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ title: 'Canvas Kit · Canvas Tokens' }],
  }),
  component: RouteComponent,
})

const WIDE_SLUGS = new Set<CanvasKitSlug>([
  'action-bar',
  'banner',
  'breadcrumbs',
  'button',
  'information-highlight',
  'pagination',
  'side-panel',
  'table',
  'tabs',
  'toast',
])

function ModeControl() {
  const { mode, setMode } = useMode()
  const modeRef = useRef(mode)
  modeRef.current = mode

  const model = useSegmentedControlModel({
    initialValue: mode,
    size: 'small',
    onSelect({ id }: { id: string }) {
      if ((id === 'light' || id === 'dark') && id !== modeRef.current) {
        setMode(id)
      }
    },
  })

  // Sync when OS preference changes.
  const { selectedIds } = model.state
  const { select } = model.events
  useEffect(() => {
    if (selectedIds !== 'all' && selectedIds[0] !== mode) {
      select({ id: mode })
    }
  }, [mode, selectedIds, select])

  return (
    <SegmentedControl model={model}>
      <SegmentedControl.List aria-label="Color scheme">
        <SegmentedControl.Item
          data-id="light"
          icon={sunIcon}
          tooltipProps={{ title: 'Light' }}
        />
        <SegmentedControl.Item
          data-id="dark"
          icon={moonIcon}
          tooltipProps={{ title: 'Dark' }}
        />
      </SegmentedControl.List>
    </SegmentedControl>
  )
}

type PageBackground = 'default' | 'alt'

function BrandControl() {
  const { brand, setBrand } = useBrand()
  const brandRef = useRef(brand)
  brandRef.current = brand

  const model = useSegmentedControlModel({
    initialValue: brand,
    size: 'small',
    onSelect({ id }: { id: string }) {
      if (isBrand(id) && id !== brandRef.current) {
        setBrand(id)
      }
    },
  })

  const { selectedIds } = model.state
  const { select } = model.events
  useEffect(() => {
    if (selectedIds !== 'all' && selectedIds[0] !== brand) {
      select({ id: brand })
    }
  }, [brand, selectedIds, select])

  return (
    <SegmentedControl model={model}>
      <SegmentedControl.List aria-label="Brand">
        {BRANDS.map((item) => (
          <SegmentedControl.Item
            key={item}
            data-id={item}
            icon={BRAND_ICONS[item]}
            tooltipProps={{ title: formatBrandLabel(item) }}
          />
        ))}
      </SegmentedControl.List>
    </SegmentedControl>
  )
}

function BackgroundControl() {
  // Body default is bg-alt; "default" is an inline override.
  const [background, setBackground] = useState<PageBackground>('alt')

  const model = useSegmentedControlModel({
    initialValue: 'alt',
    size: 'small',
    onSelect({ id }: { id: string }) {
      if (id === 'default' || id === 'alt') {
        setBackground(id)
      }
    },
  })

  useEffect(() => {
    document.body.style.backgroundColor =
      background === 'default' ? 'var(--cnvs-sys-color-bg-default)' : ''
    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [background])

  return (
    <SegmentedControl model={model}>
      <SegmentedControl.List aria-label="Page background">
        <SegmentedControl.Item data-id="default">Default</SegmentedControl.Item>
        <SegmentedControl.Item data-id="alt">Alt</SegmentedControl.Item>
      </SegmentedControl.List>
    </SegmentedControl>
  )
}

const TNUM_ROWS = ['111111', '808080', '999111']
const TNUM_VARIANTS = [
  { label: 'tabular-nums off', value: 'normal' },
  { label: 'tabular-nums on', value: 'tabular-nums' },
] as const

/** Inline `fontVariantNumeric` so the off panel can escape the global `tnum` rule. */
function TabularNumsCard() {
  return (
    <article className={styles.Card}>
      <header className={styles.CardHeader}>
        <h3 className={styles.CardName}>Tabular Numerals</h3>
      </header>
      <div className={styles.CardStage}>
        {TNUM_VARIANTS.map((variant) => (
          <div key={variant.value} className={styles.TnumPanel}>
            <p className={styles.TnumLabel}>{variant.label}</p>
            {TNUM_ROWS.map((row) => (
              <div key={row} className={styles.TnumRow}>
                {[...row].map((digit, index) => (
                  <span
                    key={index}
                    style={{ fontVariantNumeric: variant.value }}
                  >
                    {digit}
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </article>
  )
}

function SpecimenCard({ entry }: { entry: CanvasKitEntry }) {
  const cardClassName = WIDE_SLUGS.has(entry.slug)
    ? `${styles.Card} ${styles.CardWide}`
    : styles.Card

  return (
    <article className={cardClassName}>
      <header className={styles.CardHeader}>
        <h3 className={styles.CardName}>{entry.name}</h3>
        <ExternalHyperlink
          href={entry.storybookUrl}
          aria-label={`${entry.name} in Canvas Kit Storybook`}
          cs={{
            font: 'var(--cnvs-sys-type-subtext-lg)',
            letterSpacing: 'var(--cnvs-sys-letter-spacing-subtext-lg)',
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          Storybook
        </ExternalHyperlink>
      </header>
      <div className={styles.CardStage}>
        <CanvasKitSpecimenView entry={entry} />
      </div>
    </article>
  )
}

function RouteComponent() {
  return (
    <div className={styles.Page}>
      <header className={styles.Header}>
        <h1 className={styles.Title}>Canvas Kit</h1>
        <div className={styles.Controls}>
          <BrandControl />
          <BackgroundControl />
          <ModeControl />
        </div>
      </header>

      <main className={styles.Sections}>
        {CANVAS_KIT_CATEGORIES.map((category) => (
          <section
            key={category}
            className={styles.Category}
            aria-labelledby={`category-${category}-heading`}
          >
            <h2
              id={`category-${category}-heading`}
              className={styles.CategoryTitle}
            >
              {CATEGORY_LABELS[category]}
            </h2>
            <div className={styles.Grid}>
              {getCanvasKitByCategory(category).map((entry) => (
                <SpecimenCard key={entry.slug} entry={entry} />
              ))}
              {category === 'text' && <TabularNumsCard />}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
