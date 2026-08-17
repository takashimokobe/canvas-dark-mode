import {
  CANVAS_KIT_SLUGS,
  type CanvasKitCategory,
  type CanvasKitEntry,
  type CanvasKitPackage,
  type CanvasKitSlug,
} from './types'

const STORYBOOK_BASE = 'https://workday.github.io/canvas-kit/?path=/docs'

type RegistrySeed = {
  slug: CanvasKitSlug
  name: string
  package: CanvasKitPackage
  module: string
  category: CanvasKitCategory
  storybookPath: string
}

function importPath(pkg: CanvasKitPackage, module: string) {
  switch (pkg) {
    case 'react':
      return `@workday/canvas-kit-react/${module}`
    case 'preview':
      return `@workday/canvas-kit-preview-react/${module}`
    case 'labs':
      return `@workday/canvas-kit-labs-react/${module}`
  }
}

function entry(seed: RegistrySeed): CanvasKitEntry {
  return {
    slug: seed.slug,
    name: seed.name,
    package: seed.package,
    importPath: importPath(seed.package, seed.module),
    category: seed.category,
    storybookPath: seed.storybookPath,
    storybookUrl: `${STORYBOOK_BASE}/${seed.storybookPath}--docs`,
  }
}

const registrySeeds: RegistrySeed[] = [
  {
    slug: 'action-bar',
    name: 'Action Bar',
    package: 'react',
    module: 'action-bar',
    category: 'navigation',
    storybookPath: 'components-action-bar',
  },
  {
    slug: 'ai-ingress-button',
    name: 'AI Ingress Button',
    package: 'labs',
    module: 'ai-ingress-button',
    category: 'ai',
    storybookPath: 'labs-ai-ingress-button-(ai)',
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    package: 'react',
    module: 'avatar',
    category: 'containers',
    storybookPath: 'components-avatar-(promoted)',
  },
  {
    slug: 'badge',
    name: 'Badge',
    package: 'react',
    module: 'badge',
    category: 'containers',
    storybookPath: 'components-countbadge',
  },
  {
    slug: 'banner',
    name: 'Banner',
    package: 'react',
    module: 'banner',
    category: 'feedback',
    storybookPath: 'components-banner',
  },
  {
    slug: 'box',
    name: 'Box',
    package: 'react',
    module: 'layout',
    category: 'layout',
    storybookPath: 'components-box',
  },
  {
    slug: 'breadcrumbs',
    name: 'Breadcrumbs',
    package: 'react',
    module: 'breadcrumbs',
    category: 'navigation',
    storybookPath: 'components-breadcrumbs',
  },
  {
    slug: 'button',
    name: 'Button',
    package: 'react',
    module: 'button',
    category: 'actions',
    storybookPath: 'components-buttons',
  },
  {
    slug: 'card',
    name: 'Card',
    package: 'react',
    module: 'card',
    category: 'containers',
    storybookPath: 'components-card',
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    package: 'react',
    module: 'checkbox',
    category: 'inputs',
    storybookPath: 'components-checkbox',
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    package: 'preview',
    module: 'color-picker',
    category: 'inputs',
    storybookPath: 'preview-inputs-color-input',
  },
  {
    slug: 'combobox',
    name: 'Combobox',
    package: 'react',
    module: 'combobox',
    category: 'inputs',
    storybookPath: 'components-select',
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    package: 'react',
    module: 'dialog',
    category: 'popups',
    storybookPath: 'components-dialog',
  },
  {
    slug: 'divider',
    name: 'Divider',
    package: 'preview',
    module: 'divider',
    category: 'layout',
    storybookPath: 'preview-layout-divider',
  },
  {
    slug: 'expandable',
    name: 'Expandable',
    package: 'react',
    module: 'expandable',
    category: 'containers',
    storybookPath: 'components-expandable',
  },
  {
    slug: 'flex',
    name: 'Flex',
    package: 'react',
    module: 'layout',
    category: 'layout',
    storybookPath: 'components-flex',
  },
  {
    slug: 'form-field',
    name: 'Form Field',
    package: 'react',
    module: 'form-field',
    category: 'inputs',
    storybookPath: 'components-form-field',
  },
  {
    slug: 'grid',
    name: 'Grid',
    package: 'react',
    module: 'layout',
    category: 'layout',
    storybookPath: 'components-grid',
  },
  {
    slug: 'information-highlight',
    name: 'Information Highlight',
    package: 'react',
    module: 'information-highlight',
    category: 'feedback',
    storybookPath: 'components-information-highlight',
  },
  {
    slug: 'kbd',
    name: 'Kbd',
    package: 'labs',
    module: 'kbd',
    category: 'text',
    storybookPath: 'labs-kbd',
  },
  {
    slug: 'loading-dots',
    name: 'Loading Dots',
    package: 'react',
    module: 'loading-dots',
    category: 'feedback',
    storybookPath: 'components-loading-dots',
  },
  {
    slug: 'loading-sparkles',
    name: 'Loading Sparkles',
    package: 'preview',
    module: 'loading-sparkles',
    category: 'ai',
    storybookPath: 'preview-ai-loading-sparkles-(ai)',
  },
  {
    slug: 'menu',
    name: 'Menu',
    package: 'react',
    module: 'menu',
    category: 'popups',
    storybookPath: 'components-menu',
  },
  {
    slug: 'modal',
    name: 'Modal',
    package: 'react',
    module: 'modal',
    category: 'popups',
    storybookPath: 'components-modal',
  },
  {
    slug: 'multi-select',
    name: 'Multi Select',
    package: 'preview',
    module: 'multi-select',
    category: 'inputs',
    storybookPath: 'preview-inputs-multiselect',
  },
  {
    slug: 'pagination',
    name: 'Pagination',
    package: 'react',
    module: 'pagination',
    category: 'navigation',
    storybookPath: 'components-pagination',
  },
  {
    slug: 'pill',
    name: 'Pill',
    package: 'react',
    module: 'pill',
    category: 'containers',
    storybookPath: 'components-pill',
  },
  {
    slug: 'popup',
    name: 'Popup',
    package: 'react',
    module: 'popup',
    category: 'popups',
    storybookPath: 'components-popup',
  },
  {
    slug: 'radio',
    name: 'Radio',
    package: 'preview',
    module: 'radio',
    category: 'inputs',
    storybookPath: 'preview-inputs-radio',
  },
  {
    slug: 'segmented-control',
    name: 'Segmented Control',
    package: 'react',
    module: 'segmented-control',
    category: 'inputs',
    storybookPath: 'components-segmented-control',
  },
  {
    slug: 'select',
    name: 'Select',
    package: 'react',
    module: 'select',
    category: 'inputs',
    storybookPath: 'components-select',
  },
  {
    slug: 'side-panel',
    name: 'Side Panel',
    package: 'preview',
    module: 'side-panel',
    category: 'containers',
    storybookPath: 'preview-containers-side-panel-(new)',
  },
  {
    slug: 'skeleton',
    name: 'Skeleton',
    package: 'react',
    module: 'skeleton',
    category: 'feedback',
    storybookPath: 'components-skeleton',
  },
  {
    slug: 'status-indicator',
    name: 'Status Indicator',
    package: 'preview',
    module: 'status-indicator',
    category: 'feedback',
    storybookPath: 'preview-status-indicator',
  },
  {
    slug: 'switch',
    name: 'Switch',
    package: 'preview',
    module: 'switch',
    category: 'inputs',
    storybookPath: 'preview-inputs-switch-(new)',
  },
  {
    slug: 'table',
    name: 'Table',
    package: 'react',
    module: 'table',
    category: 'data',
    storybookPath: 'components-table',
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    package: 'preview',
    module: 'tabs',
    category: 'navigation',
    storybookPath: 'preview-navigation-tabs',
  },
  {
    slug: 'text',
    name: 'Text',
    package: 'react',
    module: 'text',
    category: 'text',
    storybookPath: 'components-body-text',
  },
  {
    slug: 'text-area',
    name: 'Text Area',
    package: 'react',
    module: 'text-area',
    category: 'inputs',
    storybookPath: 'components-textarea',
  },
  {
    slug: 'text-input',
    name: 'Text Input',
    package: 'react',
    module: 'text-input',
    category: 'inputs',
    storybookPath: 'components-text-input',
  },
  {
    slug: 'toast',
    name: 'Toast',
    package: 'react',
    module: 'toast',
    category: 'feedback',
    storybookPath: 'components-toast',
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    package: 'react',
    module: 'tooltip',
    category: 'popups',
    storybookPath: 'components-tooltip',
  },
]

