import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import TrendBadge from './TrendBadge';
import { BASE, PREV_EXAM } from '../lib/constants';

export default function PrimaryStatsDetails() {
  const { period, scope, selectedRegions } = useStore();
  const examData = useScaledData(BASE.exam[period], ['primary', 'reexam']);
  const primary = examData.primary;
  const reexam = examData.reexam;
  const total = primary + reexam;
  const prevTotal = PREV_EXAM[period]?.tx || 0;

  const scopeName =
    scope === 'rf' ? 'Российская Федерация' : scope === 'fo' ? 'Федеральные округа' : selectedRegions.length === 1 ? selectedRegions[0] : `${selectedRegions.length} регионов`;

  const rows = [
    {
      label: 'Первичная инвалидность',
      value: primary.toLocaleString('ru-RU'),
      percent: ((primary / total) * 100).toFixed(1) + '%',
      trend: <TrendBadge current={primary} previous={prevTotal * 0.35} />,
    },
    {
      label: 'Переосвидетельствование',
      value: reexam.toLocaleString('ru-RU'),
      percent: ((reexam / total) * 100).toFixed(1) + '%',
      trend: <TrendBadge current={reexam} previous={prevTotal * 0.65} />,
    },
    {
      label: 'Всего',
      value: total.toLocaleString('ru-RU'),
      percent: '100%',
      trend: <TrendBadge current={total} previous={prevTotal} />,
    },
  ];

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid rgba(255,255,255,.09)' }}>
          <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Вид
          </th>
          <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Количество
          </th>
          <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Доля
          </th>
          <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Тренд
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <td style={{ padding: '12px 16px', color: 'var(--text)' }}>{row.label}</td>
            <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text)', fontFamily: 'var(--mono)', fontWeight: '600' }}>
              {row.value}
            </td>
            <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text)', fontFamily: 'var(--mono)', fontWeight: '600' }}>
              {row.percent}
            </td>
            <td style={{ padding: '12px 16px', textAlign: 'right' }}>{row.trend}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
