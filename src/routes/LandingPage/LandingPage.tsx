import { Link } from 'react-router-dom'
import styles from './LandingPage.module.css'

interface ToolEntry {
  number: string
  title: string
  lecture: string
  blurb: string
  to?: string
  status: 'live' | 'planned'
}

const TOOLS: ToolEntry[] = [
  {
    number: '1',
    title: 'Compound interest',
    lecture: 'Lessons 1–2',
    blurb:
      'Watch money grow, see exactly how much of the result is interest earning interest, and read the formula with real numbers filled in. Built as a step-by-step activity.',
    to: '/tools/compound-interest',
    status: 'live',
  },
  {
    number: '2',
    title: 'Time value of money',
    lecture: 'Lessons 2–3',
    blurb:
      'Work out the monthly payment on a loan, or how much to save each month to reach a goal — plus a traditional five-key calculator (N, I/Y, PV, PMT, FV) that solves for any value.',
    to: '/tools/tvm',
    status: 'live',
  },
  {
    number: '3',
    title: 'Budgeting & balance sheet',
    lecture: 'Lesson 4',
    blurb:
      'Build a monthly budget and a balance sheet, then see what your leftover money could become if you invest it — connecting everyday choices back to compounding.',
    to: '/tools/budgeting',
    status: 'live',
  },
]

export function LandingPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>For teaching personal finance</p>
        <h1 className={styles.headline}>Hands-on tools for the personal-finance classroom</h1>
        <p className={styles.lead}>
          Short, interactive activities that make the core ideas of a personal-finance course
          click. Students change the numbers and see what happens; every figure traces back to an
          open, tested math engine. Built for instructors to use, adapt, and share.
        </p>
      </section>

      <section className={styles.tools}>
        <h2 className={styles.toolsHeading}>The tools</h2>
        <div className={styles.toolList}>
          {TOOLS.map((tool) => {
            const live = tool.status === 'live'
            const inner = (
              <>
                <span className={styles.toolNum}>{tool.number}</span>
                <span className={styles.toolBody}>
                  <span className={styles.toolHead}>
                    <span className={styles.toolTitle}>{tool.title}</span>
                    <span className={styles.toolLecture}>{tool.lecture}</span>
                  </span>
                  <span className={styles.toolBlurb}>{tool.blurb}</span>
                  <span className={live ? styles.toolCta : styles.toolSoon}>
                    {live ? 'Open the tool →' : 'Coming soon'}
                  </span>
                </span>
              </>
            )
            return tool.to ? (
              <Link key={tool.number} to={tool.to} className={styles.toolCard}>
                {inner}
              </Link>
            ) : (
              <div key={tool.number} className={`${styles.toolCard} ${styles.toolPlanned}`}>
                {inner}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
