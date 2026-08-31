import { forwardRef } from 'react'
import type { ComponentProps, CSSProperties } from 'react'

import { useMode } from '@/lib/rootPreferences'
import type { Brand, Mode } from '@/lib/rootPreferences'
import { cn } from '@/lib/utils/mergeClasses'

import styles from './Container.module.css'

export type ContainerScheme = Mode
export type ContainerSurface = 'alt' | 'contrast' | 'default' | 'theme'

export type ContainerSize = 'stage' | 'compact'
export type ContainerAlign = 'center' | 'wide'

export type ContainerProps = ComponentProps<'div'> & {
  aspectRatio?: CSSProperties['aspectRatio']
  size?: ContainerSize
  align?: ContainerAlign
  mode?: Mode
  brand?: Brand
  surface?: ContainerSurface
}

function schemeClass(mode: Mode) {
  switch (mode) {
    case 'light':
      return styles.SchemeLight
    case 'dark':
      return styles.SchemeDark
    default: {
      const _exhaustive: never = mode
      return _exhaustive
    }
  }
}

function surfaceClass(surface: ContainerSurface) {
  switch (surface) {
    case 'alt':
      return styles.SurfaceAlt
    case 'contrast':
      return styles.SurfaceContrast
    case 'default':
      return styles.SurfaceDefault
    case 'theme':
      return styles.SurfaceTheme
    default: {
      const _exhaustive: never = surface
      return _exhaustive
    }
  }
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container(
    {
      className,
      aspectRatio,
      size = 'stage',
      align = 'center',
      mode,
      brand,
      surface = 'theme',
      style,
      children,
      ...props
    },
    ref,
  ) {
    const { mode: currentMode } = useMode()
    const isolate = mode !== undefined || brand !== undefined
    const resolvedMode = mode ?? currentMode

    return (
      <div
        {...props}
        ref={ref}
        data-size={size}
        data-align={align}
        data-scheme={isolate ? resolvedMode : undefined}
        data-brand={brand}
        className={cn(
          styles.Root,
          isolate && schemeClass(resolvedMode),
          surfaceClass(surface),
          className,
        )}
        style={{
          ...style,
          ...(aspectRatio === undefined ? {} : { aspectRatio }),
          ...(isolate ? { colorScheme: resolvedMode } : {}),
        }}
      >
        {children}
      </div>
    )
  },
)
