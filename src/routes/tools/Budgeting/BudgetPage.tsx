import { useMemo, useState } from 'react'
import {
  Callout,
  Card,
  NumberField,
  Slider,
  Stat,
  StepHeader,
  Tabs,
  type TabItem,
} from '../../../design-system'
import { growthSeries } from '../../../lib/finance'
import { formatPercent, formatUSDWhole } from '../../../lib/format'
import { LineItemsEditor, newItem, sumItems, type LineItem } from './components/LineItemsEditor'
import { GoalChart } from './components/GoalChart'
import styles from './BudgetPage.module.css'

type Surface = 'budget' | 'balance' | 'goal'

const TABS: TabItem<Surface>[] = [
  { value: 'budget', label: 'Monthly budget' },
  { value: 'balance', label: 'Balance sheet' },
  { value: 'goal', label: 'Your goal' },
]

const GREEN = 'var(--c-series-1)'
const CARDINAL = 'var(--c-accent)'

export function BudgetPage() {
  const [surface, setSurface] = useState<Surface>('budget')

  const [income, setIncome] = useState<LineItem[]>(() => [
    newItem('Take-home pay', 4000),
    newItem('Side income', 300),
  ])
  const [expenses, setExpenses] = useState<LineItem[]>(() => [
    newItem('Rent', 1500),
    newItem('Groceries', 500),
    newItem('Transportation', 300),
    newItem('Utilities & phone', 250),
    newItem('Everything else', 600),
  ])
  const [assets, setAssets] = useState<LineItem[]>(() => [
    newItem('Checking', 2000),
    newItem('Savings', 8000),
    newItem('Car', 12000),
  ])
  const [liabilities, setLiabilities] = useState<LineItem[]>(() => [
    newItem('Student loans', 15000),
    newItem('Credit cards', 1500),
    newItem('Car loan', 8000),
  ])

  const [goalRate, setGoalRate] = useState(7)
  const [goalYears, setGoalYears] = useState(10)

  const totalIncome = sumItems(income)
  const totalExpenses = sumItems(expenses)
  const surplus = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? surplus / totalIncome : 0

  const totalAssets = sumItems(assets)
  const totalLiab = sumItems(liabilities)
  const netWorth = totalAssets - totalLiab

  const monthly = Math.max(0, surplus)
  const goalSeries = useMemo(
    () =>
      growthSeries({
        principal: 0,
        annualRate: goalRate / 100,
        years: goalYears,
        freq: { kind: 'periodic', m: 12 },
        contribution: monthly > 0 ? { amount: monthly, timing: 'ordinary' } : undefined,
      }).points,
    [monthly, goalRate, goalYears],
  )
  const goalFinal = goalSeries.length ? goalSeries[goalSeries.length - 1]!.balance : 0
  const goalContributed = monthly * goalYears * 12

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Lesson · Budgeting</p>
        <h1 className={styles.h1}>Where your money goes</h1>
        <p className={styles.lead}>
          A budget shows what comes in and goes out each month; a balance sheet shows what you own
          and owe. Edit the rows below — then see what your leftover money could become if you
          invest it.
        </p>
      </header>

      <div className={styles.tabBar}>
        <Tabs items={TABS} value={surface} onChange={setSurface} />
      </div>

      <Card tone="raised" className={styles.panel}>
        {surface === 'budget' && (
          <>
            <StepHeader
              title="Your monthly budget"
              hint="List what comes in and what goes out. The totals update as you type."
            />
            <div className={styles.editors}>
              <LineItemsEditor
                title="Money in"
                items={income}
                onChange={setIncome}
                accent={GREEN}
                addLabel="Add income"
              />
              <LineItemsEditor
                title="Money out"
                items={expenses}
                onChange={setExpenses}
                accent={CARDINAL}
                addLabel="Add expense"
              />
            </div>
            <div className={styles.stats}>
              <Stat label="Income" value={totalIncome} format={formatUSDWhole} />
              <Stat label="Expenses" value={totalExpenses} format={formatUSDWhole} />
              <Stat
                label="Left over each month"
                value={surplus}
                format={formatUSDWhole}
                emphasis
                accentColor={surplus >= 0 ? GREEN : CARDINAL}
              />
              <Stat
                label="Savings rate"
                value={savingsRate}
                format={(v) => formatPercent(v, 0)}
                animate={false}
              />
            </div>
            <Callout tone={surplus >= 0 ? 'note' : 'mark'} label="What this means">
              {surplus >= 0 ? (
                <>
                  You keep <strong>{formatUSDWhole(surplus)}</strong> a month —{' '}
                  {formatPercent(savingsRate, 0)} of what you earn. The <em>Your goal</em> tab shows
                  what that becomes if you invest it.
                </>
              ) : (
                <>
                  You&rsquo;re spending <strong>{formatUSDWhole(-surplus)}</strong> more than you
                  earn each month. Trim an expense or add income until this turns positive.
                </>
              )}
            </Callout>
          </>
        )}

        {surface === 'balance' && (
          <>
            <StepHeader
              title="What you own and owe"
              hint="Assets are what you have; liabilities are what you owe. The difference is your net worth."
            />
            <div className={styles.editors}>
              <LineItemsEditor
                title="Assets (what you own)"
                items={assets}
                onChange={setAssets}
                accent={GREEN}
                addLabel="Add asset"
              />
              <LineItemsEditor
                title="Liabilities (what you owe)"
                items={liabilities}
                onChange={setLiabilities}
                accent={CARDINAL}
                addLabel="Add debt"
              />
            </div>
            <div className={styles.stats}>
              <Stat label="Total assets" value={totalAssets} format={formatUSDWhole} />
              <Stat label="Total debts" value={totalLiab} format={formatUSDWhole} />
              <Stat
                label="Net worth"
                value={netWorth}
                format={formatUSDWhole}
                emphasis
                accentColor={netWorth >= 0 ? GREEN : CARDINAL}
              />
            </div>
            <Callout tone={netWorth >= 0 ? 'note' : 'mark'} label="What this means">
              Your net worth is <strong>{formatUSDWhole(netWorth)}</strong>
              {netWorth < 0
                ? ' — you owe more than you own right now, which is common early on. Paying down debt and saving both move this upward.'
                : ' — what would be left if you sold everything and paid off every debt.'}
            </Callout>
          </>
        )}

        {surface === 'goal' && (
          <>
            <StepHeader
              title="Turn your surplus into wealth"
              hint="Your leftover money, invested every month — this is the annuity idea from the Time Value of Money tool."
            />
            {monthly <= 0 ? (
              <Callout tone="mark" label="No surplus yet">
                Right now there&rsquo;s nothing left over to invest. Head back to the{' '}
                <em>Monthly budget</em> tab and get your &ldquo;left over&rdquo; above zero first.
              </Callout>
            ) : (
              <>
                <p className={styles.goalLine}>
                  Investing your <strong>{formatUSDWhole(monthly)}/month</strong> surplus at
                </p>
                <div className={styles.goalControls}>
                  <NumberField
                    label="Annual return"
                    value={goalRate}
                    onChange={setGoalRate}
                    min={0}
                    max={15}
                    suffix="%"
                    precision={1}
                  />
                  <Slider
                    label="For how long"
                    value={goalYears}
                    onChange={setGoalYears}
                    min={1}
                    max={40}
                    step={1}
                    readout={`${goalYears} years`}
                  />
                </div>
                <div className={styles.stats}>
                  <Stat
                    label="Could grow to"
                    value={goalFinal}
                    format={formatUSDWhole}
                    emphasis
                    accentColor={GREEN}
                  />
                  <Stat label="You'd contribute" value={goalContributed} format={formatUSDWhole} />
                  <Stat
                    label="Interest adds"
                    value={goalFinal - goalContributed}
                    format={formatUSDWhole}
                    accentColor={GREEN}
                  />
                </div>
                <GoalChart points={goalSeries} years={goalYears} />
                <Callout tone="note" label="The payoff">
                  Setting aside <strong>{formatUSDWhole(monthly)}</strong> a month for {goalYears}{' '}
                  years could grow to <strong>{formatUSDWhole(goalFinal)}</strong>. You&rsquo;d put
                  in {formatUSDWhole(goalContributed)}; compounding adds the other{' '}
                  {formatUSDWhole(goalFinal - goalContributed)}.
                </Callout>
              </>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
