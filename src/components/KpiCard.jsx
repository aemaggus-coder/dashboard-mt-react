import { useAnimatedValue } from '../hooks/useAnimatedValue';

export default function KpiCard({ label, value, note, status = 'ok' }) {
  const animatedValue = useAnimatedValue(value, 500);

  const fmt = (n) => {
    if (typeof n === 'number') {
      return Math.round(n).toLocaleString('ru-RU');
    }
    return n;
  };

  return (
    <div className={`kpi ${status}`}>
      <div className="kpi-label">{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <div className="kpi-value">{fmt(animatedValue)}</div>
        {note && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.6)' }}>{note}</div>}
      </div>
    </div>
  );
}
