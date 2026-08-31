import {
  backgroundColorIcon,
  bookOpenIcon,
  commentIcon,
  componentIcon,
  gridIcon,
  layersIcon,
  noteIcon,
} from '@workday/canvas-system-icons-web'
import type { CanvasSystemIcon } from '@workday/canvas-system-icons-web'

export type SitePageGroup = 'look' | 'read' | 'ask'

type SitePageFields = {
  name: string
  description: string
  keywords: string
  group: SitePageGroup
  icon: CanvasSystemIcon
}

export type SitePage =
  | (SitePageFields & {
      id: 'index' | 'chat' | 'palette' | 'panel'
      to: '/' | '/chat' | '/palette' | '/panel'
    })
  | (SitePageFields & {
      id: 'roles' | 'contrast' | 'dark'
      to: '/docs/$slug'
      slug: string
    })

export const SITE_PAGES: readonly SitePage[] = [
  {
    id: 'index',
    name: 'Components',
    description: 'Canvas Kit specimens in light and dark.',
    keywords: 'components canvas kit home',
    group: 'look',
    icon: componentIcon,
    to: '/',
  },
  {
    id: 'palette',
    name: 'Palette',
    description: 'Base ramps.',
    keywords: 'color ramp scale tokens light dark',
    group: 'look',
    icon: backgroundColorIcon,
    to: '/palette',
  },
  {
    id: 'roles',
    name: 'Color roles',
    description: 'What each token is for.',
    keywords: 'tokens background surface accent foreground border',
    group: 'read',
    icon: noteIcon,
    to: '/docs/$slug',
    slug: 'roles',
  },
  {
    id: 'contrast',
    name: 'Contrast',
    description: 'WCAG ratios.',
    keywords: 'wcag ratio audit text color contrast',
    group: 'read',
    icon: layersIcon,
    to: '/docs/$slug',
    slug: 'contrast',
  },
  {
    id: 'dark',
    name: 'Dark mode',
    description: 'How this dark mode was built',
    keywords: 'essay dark appearance remap lightness chroma',
    group: 'read',
    icon: bookOpenIcon,
    to: '/docs/$slug',
    slug: 'dark',
  },
  {
    id: 'chat',
    name: 'Chat',
    description: 'Questions against the docs.',
    keywords: 'ask conversation demo',
    group: 'ask',
    icon: commentIcon,
    to: '/chat',
  },
  {
    id: 'panel',
    name: 'Side panel',
    description: 'Full-page layout specimen.',
    keywords: 'layout rail navigation',
    group: 'look',
    icon: gridIcon,
    to: '/panel',
  },
]

export function sitePageGroupLabel(group: SitePageGroup): string {
  switch (group) {
    case 'look':
      return 'Look'
    case 'read':
      return 'Read'
    case 'ask':
      return 'Ask'
    default: {
      const _exhaustive: never = group
      return _exhaustive
    }
  }
}

export function sitePageLink(page: SitePage) {
  switch (page.to) {
    case '/docs/$slug':
      return {
        to: '/docs/$slug' as const,
        params: { slug: page.slug },
      }
    case '/':
    case '/chat':
    case '/palette':
    case '/panel':
      return { to: page.to }
    default: {
      const _exhaustive: never = page
      return _exhaustive
    }
  }
}

export function sitePageIdFromPath(
  pathname: string,
): SitePage['id'] | undefined {
  if (pathname === '/') {
    return 'index'
  }

  if (pathname === '/chat') {
    return 'chat'
  }

  if (pathname === '/palette') {
    return 'palette'
  }

  if (pathname === '/panel') {
    return 'panel'
  }

  if (pathname.startsWith('/docs/')) {
    const slug = pathname.slice('/docs/'.length)
    return SITE_PAGES.find(
      (page) => page.to === '/docs/$slug' && page.slug === slug,
    )?.id
  }

  return undefined
}

export function sitePageIsCurrent(pathname: string, page: SitePage) {
  return sitePageIdFromPath(pathname) === page.id
}

export function neighborsForPath(pathname: string): {
  previous?: SitePage
  next?: SitePage
} {
  const current = sitePageIdFromPath(pathname)
  if (!current) {
    return {}
  }

  const index = SITE_PAGES.findIndex((page) => page.id === current)
  if (index < 0) {
    return {}
  }

  return {
    previous: SITE_PAGES[index - 1],
    next: SITE_PAGES[index + 1],
  }
}
