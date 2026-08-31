import { Link, useRouterState } from '@tanstack/react-router'
import { SystemIcon } from '@workday/canvas-kit-react/icon'
import {
  arrowLeftIcon,
  arrowRightIcon,
} from '@workday/canvas-system-icons-web'

import { neighborsForPath, sitePageLink } from '@/lib/sitePages'
import type { SitePage } from '@/lib/sitePages'

import styles from './RoutePager.module.css'

const ICON_SIZE = 16

function PageLink({
  page,
  direction,
}: {
  page: SitePage
  direction: 'previous' | 'next'
}) {
  const leading = direction === 'previous'

  return (
    <Link
      {...sitePageLink(page)}
      className={styles.Link}
      data-direction={direction}
    >
      {leading ? (
        <SystemIcon
          icon={arrowLeftIcon}
          size={ICON_SIZE}
          color="currentColor"
          aria-hidden
        />
      ) : null}
      {page.name}
      {leading ? null : (
        <SystemIcon
          icon={arrowRightIcon}
          size={ICON_SIZE}
          color="currentColor"
          aria-hidden
        />
      )}
    </Link>
  )
}

export function RoutePager() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const { previous, next } = neighborsForPath(pathname)

  if (!previous && !next) {
    return null
  }

  return (
    <nav className={styles.Nav} aria-label="More pages">
      {previous ? <PageLink page={previous} direction="previous" /> : null}
      {next ? <PageLink page={next} direction="next" /> : null}
    </nav>
  )
}
