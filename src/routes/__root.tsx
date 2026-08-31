import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import { CommandPalette } from '@/components/CommandPalette'
import { PageShell } from '@/components/PageChrome'
import {
  applyRootMode,
  applyRootPageBackground,
  buildRootInitScript,
  useBrand,
  useMode,
  useModeKeyboardShortcut,
  usePageBackground,
} from '@/lib/rootPreferences'

import appCss from '@/styles/index.css?url'
import styles from './root.module.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Canvas Dark Mode',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="%23111827"/></svg>',
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function NotFound() {
  return (
    <PageShell className={styles.NotFound}>
      <h1 className={styles.Title}>Page not found</h1>
      <p className={styles.Body}>That URL is not a page here.</p>
      <Link to="/" className={styles.Home}>
        Go to the home page
      </Link>
    </PageShell>
  )
}

function RootThemeSync() {
  const { brand } = useBrand()
  const { mode } = useMode()
  const { background } = usePageBackground()
  useModeKeyboardShortcut()

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-brand', brand)
    applyRootMode(mode)
    applyRootPageBackground(background)
  }, [background, brand, mode])

  return null
}

function RootDocument({ children }: { children: ReactNode }) {
  const { mode } = useMode()

  return (
    <html
      lang="en"
      className={mode}
      style={{ colorScheme: mode }}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: buildRootInitScript() }} />
        <HeadContent />
      </head>
      <body>
        <CommandPalette>
          <RootThemeSync />
          {children}
        </CommandPalette>
        <Scripts />
      </body>
    </html>
  )
}
