import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './app/AppLayout'
import { LandingPage } from './routes/LandingPage/LandingPage'
import { CompoundInterestPage } from './routes/tools/CompoundInterest/CompoundInterestPage'
import { TvmPage } from './routes/tools/Tvm/TvmPage'
import { BudgetPage } from './routes/tools/Budgeting/BudgetPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/tools/compound-interest', element: <CompoundInterestPage /> },
      { path: '/tools/tvm', element: <TvmPage /> },
      { path: '/tools/budgeting', element: <BudgetPage /> },
    ],
  },
])
