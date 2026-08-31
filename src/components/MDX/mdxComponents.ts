import { createElement } from 'react'
import type { ComponentProps } from 'react'
import type { MDXContent } from '@content-collections/mdx/react'
import { Link, useRouterState } from '@tanstack/react-router'

import { Container } from '@/components/Container'
import { AccentOverlayDemo } from '@/components/MDX/AccentOverlayDemo'
import { BrowserMockup, BrowserMockupRow } from '@/components/MDX/BrowserMockup'
import { CardGrid } from '@/components/MDX/CardGrid'
import {
  AccentRoles,
  RoleBorder,
  RoleFocus,
  RoleForeground,
  RoleShadow,
  RoleSwitch,
} from '@/components/MDX/ColorRoleExamples'
import { ContrastAudit } from '@/components/MDX/ContrastAudit'
import { ContrastPairs } from '@/components/MDX/ContrastPairs'
import {
  CautionInk,
  ChartColors,
  ChromaPeak,
  ContrastCompare,
  DepthCompare,
  FocusStay,
  GlowCompare,
  GreyOnWhite,
  HalationCompare,
  InputContrast,
  NeutralRamps,
  QuietChrome,
  RoleModes,
  SaturatedRamps,
  ShadowCompare,
  ShadowInk,
  SpinePair,
  StepJobs,
  SurfaceStack,
  TenantChrome,
  ThumbRing,
  WhiteInk,
} from '@/components/MDX/DarkModeExamples'
import { TokenTable } from '@/components/MDX/TokenTable'
import { Specimen } from '@/components/Specimen'
import { SITE_PAGES, sitePageLink } from '@/lib/sitePages'
import type { SitePage } from '@/lib/sitePages'

import { MdxHighlight } from './MdxHighlight'
import { MdxImage } from './MdxImage'

type MdxComponents = NonNullable<
  ComponentProps<typeof MDXContent>['components']
>

function pageFromHref(href: string, pathname: string): SitePage | undefined {
  if (
    href.startsWith('http') ||
    href.startsWith('mailto:') ||
    href.startsWith('#')
  ) {
    return undefined
  }

  const base = pathname.endsWith('/') ? pathname : `${pathname}/`
  let path: string
  try {
    path = new URL(href, `https://example.invalid${base}`).pathname
  } catch {
    return undefined
  }

  const normalized = path === '/' ? '/' : path.replace(/\/$/, '')

  return SITE_PAGES.find((page) => {
    if (page.to === '/docs/$slug') {
      return normalized === `/docs/${page.slug}`
    }

    return page.to === normalized
  })
}

function MdxLink({ href, children, ...rest }: ComponentProps<'a'>) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const page = href ? pageFromHref(href, pathname) : undefined

  if (page) {
    return createElement(Link, { ...sitePageLink(page), ...rest }, children)
  }

  return createElement('a', { href, ...rest }, children)
}

export const mdxComponents = {
  a: MdxLink,
  img: MdxImage,
  blockquote: MdxHighlight,
  InformationHighlight: MdxHighlight,
  AccentOverlayDemo,
  AccentRoles,
  BrowserMockup,
  BrowserMockupRow,
  CardGrid,
  CautionInk,
  ChartColors,
  ChromaPeak,
  Container,
  ContrastAudit,
  ContrastCompare,
  ContrastPairs,
  DepthCompare,
  FocusStay,
  GlowCompare,
  GreyOnWhite,
  HalationCompare,
  InputContrast,
  NeutralRamps,
  QuietChrome,
  RoleBorder,
  RoleFocus,
  RoleForeground,
  RoleModes,
  RoleShadow,
  RoleSwitch,
  SaturatedRamps,
  ShadowCompare,
  ShadowInk,
  Specimen,
  SpinePair,
  StepJobs,
  SurfaceStack,
  TenantChrome,
  ThumbRing,
  TokenTable,
  WhiteInk,
} as MdxComponents
