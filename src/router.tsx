import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './app/AppLayout'
import { LandingPage } from './routes/LandingPage/LandingPage'
import { CompoundInterestPage } from './routes/tools/CompoundInterest/CompoundInterestPage'
import { TvmPage } from './routes/tools/Tvm/TvmPage'
import { BudgetPage } from './routes/tools/Budgeting/BudgetPage'

// Strip the trailing slash Vite puts on BASE_URL so React Router is happy at
// both "/" (local / Vercel) and "/ifdm-toolkit" (GitHub Pages subpath).
const basename = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/'

export const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      children: [
        { path: '/', element: <LandingPage /> },
        { path: '/tools/compound-interest', element: <CompoundInterestPage /> },
        { path: '/tools/tvm', element: <TvmPage /> },
        { path: '/tools/budgeting', element: <BudgetPage /> },
      ],
    },
  ],
  { basename },
)
