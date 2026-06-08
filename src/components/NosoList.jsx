import { useSF } from '../hooks/useSF';
import { BASE } from '../lib/constants';

const NOSO_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
const fmt = (n) => Math.round(n).toLocaleString('ru-RU');

export default function NosoList() {
  const f = useSF();
  const total = BASE.nosology.reduce((s, n) => s + n.value, 0);
  const mx = Math.max(...BASE.nosology.map((n) => n.value));

  return (
    <div className="noso-list">
      {BASE.nosology.map((n, i) => {
        const count = Math.round((BASE.total * f * n.value) / total);
        const pct = Math.round((n.value / total) * 100);
        const barPct = Math.round((n.value / mx) * 100);
        const col = NOSO_COLORS[i % NOSO_COLORS.length];
        return (
          <div key={i} className="noso-item">
            <div className="noso-head">
              <div className="noso-name" title={n.name}>{n.name}</div>
              <span className="noso-count">{fmt(count)}</span>
            </div>
            <div className="noso-row">
              <span className="noso-pct" style={{ background: col }}>{pct}%</span>
              <div className="noso-track">
                <div className="noso-fill" style={{ width: `${barPct}%`, background: col }}></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
