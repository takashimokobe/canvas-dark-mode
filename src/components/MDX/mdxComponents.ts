import { createElement } from 'react'
import type { ComponentProps } from 'react'
import type { MDXContent } from '@content-collections/mdx/react'
import { Link, useRouterState } from '@tanstack/react-router'

import { Container } from '@/components/Container'
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
import {
  CautionInk,
  ContrastCompare,
  DepthCompare,
  GlowCompare,
  GreyOnWhite,
  HalationCompare,
  ShadowCompare,
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
  AccentRoles,
  BrowserMockup,
  BrowserMockupRow,
  CardGrid,
  CautionInk,
  Container,
  ContrastAudit,
  ContrastCompare,
  DepthCompare,
  GlowCompare,
  GreyOnWhite,
  HalationCompare,
  RoleBorder,
  RoleFocus,
  RoleForeground,
  RoleShadow,
  RoleSwitch,
  ShadowCompare,
  Specimen,
  TokenTable,
} as MdxComponents
