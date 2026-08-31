import { useLayoutEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { SystemIcon } from '@workday/canvas-kit-react/icon'
import { KBD } from '@workday/canvas-kit-labs-react/kbd'
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useKBar,
  useMatches,
  useRegisterActions,
  VisualState,
} from 'kbar'
import type { Action, ActionImpl } from 'kbar'
import {
  checkIcon,
  layersIcon,
  moonIcon,
  sunIcon,
} from '@workday/canvas-system-icons-web'
import type { CanvasSystemIcon } from '@workday/canvas-system-icons-web'

import { BRAND_ICONS } from '@/registry/brandIcon'
import {
  BRANDS,
  formatBrandLabel,
  PAGE_BACKGROUNDS,
  useBrand,
  useMode,
  usePageBackground,
} from '@/lib/rootPreferences'
import type { Brand, PageBackground } from '@/lib/rootPreferences'
import {
  SITE_PAGES,
  sitePageGroupLabel,
  sitePageIdFromPath,
  sitePageLink,
} from '@/lib/sitePages'
import type { SitePage } from '@/lib/sitePages'

import styles from './CommandPalette.module.css'

const PAGE_SHORTCUTS: Record<string, string[]> = {
  index: ['g'],
  chat: ['c'],
}

const POSITIONER_STYLE = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--cnvs-sys-padding-md)',
  width: '100vw',
  height: '100dvh',
} as const

const ICON_SIZE = 16

function CommandIcon({ icon }: { icon: CanvasSystemIcon }) {
  return (
    <span className={styles.Icon} aria-hidden>
      <SystemIcon icon={icon} size={ICON_SIZE} color="currentColor" />
    </span>
  )
}

function ShortcutKbd({
  children,
  label,
}: {
  children: string
  label?: string
}) {
  return (
    <KBD size="small">
      <KBD.Item aria-label={label}>{children}</KBD.Item>
    </KBD>
  )
}

function pagePerform(page: SitePage, navigate: ReturnType<typeof useNavigate>) {
  return () => {
    void navigate(sitePageLink(page))
  }
}

function backgroundName(background: PageBackground): string {
  switch (background) {
    case 'default':
      return 'bg-default'
    case 'alt':
      return 'bg-alt'
    default: {
      const _exhaustive: never = background
      return _exhaustive
    }
  }
}

function motionDuration(enter: number, exit: number) {
  if (typeof window === 'undefined') {
    return { enterMs: 0, exitMs: 0 }
  }

  return window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    ? { enterMs: enter, exitMs: exit }
    : { enterMs: 0, exitMs: 0 }
}

function CommandActions() {
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const { mode, setMode } = useMode()
  const { brand, setBrand } = useBrand()
  const { background, setBackground } = usePageBackground()

  const actions = useMemo<Action[]>(() => {
    const current = sitePageIdFromPath(pathname)

    const pages: Action[] = SITE_PAGES.map((page) => ({
      id: page.id,
      name: page.name,
      section: sitePageGroupLabel(page.group),
      shortcut: PAGE_SHORTCUTS[page.id],
      keywords: page.keywords,
      icon: <CommandIcon icon={page.icon} />,
      subtitle: page.id === current ? 'On' : undefined,
      perform: pagePerform(page, navigate),
    }))

    const appearance: Action[] = [
      {
        id: 'appearance-light',
        name: 'Light',
        section: 'Appearance',
        keywords: 'mode day',
        icon: <CommandIcon icon={sunIcon} />,
        subtitle: mode === 'light' ? 'On' : undefined,
        perform: () => {
          setMode('light')
        },
      },
      {
        id: 'appearance-dark',
        name: 'Dark',
        section: 'Appearance',
        keywords: 'mode night',
        icon: <CommandIcon icon={moonIcon} />,
        subtitle: mode === 'dark' ? 'On' : undefined,
        perform: () => {
          setMode('dark')
        },
      },
    ]

    const brands: Action[] = BRANDS.map((item: Brand) => ({
      id: `brand-${item}`,
      name: formatBrandLabel(item),
      section: 'Brand',
      keywords: `tenant ${item}`,
      icon: <CommandIcon icon={BRAND_ICONS[item]} />,
      subtitle: brand === item ? 'On' : undefined,
      perform: () => {
        setBrand(item)
      },
    }))

    const backgrounds: Action[] = PAGE_BACKGROUNDS.map((item) => ({
      id: `background-${item}`,
      name: backgroundName(item),
      section: 'Background',
      keywords: `page surface ${item}`,
      icon: <CommandIcon icon={layersIcon} />,
      subtitle: background === item ? 'On' : undefined,
      perform: () => {
        setBackground(item)
      },
    }))

    return [...pages, ...appearance, ...brands, ...backgrounds]
  }, [
    background,
    brand,
    mode,
    navigate,
    pathname,
    setBackground,
    setBrand,
    setMode,
  ])

  useRegisterActions(actions, [actions])

  return null
}

function ResultRow({
  item,
  active,
  first,
}: {
  item: string | ActionImpl
  active: boolean
  first: boolean
}) {
  if (typeof item === 'string') {
    return (
      <div className={styles.Group} data-first={first || undefined}>
        {item}
      </div>
    )
  }

  const shortcut = item.shortcut?.[0]
  const selected = item.subtitle === 'On'

  return (
    <div
      className={styles.Item}
      data-active={active || undefined}
      data-selected={selected || undefined}
    >
      {item.icon}
      <span className={styles.Name}>{item.name}</span>
      <span className={styles.Meta}>
        {selected ? (
          <span className={styles.Check} aria-hidden>
            <SystemIcon
              icon={checkIcon}
              size={ICON_SIZE}
              color="currentColor"
            />
          </span>
        ) : null}
        {shortcut ? <ShortcutKbd>{shortcut.toUpperCase()}</ShortcutKbd> : null}
      </span>
    </div>
  )
}

function CommandResults() {
  const { results } = useMatches()

  return (
    <div className={styles.Results}>
      <KBarResults
        items={results}
        maxHeight={640}
        onRender={({ item, active }) => (
          <ResultRow item={item} active={active} first={item === results[0]} />
        )}
      />
    </div>
  )
}

function CommandDocumentLock() {
  const { visualState } = useKBar((state) => ({
    visualState: state.visualState,
  }))
  const open =
    visualState === VisualState.showing ||
    visualState === VisualState.animatingIn ||
    visualState === VisualState.animatingOut

  useLayoutEffect(() => {
    document.documentElement.toggleAttribute('data-command-open', open)

    return () => {
      document.documentElement.removeAttribute('data-command-open')
    }
  }, [open])

  return null
}

function CommandMenu() {
  return (
    <>
      <CommandActions />
      <CommandDocumentLock />
      <KBarPortal>
        <KBarPositioner className={styles.Positioner} style={POSITIONER_STYLE}>
          <KBarAnimator className={styles.Animator} style={{ opacity: 1 }}>
            <KBarSearch
              className={styles.Search}
              defaultPlaceholder="Go to…"
              aria-label="Command menu"
            />
            <CommandResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
    </>
  )
}

export function CommandPalette({ children }: { children: ReactNode }) {
  const animations = motionDuration(150, 100)

  return (
    <KBarProvider
      options={{
        animations,
        disableScrollbarManagement: true,
      }}
    >
      <CommandMenu />
      {children}
    </KBarProvider>
  )
}
