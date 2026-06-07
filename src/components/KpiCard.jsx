import { useAnimatedValue } from '../hooks/useAnimatedValue';

export default function KpiCard({ label, value, note, status = 'ok', decimals = 0, suffix = '', trend }) {
  const animatedValue = useAnimatedValue(value, 1100);

  const fmt = (n) => {
    if (typeof n !== 'number' || isNaN(n)) return n;
    if (decimals > 0) {
      return n.toLocaleString('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }
    return Math.round(n).toLocaleString('ru-RU');
  };

  return (
    <div className={`kpi ${status}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">
        {fmt(animatedValue)}{suffix}
      </div>
      <div className="kpi-note">{note}</div>
      <div style={{ height: '16px' }}>
        {trend && (
          <span className={`kpi-trend ${trend.cls}`}>
            {trend.sign} {Math.abs(trend.delta).toFixed(1)}% к пред. периоду
          </span>
        )}
      </div>
    </div>
  );
}
