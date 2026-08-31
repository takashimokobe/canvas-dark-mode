import {
  createContext,
  useContext,
  useId,
  useMemo,
  type CSSProperties,
  type ComponentProps,
  type ComponentType,
  type ReactNode,
} from 'react'
import {
  Legend,
  ResponsiveContainer,
  Tooltip,
  type DefaultLegendContentProps,
  type DefaultTooltipContentProps,
  type TooltipValueType,
} from 'recharts'

import { cn } from '@/lib/utils/mergeClasses'

import styles from './Chart.module.css'

const INITIAL_DIMENSION = { width: 320, height: 200 } as const

type TooltipNameType = number | string
type ChartIndicator = 'line' | 'dot' | 'dashed'

export type ChartConfig = Record<
  string,
  {
    label?: ReactNode
    icon?: ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: { light: string; dark: string } }
  )
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = createContext<ChartContextProps | null>(null)

function useChart() {
  const context = useContext(ChartContext)

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />')
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: ComponentProps<'div'> & {
  config: ChartConfig
  children: ComponentProps<typeof ResponsiveContainer>['children']
  initialDimension?: {
    width: number
    height: number
  }
}) {
  const uniqueId = useId()
  const chartId = `chart-${id ?? uniqueId.replaceAll(':', '')}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(styles.Root, className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer initialDimension={initialDimension}>
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

function seriesColorDeclaration(key: string, item: ChartConfig[string]) {
  if (item.theme) {
    return `  --color-${key}: light-dark(${item.theme.light}, ${item.theme.dark});`
  }

  if (item.color) {
    return `  --color-${key}: ${item.color};`
  }

  return null
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, item]) => item.theme ?? item.color,
  )

  if (!colorConfig.length) {
    return null
  }

  const declarations = colorConfig
    .map(([key, item]) => seriesColorDeclaration(key, item))
    .filter(Boolean)
    .join('\n')

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `[data-chart=${id}] {\n${declarations}\n}`,
      }}
    />
  )
}

function ChartTooltip(props: ComponentProps<typeof Tooltip>) {
  return <Tooltip animationDuration={0} {...props} />
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ComponentProps<typeof Tooltip> &
  ComponentProps<'div'> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: ChartIndicator
    nameKey?: string
    labelKey?: string
  } & Omit<
    DefaultTooltipContentProps<TooltipValueType, TooltipNameType>,
    'accessibilityLayer'
  >) {
  const { config } = useChart()

  const tooltipLabel = useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey ?? item?.dataKey ?? item?.name ?? 'value'}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === 'string'
        ? (config[label]?.label ?? label)
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div className={cn(styles.Label, labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      )
    }

    if (!value) {
      return null
    }

    return <div className={cn(styles.Label, labelClassName)}>{value}</div>
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== 'dot'

  return (
    <div className={cn(styles.Tooltip, className)}>
      {!nestLabel ? tooltipLabel : null}
      <div className={styles.Items}>
        {payload
          .filter((item) => item.type !== 'none')
          .map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? 'value'}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color ?? item.payload?.fill ?? item.color
            const Icon = itemConfig?.icon

            return (
              <div
                key={`${item.dataKey ?? item.name ?? index}`}
                className={styles.Item}
                data-indicator={indicator}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {Icon ? (
                      <Icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          aria-hidden
                          className={styles.Indicator}
                          data-indicator={indicator}
                          data-nested={nestLabel || undefined}
                          style={
                            {
                              '--_fill': indicatorColor,
                            } as CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={styles.Row}
                      data-nested={nestLabel || undefined}
                    >
                      <div className={styles.Meta}>
                        {nestLabel ? tooltipLabel : null}
                        <span className={styles.Name}>
                          {itemConfig?.label ?? item.name}
                        </span>
                      </div>
                      {item.value != null && (
                        <span className={styles.Value}>
                          {typeof item.value === 'number'
                            ? item.value.toLocaleString()
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

function ChartLegend(props: ComponentProps<typeof Legend>) {
  return <Legend {...props} />
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}: ComponentProps<'div'> & {
  hideIcon?: boolean
  nameKey?: string
} & DefaultLegendContentProps) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div className={cn(styles.Legend, className)} data-align={verticalAlign}>
      {payload
        .filter((item) => item.type !== 'none')
        .map((item, index) => {
          const key = `${nameKey ?? item.dataKey ?? 'value'}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          const Icon = itemConfig?.icon

          return (
            <div key={index} className={styles.LegendItem}>
              {Icon && !hideIcon ? (
                <Icon />
              ) : (
                <div
                  aria-hidden
                  className={styles.Swatch}
                  style={{ backgroundColor: item.color }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
    </div>
  )
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined
  }

  const payloadPayload =
    'payload' in payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === 'string'
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
