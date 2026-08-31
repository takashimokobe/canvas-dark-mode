import { TertiaryButton } from '@workday/canvas-kit-react/button'
import { Card } from '@workday/canvas-kit-react/card'
import { Toast } from '@workday/canvas-kit-react/toast'
import {
  checkIcon,
  gridIcon,
  listViewIcon,
  pieChartIcon,
  plusIcon,
} from '@workday/canvas-system-icons-web'
import type { CanvasSystemIcon } from '@workday/canvas-system-icons-web'

import styles from './CardGrid.module.css'

const fillCs = {
  inlineSize: '100%',
  minInlineSize: 0,
  blockSize: '100%',
  minBlockSize: 0,
}

type SurfaceCard = {
  className: string
  label: string
  background: string
  shadow?: string
}

const SURFACES: readonly SurfaceCard[] = [
  {
    className: styles.Kpi,
    label: 'Default',
    background: 'var(--cnvs-sys-color-surface-default)',
  },
  {
    className: styles.Kpi,
    label: 'Default',
    background: 'var(--cnvs-sys-color-surface-default)',
  },
  {
    className: styles.Kpi,
    label: 'Tonal',
    background: 'var(--cnvs-sys-color-surface-alt-default)',
  },
  {
    className: styles.Chart,
    label: 'Elevated',
    background: 'var(--cnvs-sys-color-surface-elevated)',
    shadow: 'var(--cnvs-sys-depth-1)',
  },
  {
    className: styles.Feed,
    label: 'Popover',
    background: 'var(--cnvs-sys-color-surface-popover)',
    shadow: 'var(--cnvs-sys-depth-3)',
  },
  {
    className: styles.Table,
    label: 'Default',
    background: 'var(--cnvs-sys-color-surface-default)',
  },
]

const toastCs = {
  background: 'var(--cnvs-sys-color-surface-popover)',
  border: '1px solid var(--cnvs-sys-color-border-elevated)',
  boxShadow: 'var(--cnvs-sys-depth-3)',
}

type NavItem = {
  label: string
  icon: CanvasSystemIcon
  current?: boolean
}

const NAV: readonly NavItem[] = [
  { label: 'Overview', icon: gridIcon, current: true },
  { label: 'List', icon: listViewIcon },
  { label: 'Reports', icon: pieChartIcon },
  { label: 'Add', icon: plusIcon },
]

function SurfaceCard({ className, label, background, shadow }: SurfaceCard) {
  return (
    <Card
      className={className}
      cs={{
        ...fillCs,
        background,
        border: '1px solid var(--cnvs-sys-color-border-elevated)',
        boxShadow: shadow,
      }}
    >
      <Card.Heading>{label}</Card.Heading>
    </Card>
  )
}

export function CardGrid() {
  return (
    <div className={styles.Root}>
      <div className={styles.Layout}>
        <nav className={styles.Nav} aria-label="Dashboard">
          <ul className={styles.NavList}>
            {NAV.map((item) => (
              <li key={item.label}>
                <TertiaryButton
                  size="small"
                  icon={item.icon}
                  aria-label={item.label}
                  aria-current={item.current ? 'page' : undefined}
                />
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.Main}>
          {SURFACES.map((card, index) => (
            <SurfaceCard key={`${card.label}-${index}`} {...card} />
          ))}
        </div>
      </div>
      <div className={styles.Toast}>
        <Toast mode="status" cs={toastCs}>
          <Toast.Icon
            icon={checkIcon}
            color="var(--cnvs-sys-color-brand-fg-positive-default)"
          />
          <Toast.Body>
            <Toast.Message>Changes saved.</Toast.Message>
          </Toast.Body>
        </Toast>
      </div>
    </div>
  )
}
