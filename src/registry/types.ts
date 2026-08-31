import type { ComponentType } from 'react'
import type { ContainerScheme } from '@/components/Container'

export const CANVAS_KIT_PACKAGES = ['react', 'preview', 'labs'] as const

export type CanvasKitPackage = (typeof CANVAS_KIT_PACKAGES)[number]

export const CANVAS_KIT_CATEGORIES = [
  'actions',
  'inputs',
  'containers',
  'navigation',
  'popups',
  'layout',
  'feedback',
  'data',
  'ai',
] as const

export type CanvasKitCategory = (typeof CANVAS_KIT_CATEGORIES)[number]

export const CANVAS_KIT_SLUGS = [
  'action-bar',
  'avatar',
  'badge',
  'banner',
  'breadcrumbs',
  'button',
  'card',
  'checkbox',
  'divider',
  'expandable',
  'form-field',
  'information-highlight',
  'loading-dots',
  'loading-sparkles',
  'pill',
  'radio',
  'segmented-control',
  'side-panel',
  'skeleton',
  'status-indicator',
  'switch',
  'table',
  'tabs',
  'toast',
  'tooltip',
] as const

export type CanvasKitSlug = (typeof CANVAS_KIT_SLUGS)[number]

export type CanvasKitEntry = {
  slug: CanvasKitSlug
  name: string
  package: CanvasKitPackage
  importPath: string
  category: CanvasKitCategory
  storybookPath: string
  storybookUrl: string
}

export type CanvasKitSpecimenProps = {
  entry: CanvasKitEntry
  scheme: ContainerScheme
}

export type CanvasKitSpecimen = ComponentType<CanvasKitSpecimenProps>
