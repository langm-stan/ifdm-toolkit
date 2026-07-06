import { useMemo } from 'react'
import { area as d3area, line as d3line, curveMonotoneX } from 'd3-shape'
import type { ScaleLinear } from 'd3-scale'
import { useChart } from './ChartFrame'
import styles from './primitives.module.css'

type Scale = ScaleLinear<number, number>

/* Gridlines — horizontal only (journal convention). */
export function Gridlines({ y, ticks = 5 }: { y: Scale; ticks?: number }) {
  const { innerWidth } = useChart()
  const values = y.ticks(ticks)
  return (
    <g aria-hidden="true">
      {values.map((v) => (
        <line key={v} x1={0} x2={innerWidth} y1={y(v)} y2={y(v)} className={styles.grid} />
      ))}
    </g>
  )
}

/* Axes — hand-rolled, sparse ticks, no top/right spines. */
export function AxisLeft({
  y,
  ticks = 5,
  format,
}: {
  y: Scale
  ticks?: number
  format: (v: number) => string
}) {
  const values = y.ticks(ticks)
  return (
    <g className={styles.axis} aria-hidden="true">
      {values.map((v) => (
        <text key={v} x={-12} y={y(v)} dy="0.32em" textAnchor="end" className={styles.tickLabel}>
          {format(v)}
        </text>
      ))}
    </g>
  )
}

export function AxisBottom({
  x,
  ticks = 6,
  format,
}: {
  x: Scale
  ticks?: number
  format: (v: number) => string
}) {
  const { innerHeight } = useChart()
  const values = x.ticks(ticks)
  return (
    <g className={styles.axis} aria-hidden="true">
      <line x1={0} x2={x.range()[1]} y1={innerHeight} y2={innerHeight} className={styles.axisLine} />
      {values.map((v) => (
        <text key={v} x={x(v)} y={innerHeight + 20} textAnchor="middle" className={styles.tickLabel}>
          {format(v)}
        </text>
      ))}
    </g>
  )
}

interface SeriesAccessors<T> {
  data: T[]
  x: (d: T) => number
  xScale: Scale
  yScale: Scale
}

export function LineSeries<T>({
  data,
  x,
  y,
  xScale,
  yScale,
  stroke,
  width = 2,
  dashed = false,
  draw = false,
}: SeriesAccessors<T> & {
  y: (d: T) => number
  stroke: string
  width?: number
  dashed?: boolean
  draw?: boolean
}) {
  const path = useMemo(() => {
    const gen = d3line<T>()
      .x((d) => xScale(x(d)))
      .y((d) => yScale(y(d)))
      .curve(curveMonotoneX)
    return gen(data) ?? ''
  }, [data, x, y, xScale, yScale])

  return (
    <path
      d={path}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? '5 5' : undefined}
      className={draw && !dashed ? styles.drawIn : undefined}
      pathLength={draw ? 1 : undefined}
    />
  )
}

export function AreaSeries<T>({
  data,
  x,
  y0,
  y1,
  xScale,
  yScale,
  fill,
  stroke,
}: SeriesAccessors<T> & {
  y0: (d: T) => number
  y1: (d: T) => number
  fill: string
  stroke?: string
}) {
  const { path, topLine } = useMemo(() => {
    const gen = d3area<T>()
      .x((d) => xScale(x(d)))
      .y0((d) => yScale(y0(d)))
      .y1((d) => yScale(y1(d)))
      .curve(curveMonotoneX)
    const line = d3line<T>()
      .x((d) => xScale(x(d)))
      .y((d) => yScale(y1(d)))
      .curve(curveMonotoneX)
    return { path: gen(data) ?? '', topLine: line(data) ?? '' }
  }, [data, x, y0, y1, xScale, yScale])

  return (
    <g>
      <path d={path} fill={fill} />
      {stroke && <path d={topLine} fill="none" stroke={stroke} strokeWidth={1.25} />}
    </g>
  )
}

export function Annotation({
  x,
  y,
  dx = 0,
  dy = -28,
  label,
  align = 'middle',
  tone = 'ink',
}: {
  x: number
  y: number
  dx?: number
  dy?: number
  label: string
  align?: 'start' | 'middle' | 'end'
  tone?: 'ink' | 'mark' | 'accent'
}) {
  const toneClass =
    tone === 'mark' ? styles.annMark : tone === 'accent' ? styles.annAccent : styles.annInk
  return (
    <g className={`${styles.annotation} ${toneClass}`}>
      <line x1={x} y1={y} x2={x + dx} y2={y + dy} className={styles.leader} />
      <circle cx={x} cy={y} r={3} className={styles.annDot} />
      <text x={x + dx} y={y + dy - 6} textAnchor={align} className={styles.annLabel}>
        {label}
      </text>
    </g>
  )
}

export function VMarker({
  x,
  xScale,
  label,
}: {
  x: number
  xScale: Scale
  label?: string
}) {
  const { innerHeight } = useChart()
  const px = xScale(x)
  return (
    <g className={styles.marker}>
      <line x1={px} x2={px} y1={0} y2={innerHeight} className={styles.markerLine} />
      {label && (
        <text x={px + 5} y={12} className={styles.markerLabel}>
          {label}
        </text>
      )}
    </g>
  )
}

export function EndLabel({
  x,
  y,
  text,
  color,
}: {
  x: number
  y: number
  text: string
  color: string
}) {
  return (
    <g>
      <circle cx={x} cy={y} r={3.5} fill={color} />
      <text x={x + 8} y={y} dy="0.32em" className={styles.endLabel} fill={color}>
        {text}
      </text>
    </g>
  )
}
