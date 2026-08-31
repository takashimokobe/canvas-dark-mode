import { createFileRoute } from '@tanstack/react-router'

import { PageShell } from '@/components/PageChrome'
import { Palette } from '@/components/Palette'
import { RoutePager } from '@/components/RoutePager'

export const Route = createFileRoute('/palette')({
  head: () => ({
    meta: [
      { title: 'Palette · Canvas Dark Mode' },
      {
        name: 'description',
        content:
          'Brand and base palettes for Canvas. Appearance follows color-scheme.',
      },
    ],
  }),
  component: PaletteRoute,
})

function PaletteRoute() {
  return (
    <PageShell variant="doc">
      <Palette />
      <RoutePager />
    </PageShell>
  )
}
