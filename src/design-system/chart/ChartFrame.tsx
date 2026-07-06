import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useResizeObserver } from '../../hooks/useResizeObserver'
import styles from './ChartFrame.module.css'

export interface ChartMargin {
  top: number
  right: number
  bottom: number
  left: number
}

export interface ChartGeometry {
  width: number
  height: number
  margin: ChartMargin
  innerWidth: number
  innerHeight: number
}

const ChartContext = createContext<ChartGeometry | null>(null)

/** Access plot geometry from inside a ChartFrame. */
export function useChart(): ChartGeometry {
  const ctx = useContext(ChartContext)
  if (!ctx) throw new Error('Chart primitives must be used inside a <ChartFrame>.')
  return ctx
}

interface ChartFrameProps {
  ratio?: number
  height?: number
  margin?: Partial<ChartMargin>
  figure?: string
  caption?: ReactNode
  ariaLabel?: string
  /** Set false to hide the expand-to-fullscreen control. */
  expandable?: boolean
  /** Extra content (e.g. headline stats) shown above the chart in expanded view. */
  overlayHeader?: ReactNode
  children: ReactNode
}

const DEFAULT_MARGIN: ChartMargin = { top: 20, right: 24, bottom: 36, left: 64 }

/** The measured, responsive SVG canvas. Provides plot geometry to chart marks. */
function MeasuredCanvas({
  ratio = 0.5,
  height,
  margin: marginOverride,
  ariaLabel,
  children,
}: Pick<ChartFrameProps, 'ratio' | 'height' | 'margin' | 'ariaLabel' | 'children'>) {
  const [ref, size] = useResizeObserver<HTMLDivElement>()
  const margin = { ...DEFAULT_MARGIN, ...marginOverride }

  const width = size.width || 720
  const h = height ?? Math.round(width * ratio)
  const innerWidth = Math.max(0, width - margin.left - margin.right)
  const innerHeight = Math.max(0, h - margin.top - margin.bottom)
  const geometry: ChartGeometry = { width, height: h, margin, innerWidth, innerHeight }

  return (
    <div ref={ref} className={styles.canvas}>
      {size.width > 0 && (
        <svg
          width={width}
          height={h}
          viewBox={`0 0 ${width} ${h}`}
          role="img"
          aria-label={ariaLabel}
          className={styles.svg}
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            <ChartContext.Provider value={geometry}>{children}</ChartContext.Provider>
          </g>
        </svg>
      )}
    </div>
  )
}

export function ChartFrame({
  ratio = 0.5,
  height,
  margin,
  figure,
  caption,
  ariaLabel,
  expandable = true,
  overlayHeader,
  children,
}: ChartFrameProps) {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [expanded])

  const captionNode = (figure || caption) && (
    <figcaption className={styles.caption}>
      {figure && <span className={styles.figure}>{figure}</span>}
      {caption}
    </figcaption>
  )

  return (
    <figure className={styles.frame}>
      <div className={styles.canvasShell}>
        <MeasuredCanvas ratio={ratio} height={height} margin={margin} ariaLabel={ariaLabel}>
          {children}
        </MeasuredCanvas>
        {expandable && (
          <button
            type="button"
            className={styles.expandBtn}
            onClick={() => setExpanded(true)}
            aria-label="Expand chart to full screen"
            title="Expand chart"
          >
            <ExpandIcon />
          </button>
        )}
      </div>
      {captionNode}

      {expanded &&
        createPortal(
          <div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-label="Expanded chart"
            onClick={() => setExpanded(false)}
          >
            <div className={styles.overlayPanel} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setExpanded(false)}
                aria-label="Close expanded chart"
                title="Close (Esc)"
              >
                <CloseIcon />
              </button>
              {overlayHeader && <div className={styles.overlayHeader}>{overlayHeader}</div>}
              <div className={styles.overlayCanvas}>
                <MeasuredCanvas ratio={0.46} margin={margin} ariaLabel={ariaLabel}>
                  {children}
                </MeasuredCanvas>
              </div>
              {captionNode}
            </div>
          </div>,
          document.body,
        )}
    </figure>
  )
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
