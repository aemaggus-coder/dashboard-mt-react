import { useSF } from '../hooks/useSF';
import { useStore } from '../hooks/useStore';
import { BASE, nosoForSeed } from '../lib/constants';
import { fmt } from '../lib/formatters';

const NOSO_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

export default function NosoList() {
  const f = useSF();
  const { scope, selectedRegions, selectedFo } = useStore();
  const seed = scope === 'rf' ? '' : `${scope}::${selectedFo ?? ''}::${selectedRegions.join(',')}`;
  const nosology = nosoForSeed(seed);
  const total = nosology.reduce((s, n) => s + n.value, 0);
  const mx = Math.max(...nosology.map((n) => n.value));

  return (
    <div className="noso-list">
      {nosology.map((n, i) => {
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
