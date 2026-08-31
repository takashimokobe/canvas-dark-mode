import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { allDocs } from 'content-collections'

import { DocPage } from '@/components/DocPage'

const HOME_SLUGS = new Set(['index', 'components'])

const ESSAY_SLUGS = new Set([
  'color-tokens',
  'color-palette',
  'color-scale',
  'designing-for-dark-mode',
  'dark-mode',
])

export const Route = createFileRoute('/docs/$slug')({
  loader: ({ params }) => {
    if (HOME_SLUGS.has(params.slug)) {
      throw redirect({ to: '/' })
    }

    if (ESSAY_SLUGS.has(params.slug)) {
      throw redirect({
        to: '/docs/$slug',
        params: { slug: 'dark' },
      })
    }

    const doc = allDocs.find((item) => item.slug === params.slug)

    if (!doc) {
      throw notFound()
    }

    return {
      slug: params.slug,
      title: doc.title,
      description: doc.description,
      mdx: doc.mdx,
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.title} · Canvas Dark Mode`
          : 'Docs · Canvas Dark Mode',
      },
      ...(loaderData?.description
        ? [{ name: 'description', content: loaderData.description }]
        : []),
    ],
  }),
  component: DocsRoute,
})

function DocsRoute() {
  const doc = Route.useLoaderData()

  return (
    <DocPage
      title={doc.title}
      description={doc.description}
      code={doc.mdx}
    />
  )
}
