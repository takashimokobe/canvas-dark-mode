import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { useLayoutEffect } from 'react'
import { buildRootInitScript, useBrand, useMode } from '@/lib/rootPreferences'

import appCss from '@/styles/index.css?url'
import styles from './__root.module.css'

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
    <main className={styles.NotFound}>
      <h1 className={styles.Title}>Page not found</h1>
      <p className={styles.Body}>That URL is not part of this gallery.</p>
      <Link to="/" className={styles.HomeLink}>
        Back to Canvas Kit
      </Link>
    </main>
  )
}

function RootThemeSync() {
  const { brand } = useBrand()
  const { mode } = useMode()

  useLayoutEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-brand', brand)
    root.style.colorScheme = mode
  }, [brand, mode])

  return null
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: buildRootInitScript() }} />
        <HeadContent />
      </head>
      <body>
        <RootThemeSync />
        {children}
        <Scripts />
      </body>
    </html>
  )
}
