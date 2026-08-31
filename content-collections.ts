import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import remarkGfm from 'remark-gfm'
import { z } from 'zod'

function toKebabCase(value: string): string {
  return value
    .replaceAll('\\', '/')
    .split('/')
    .at(-1)
    ?.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase() ?? value.toLowerCase()
}

const docs = defineCollection({
  name: 'docs',
  directory: 'src/content/docs',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      cwd: import.meta.dirname,
      remarkPlugins: [remarkGfm],
    })

    return {
      ...document,
      mdx,
      slug: toKebabCase(document._meta.path),
    }
  },
})

export default defineConfig({
  content: [docs],
})
