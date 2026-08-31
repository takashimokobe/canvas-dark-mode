import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react'

import type { Brand } from '@/lib/rootPreferences'
import { cn } from '@/lib/utils/mergeClasses'

import styles from './BrowserMockup.module.css'

export type BrowserTheme = 'current' | 'light' | 'dark' | 'transparent'
export type BrowserPage = 'default' | 'alt'

export type BrowserMockupProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'style'
> & {
  theme?: BrowserTheme
  page?: BrowserPage
  url?: string
  brand?: Brand
  cs?: CSSProperties
  children?: ReactNode
}

export function BrowserMockupRow({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div {...props} className={cn(styles.Row, className)}>
      {children}
    </div>
  )
}

function themeClass(theme: BrowserTheme) {
  switch (theme) {
    case 'current':
      return undefined
    case 'light':
      return styles.ThemeLight
    case 'dark':
      return styles.ThemeDark
    case 'transparent':
      return styles.ThemeTransparent
    default: {
      const _exhaustive: never = theme
      return _exhaustive
    }
  }
}

function pageClass(page: BrowserPage) {
  switch (page) {
    case 'default':
      return undefined
    case 'alt':
      return styles.PageAlt
    default: {
      const _exhaustive: never = page
      return _exhaustive
    }
  }
}

function LockMark() {
  return (
    <svg className={styles.Lock} viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="7.5"
        width="9"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5.5 7.5V5.25a2.5 2.5 0 0 1 5 0V7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export const BrowserMockup = forwardRef<HTMLDivElement, BrowserMockupProps>(
  function BrowserMockup(
    {
      className,
      children,
      theme = 'current',
      page = 'default',
      url = 'https://canvas.workday.com',
      brand,
      cs,
      ...props
    },
    ref,
  ) {
    const isolate = theme === 'light' || theme === 'dark'

    return (
      <div
        {...props}
        ref={ref}
        data-theme={theme}
        data-page={page}
        data-scheme={isolate ? theme : undefined}
        data-brand={brand}
        className={cn(styles.Window, themeClass(theme), className)}
        style={isolate ? { colorScheme: theme } : undefined}
      >
        <div className={styles.Toolbar} aria-hidden>
          <div className={styles.Lights}>
            <span className={styles.LightCritical} />
            <span className={styles.LightCaution} />
            <span className={styles.LightPositive} />
          </div>
          <div className={styles.Address}>
            <LockMark />
            <span className={styles.Url}>{url}</span>
          </div>
          <span className={styles.LightsBalance} />
        </div>
        <div className={cn(styles.Page, pageClass(page))} style={cs}>
          <div className={styles.PageFill}>{children}</div>
        </div>
      </div>
    )
  },
)
