import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
} from 'recharts'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from './Chart'

const CHART_DATA = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
]

const CHART_CONFIG = {
  desktop: {
    label: 'Desktop',
    color: 'var(--cnvs-sys-color-chart-categorical-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--cnvs-sys-color-chart-categorical-2)',
  },
} satisfies ChartConfig

export function BarChart({
  className,
  defaultIndex,
}: {
  className?: string
  defaultIndex?: number
}) {
  return (
    <ChartContainer
      className={className}
      config={CHART_CONFIG}
      aria-label="Desktop and mobile visits by month"
    >
      <RechartsBarChart accessibilityLayer data={CHART_DATA}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
        />
        <ChartTooltip
          defaultIndex={defaultIndex}
          content={<ChartTooltipContent />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </RechartsBarChart>
    </ChartContainer>
  )
}
