import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

// Self-hosted fonts (OFL) — bundled so instructors can deploy with no CDN.
import '@fontsource-variable/inter'

import 'katex/dist/katex.min.css'

import './styles/tokens.css'
import './styles/base.css'

import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
