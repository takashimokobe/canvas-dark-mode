import { createFileRoute, notFound } from '@tanstack/react-router'
import { allDocs } from 'content-collections'

import { DocPage } from '@/components/DocPage'

export const Route = createFileRoute('/')({
  loader: () => {
    const doc = allDocs.find((item) => item.slug === 'index')

    if (!doc) {
      throw notFound()
    }

    return {
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
          : 'Canvas Dark Mode',
      },
      ...(loaderData?.description
        ? [{ name: 'description', content: loaderData.description }]
        : []),
    ],
  }),
  component: HomeRoute,
})

function HomeRoute() {
  const doc = Route.useLoaderData()

  return (
    <DocPage title={doc.title} description={doc.description} code={doc.mdx} />
  )
}
