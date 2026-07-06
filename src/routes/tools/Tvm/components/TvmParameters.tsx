import { NumberField, SegmentedControl, Slider, type Segment } from '../../../../design-system'
import { formatUSDWhole } from '../../../../lib/format'
import type { TvmMode, TvmState } from '../state'

const MODE_OPTIONS: Segment<TvmMode>[] = [
  { value: 'loan', label: 'Borrow' },
  { value: 'save', label: 'Save' },
  { value: 'calc', label: 'Calculator' },
]

export function TvmParameters({
  state,
  onChange,
}: {
  state: TvmState
  onChange: (patch: Partial<TvmState>) => void
}) {
  const isLoan = state.mode === 'loan'
  const isCalc = state.mode === 'calc'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <SegmentedControl
        label="What are you working out?"
        options={MODE_OPTIONS}
        value={state.mode}
        onChange={(mode) => onChange({ mode })}
      />

      {isCalc ? (
        <p
          style={{
            fontSize: 'var(--fs-ui)',
            color: 'var(--text-muted)',
            lineHeight: 1.55,
          }}
        >
          The five-key calculator. Enter any four of <strong>N, I/Y, PV, PMT, FV</strong> and pick
          the one to solve for — the same model a financial calculator uses. Remember the sign rule:
          money you receive is positive, money you pay out is negative.
        </p>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <NumberField
              label={isLoan ? 'Loan amount' : 'Goal amount'}
              value={state.amount}
              onChange={(amount) => onChange({ amount })}
              min={0}
              max={2_000_000}
              prefix="$"
              precision={0}
            />
            <Slider
              label=""
              value={Math.min(state.amount, isLoan ? 500_000 : 200_000)}
              onChange={(amount) => onChange({ amount })}
              min={0}
              max={isLoan ? 500_000 : 200_000}
              step={1000}
              readout={formatUSDWhole(state.amount)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <NumberField
              label="Annual interest rate"
              value={state.ratePct}
              onChange={(ratePct) => onChange({ ratePct })}
              min={0}
              max={40}
              suffix="%"
              precision={2}
            />
            <Slider
              label=""
              value={Math.min(state.ratePct, 30)}
              onChange={(ratePct) => onChange({ ratePct })}
              min={0}
              max={30}
              step={0.25}
              readout={`${state.ratePct}%`}
            />
          </div>

          <Slider
            label={isLoan ? 'Loan term' : 'Time to save'}
            value={Math.min(state.years, isLoan ? 30 : 40)}
            onChange={(years) => onChange({ years })}
            min={1}
            max={isLoan ? 30 : 40}
            step={1}
            readout={`${state.years} ${state.years === 1 ? 'year' : 'years'}`}
            note="Payments are monthly."
          />
        </>
      )}
    </div>
  )
}
