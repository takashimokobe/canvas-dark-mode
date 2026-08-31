import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { createStencil, handleCsProp } from '@workday/canvas-kit-styling'
import type { CSProps } from '@workday/canvas-kit-styling'

export const bubbleStencil = createStencil({
  base: {
    display: 'inline-flex',
    maxInlineSize: 'min(100%, var(--cnvs-sys-measure-bubble))',
    inlineSize: 'fit-content',
    paddingInline: 'var(--cnvs-sys-padding-md)',
    paddingBlock: 'var(--cnvs-sys-padding-xs)',
    borderRadius: 'var(--cnvs-sys-shape-xxxl)',
    backgroundColor: 'var(--cnvs-sys-color-surface-alt-strong)',
    color: 'var(--cnvs-sys-color-fg-default)',
    font: 'var(--cnvs-sys-type-body-sm)',
    overflowWrap: 'anywhere',
  },
})

export interface BubbleProps extends CSProps {
  children: ReactNode
}

export const Bubble = forwardRef<HTMLDivElement, BubbleProps>(function Bubble(
  { children, ...elemProps },
  ref,
) {
  return (
    <div ref={ref} {...handleCsProp(elemProps, bubbleStencil())}>
      {children}
    </div>
  )
})
