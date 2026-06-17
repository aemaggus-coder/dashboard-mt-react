import type { DetailTableProps, TrendData } from '../../types';

// Stub deltas used for demo trend indicators — replace with real API data
const DEMO_TREND_DELTAS = [4.8, -2.1, 3.4, -1.3, 1.9, 0.7, -3.2];

export function trendFor(idx: number, higherIsBetter = true): TrendData {
  const delta = DEMO_TREND_DELTAS[idx % DEMO_TREND_DELTAS.length];
  const good  = higherIsBetter ? delta >= 0 : delta <= 0;
  return {
    sign:  delta >= 0 ? '▲' : '▼',
    cls:   good ? 'trend-up' : 'trend-down',
    delta: Math.abs(delta),
    periodLabel: undefined,
  };
}

export default function DetailTable({ rows, secondColumnLabel = 'к-во, чел.' }: DetailTableProps) {
  return (
    <table className="detail-table">
      <thead>
        <tr>
          <th>Наименование метрики</th>
          <th>{secondColumnLabel}</th>
          <th>Доля</th>
          <th>Тренд</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          const trend = row.trend ?? trendFor(idx);
          return (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{row.count}</td>
              <td>{row.share}</td>
              <td><span className={`detail-trend ${trend.cls}`}>{trend.sign} {trend.delta.toFixed(1)}%</span></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
