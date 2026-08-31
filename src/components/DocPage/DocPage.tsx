import { MDX } from '@/components/MDX'
import { PageShell } from '@/components/PageChrome'
import { RoutePager } from '@/components/RoutePager'

export function DocPage({
  title,
  description,
  code,
}: {
  title: string
  description: string
  code: string
}) {
  return (
    <PageShell variant="doc">
      <MDX title={title} description={description} code={code} />
      <RoutePager />
    </PageShell>
  )
}
