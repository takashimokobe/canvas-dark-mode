import type { ReactNode } from 'react'
import { InformationHighlight } from '@workday/canvas-kit-react/information-highlight'

import styles from './MDX.module.css'

type HighlightVariant = 'default' | 'informational' | 'caution' | 'critical'
type HighlightEmphasis = 'low' | 'high'

export function MdxHighlight({
  children,
  heading,
  variant = 'informational',
  emphasis = 'low',
}: {
  children?: ReactNode
  heading?: string
  variant?: HighlightVariant
  emphasis?: HighlightEmphasis
}) {
  if (!heading && !children) {
    return null
  }

  return (
    <div className={styles.Highlight}>
      <InformationHighlight variant={variant} emphasis={emphasis}>
        <InformationHighlight.Icon aria-hidden />
        {heading ? (
          <InformationHighlight.Heading>{heading}</InformationHighlight.Heading>
        ) : null}
        {children ? (
          <InformationHighlight.Body>{children}</InformationHighlight.Body>
        ) : null}
      </InformationHighlight>
    </div>
  )
}
