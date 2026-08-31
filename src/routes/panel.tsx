import { Link, createFileRoute, useRouterState } from '@tanstack/react-router'
import { SystemIcon } from '@workday/canvas-kit-react/icon'
import {
  SidePanel,
  useSidePanelModel,
} from '@workday/canvas-kit-react/side-panel'
import type { SidePanelTransitionStates } from '@workday/canvas-kit-react/side-panel'

import { BarChart } from '@/components/Chart'
import { PageShell } from '@/components/PageChrome'
import { RoutePager } from '@/components/RoutePager'
import { SITE_PAGES, sitePageIsCurrent, sitePageLink } from '@/lib/sitePages'
import type { SitePage } from '@/lib/sitePages'

import styles from './panel.module.css'

export const Route = createFileRoute('/panel')({
  head: () => ({
    meta: [{ title: 'Side panel · Canvas Dark Mode' }],
  }),
  component: PanelRoute,
})

function panelIsOpen(state: SidePanelTransitionStates) {
  switch (state) {
    case 'expanded':
    case 'expanding':
      return true
    case 'collapsed':
    case 'collapsing':
      return false
    default: {
      const _exhaustive: never = state
      return _exhaustive
    }
  }
}

function PageLink({ page, current }: { page: SitePage; current: boolean }) {
  return (
    <Link
      {...sitePageLink(page)}
      className={styles.NavLink}
      aria-current={current ? 'page' : undefined}
    >
      <SystemIcon
        icon={page.icon}
        size={20}
        color="currentColor"
        aria-hidden
      />
      {page.name}
    </Link>
  )
}

function PanelRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const model = useSidePanelModel()
  const open = panelIsOpen(model.state.transitionState)

  return (
    <PageShell
      frameClassName={styles.Shell}
      className={styles.Main}
      before={
        <SidePanel
          model={model}
          variant="standard"
          className={styles.Panel}
          cs={{ flexShrink: 0 }}
        >
          <SidePanel.ToggleButton
            aria-label={open ? 'Collapse pages panel' : 'Expand pages panel'}
          />
          <SidePanel.Heading size="small" aria-hidden={!open}>
            Pages
          </SidePanel.Heading>
          <nav className={styles.Nav} aria-label="Pages" hidden={!open}>
            {SITE_PAGES.map((page) => (
              <PageLink
                key={page.id}
                page={page}
                current={sitePageIsCurrent(pathname, page)}
              />
            ))}
          </nav>
        </SidePanel>
      }
    >
      <h1 className={styles.Title}>Side panel layout</h1>
      <p className={styles.Lead}>
        A full-page shell with Canvas Kit SidePanel. Collapse the rail; the page
        stays in view. The command menu stays at the bottom-end so it does not
        sit on the toggle.
      </p>
      <div className={styles.Chart}>
        <BarChart />
      </div>
      <RoutePager />
    </PageShell>
  )
}
