import { ALL_REGIONS, rfactor } from '../lib/constants';

const fmt = (n, decimals = 0) => {
  if (typeof n !== 'number' || !isFinite(n)) return n;
  return n.toLocaleString('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const fmtRegionValue = (value, decimals = 0, suffix = '') => {
  if (suffix) return `${fmt(value, decimals)}${suffix}`;
  const displayValue = value >= 1000 ? value / 1000 : value;
  return `${fmt(displayValue, displayValue >= 10 ? 0 : 1)} тыс. чел.`;
};

function topRegionsFor(kpi) {
  const base = typeof kpi.value === 'number' ? Math.abs(kpi.value) : 100000;
  const seed = Array.from(kpi.label || '').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return ALL_REGIONS
    .map((region, idx) => {
      const rotatedIdx = (idx + seed) % ALL_REGIONS.length;
      const wave = 0.82 + (((rotatedIdx * 37 + seed * 11) % 71) / 100);
      const factor = rfactor(`${region}-${kpi.label}`) * wave;
      const value = Math.max(1, base * factor);
      const delta = [6.2, 4.8, -2.4, 3.1, -1.7][(idx + seed) % 5];
      return {
        region,
        value,
        delta,
        trendClass: delta >= 0 ? 'trend-up' : 'trend-down',
        sign: delta >= 0 ? '▲' : '▼',
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

export default function KpiDetail({ kpi }) {
  const regions = topRegionsFor(kpi);
  const trend = kpi.trend || { sign: '→', cls: 'trend-flat', delta: 0 };
  const decimals = kpi.decimals || 0;
  const suffix = kpi.suffix || '';

  return (
    <div className="kpi-detail">
      <div className="kpi-detail-hero">
        <div>
          <div className="kpi-detail-label">Текущее значение</div>
          <div className="kpi-detail-value">
            {fmt(kpi.value, decimals)}{suffix}
          </div>
          <div className="kpi-detail-note">{kpi.note}</div>
        </div>
        <div className={`kpi-detail-trend ${trend.cls}`}>
          <span>{trend.sign}</span>
          <strong>{Math.abs(trend.delta || 0).toFixed(1)}%</strong>
          <em>{trend.periodLabel || 'к пред. периоду'}</em>
        </div>
      </div>

      <div className="kpi-detail-top-title">ТОП-5 регионов</div>
      <div className="kpi-region-list">
        {regions.map((item, idx) => (
          <div key={item.region} className="kpi-region-row">
            <span className="kpi-region-rank">{idx + 1}</span>
            <span className="kpi-region-name">{item.region}</span>
            <span className="kpi-region-value">{fmtRegionValue(item.value, decimals, suffix)}</span>
            <span className={`kpi-region-trend ${item.trendClass}`}>
              {item.sign} {Math.abs(item.delta).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
