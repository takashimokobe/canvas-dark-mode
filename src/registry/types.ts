import type { ComponentType } from 'react'

export const CANVAS_KIT_PACKAGES = ['react', 'preview', 'labs'] as const

export type CanvasKitPackage = (typeof CANVAS_KIT_PACKAGES)[number]

export const CANVAS_KIT_CATEGORIES = [
  'actions',
  'inputs',
  'containers',
  'navigation',
  'popups',
  'text',
  'layout',
  'feedback',
  'data',
  'ai',
] as const

export type CanvasKitCategory = (typeof CANVAS_KIT_CATEGORIES)[number]

export const CANVAS_KIT_SLUGS = [
  'action-bar',
  'ai-ingress-button',
  'avatar',
  'badge',
  'banner',
  'box',
  'breadcrumbs',
  'button',
  'card',
  'checkbox',
  'color-picker',
  'combobox',
  'dialog',
  'divider',
  'expandable',
  'flex',
  'form-field',
  'grid',
  'information-highlight',
  'kbd',
  'loading-dots',
  'loading-sparkles',
  'menu',
  'modal',
  'multi-select',
  'pagination',
  'pill',
  'popup',
  'radio',
  'segmented-control',
  'select',
  'side-panel',
  'skeleton',
  'status-indicator',
  'switch',
  'table',
  'tabs',
  'text',
  'text-area',
  'text-input',
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
}

export type CanvasKitSpecimen = ComponentType<CanvasKitSpecimenProps>
