import { CANVAS_KIT_SLUGS } from './types'
import type {
  CanvasKitCategory,
  CanvasKitEntry,
  CanvasKitPackage,
  CanvasKitSlug,
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
    default: {
      const _exhaustive: never = pkg
      return _exhaustive
    }
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
    slug: 'form-field',
    name: 'Form Field',
    package: 'react',
    module: 'form-field',
    category: 'inputs',
    storybookPath: 'components-form-field',
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
    slug: 'pill',
    name: 'Pill',
    package: 'react',
    module: 'pill',
    category: 'containers',
    storybookPath: 'components-pill',
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
    slug: 'side-panel',
    name: 'Side Panel',
    package: 'react',
    module: 'side-panel',
    category: 'containers',
    storybookPath: 'components-containers-side-panel',
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

export const canvasKitRegistry: CanvasKitEntry[] = registrySeeds.map(entry)

if (canvasKitRegistry.length !== CANVAS_KIT_SLUGS.length) {
  throw new Error('Canvas Kit registry is out of sync with CANVAS_KIT_SLUGS')
}

export function getCanvasKit(slug: CanvasKitSlug) {
  const match = canvasKitRegistry.find((item) => item.slug === slug)
  if (!match) {
    throw new Error(`Unknown Canvas Kit slug: ${slug}`)
  }
  return match
}
