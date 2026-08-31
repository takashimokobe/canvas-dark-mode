import type { ReactNode } from 'react'

import { Container } from '@/components/Container'
import type {
  ContainerScheme,
  ContainerSurface,
} from '@/components/Container/Container'
import { isBrand, useMode } from '@/lib/rootPreferences'
import type { Brand, Mode } from '@/lib/rootPreferences'
import { getCanvasKit } from '@/registry/index'
import { CanvasKitSpecimenView } from '@/registry/specimens'
import type { CanvasKitSlug } from '@/registry/types'
import { CANVAS_KIT_SLUGS } from '@/registry/types'

import styles from './Specimen.module.css'

function isCanvasKitSlug(value: string): value is CanvasKitSlug {
  return (CANVAS_KIT_SLUGS as readonly string[]).includes(value)
}

function requireSlug(slug: string): CanvasKitSlug {
  if (!isCanvasKitSlug(slug)) {
    throw new Error(`Unknown Canvas Kit slug: ${slug}`)
  }
  return slug
}

function isMode(value: string): value is Mode {
  return value === 'light' || value === 'dark'
}

function parseBrand(value: string | undefined): Brand | undefined {
  if (value === undefined) return undefined
  if (!isBrand(value)) {
    throw new Error(`Unknown brand: ${value}`)
  }
  return value
}

function parseMode(value: string | undefined): Mode | undefined {
  if (value === undefined) return undefined
  if (!isMode(value)) {
    throw new Error(`Unknown mode: ${value}`)
  }
  return value
}

function SpecimenView({ slug, mode }: { slug: CanvasKitSlug; mode?: Mode }) {
  const { mode: currentMode } = useMode()
  const scheme: ContainerScheme = mode ?? currentMode

  return (
    <div className={styles.Sample}>
      <CanvasKitSpecimenView entry={getCanvasKit(slug)} scheme={scheme} />
    </div>
  )
}

function stageSurface(slug: CanvasKitSlug): ContainerSurface {
  if (slug === 'card' || slug === 'side-panel') {
    return 'alt'
  }
  return 'theme'
}

function Stage({
  label,
  brand,
  mode,
  surface,
  children,
}: {
  label: string
  brand?: Brand
  mode?: Mode
  surface?: ContainerSurface
  children: ReactNode
}) {
  return (
    <div className={styles.Stage}>
      <Container
        align="wide"
        aria-label={label}
        brand={brand}
        mode={mode}
        surface={surface}
      >
        {children}
      </Container>
    </div>
  )
}

export function Specimen({
  slug,
  brand,
  mode,
  framed = true,
}: {
  slug: string
  brand?: string
  mode?: string
  framed?: boolean
}) {
  const id = requireSlug(slug)
  const resolvedBrand = parseBrand(brand)
  const resolvedMode = parseMode(mode)
  const view = <SpecimenView slug={id} mode={resolvedMode} />

  if (!framed) {
    return view
  }

  return (
    <Stage
      label={getCanvasKit(id).name}
      brand={resolvedBrand}
      mode={resolvedMode}
      surface={stageSurface(id)}
    >
      {view}
    </Stage>
  )
}

export function SpecimenGroup({
  slugs,
  brand,
  mode,
}: {
  slugs: string
  brand?: string
  mode?: string
}) {
  const ids = slugs.split(',').map((item) => requireSlug(item.trim()))
  const resolvedBrand = parseBrand(brand)
  const resolvedMode = parseMode(mode)

  return (
    <Stage
      label="Feedback components"
      brand={resolvedBrand}
      mode={resolvedMode}
    >
      <div className={styles.Group}>
        {ids.map((id) => (
          <div key={id} className={styles.Item}>
            <SpecimenView slug={id} mode={resolvedMode} />
          </div>
        ))}
      </div>
    </Stage>
  )
}