export const DEFAULT_CANVAS_KIT_SLUG: CanvasKitSlug = 'button'

export const canvasKitRegistry: CanvasKitEntry[] = registrySeeds.map(entry)

if (canvasKitRegistry.length !== CANVAS_KIT_SLUGS.length) {
  throw new Error('Canvas Kit registry is out of sync with CANVAS_KIT_SLUGS')
}

const registryBySlug = new Map(
  canvasKitRegistry.map((item) => [item.slug, item] as const),
)

export function getCanvasKitEntry(slug: CanvasKitSlug): CanvasKitEntry {
  const entry = registryBySlug.get(slug)
  if (!entry) {
    throw new Error(`Unknown Canvas Kit slug: ${slug}`)
  }
  return entry
}

export function getCanvasKitByCategory(category: CanvasKitCategory) {
  return canvasKitRegistry.filter((item) => item.category === category)
}

export const CATEGORY_LABELS: Record<CanvasKitCategory, string> = {
  actions: 'Actions',
  inputs: 'Inputs',
  containers: 'Containers',
  navigation: 'Navigation',
  popups: 'Popups',
  text: 'Text',
  layout: 'Layout',
  feedback: 'Feedback',
  data: 'Data',
  ai: 'AI',
}

export const PACKAGE_LABELS: Record<CanvasKitPackage, string> = {
  react: 'Main',
  preview: 'Preview',
  labs: 'Labs',
}
