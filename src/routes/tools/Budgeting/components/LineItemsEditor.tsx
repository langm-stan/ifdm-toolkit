import { formatUSDWhole } from '../../../../lib/format'
import styles from './LineItemsEditor.module.css'

export interface LineItem {
  id: string
  label: string
  amount: number
}

let uid = 0
export function newItem(label = '', amount = 0): LineItem {
  uid += 1
  return { id: `li-${uid}`, label, amount }
}

export function sumItems(items: LineItem[]): number {
  return items.reduce((acc, it) => acc + (Number.isFinite(it.amount) ? it.amount : 0), 0)
}

interface LineItemsEditorProps {
  title: string
  items: LineItem[]
  onChange: (items: LineItem[]) => void
  accent?: string
  addLabel?: string
}

export function LineItemsEditor({
  title,
  items,
  onChange,
  accent,
  addLabel = 'Add a row',
}: LineItemsEditorProps) {
  function set(id: string, patch: Partial<LineItem>) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }
  function remove(id: string) {
    onChange(items.filter((it) => it.id !== id))
  }
  function add() {
    onChange([...items, newItem()])
  }

  return (
    <div className={styles.group}>
      <div className={styles.head}>
        <span className={styles.title}>{title}</span>
        <span className={`${styles.total} tnum`} style={accent ? { color: accent } : undefined}>
          {formatUSDWhole(sumItems(items))}
        </span>
      </div>

      <div className={styles.rows}>
        {items.map((it) => (
          <div key={it.id} className={styles.row}>
            <input
              className={styles.label}
              value={it.label}
              placeholder="Label"
              onChange={(e) => set(it.id, { label: e.target.value })}
            />
            <div className={styles.amountWrap}>
              <span className={styles.dollar}>$</span>
              <input
                className={`${styles.amount} tnum`}
                inputMode="decimal"
                value={it.amount === 0 ? '' : String(it.amount)}
                placeholder="0"
                onChange={(e) => {
                  const n = Number(e.target.value.replace(/[^0-9.\-]/g, ''))
                  set(it.id, { amount: Number.isFinite(n) ? n : 0 })
                }}
              />
            </div>
            <button
              type="button"
              className={styles.remove}
              onClick={() => remove(it.id)}
              aria-label={`Remove ${it.label || 'row'}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button type="button" className={styles.add} onClick={add}>
        + {addLabel}
      </button>
    </div>
  )
}
