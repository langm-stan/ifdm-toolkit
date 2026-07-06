import { Link, NavLink, Outlet, useSearchParams } from 'react-router-dom'
import { ThemeToggle } from '../design-system/ThemeToggle'
import { PresentationToggle } from '../design-system/PresentationToggle'
import styles from './AppLayout.module.css'

/**
 * The platform shell: masthead + footer wrapping every route. `?embed=1` strips
 * the chrome so a single tool can be dropped into a course page or LMS.
 */
export function AppLayout() {
  const [params] = useSearchParams()
  const embed = params.get('embed') === '1'

  if (embed) {
    return (
      <div className={styles.embedRoot}>
        <Outlet />
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <header className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <Link to="/" className={styles.wordmark} aria-label="Home">
            <span className={styles.mark} aria-hidden="true" />
            <span className={styles.wordmarkText}>
              <span className={styles.wordmarkLede}>The Financial Decision-Making</span>
              <span className={styles.wordmarkTitle}>Toolkit</span>
            </span>
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
            >
              Tools
            </NavLink>
            <a
              className={styles.navLink}
              href="https://ifdm.stanford.edu/resourcehub"
              target="_blank"
              rel="noreferrer"
            >
              IFDM Resource Hub
            </a>
            <PresentationToggle />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerNote}>
            Built for instructors of personal finance, in the spirit of Stanford&rsquo;s
            Initiative for Financial Decision-Making. Every figure on this site is computed
            by an open, unit-tested math engine.
          </p>
        </div>
      </footer>
    </div>
  )
}
