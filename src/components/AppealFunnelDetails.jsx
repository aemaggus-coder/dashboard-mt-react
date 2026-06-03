import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import TrendBadge from './TrendBadge';
import { BASE, PREV_EXAM } from '../lib/constants';

export default function AppealFunnelDetails() {
  const { period } = useStore();
  const examData = useScaledData(BASE.exam[period], ['appealMain', 'appealFed']);
  const prevData = PREV_EXAM[period] || {};

  const rows = [
    {
      label: 'Главное бюро МСЭ',
      value: examData.appealMain.toLocaleString('ru-RU'),
      trend: <TrendBadge current={examData.appealMain} previous={prevData.ar ? (prevData.ar / 100) * prevData.tx * 0.8 : 0} />,
    },
    {
      label: 'Федеральное бюро МСЭ',
      value: examData.appealFed.toLocaleString('ru-RU'),
      trend: <TrendBadge current={examData.appealFed} previous={prevData.ar ? (prevData.ar / 100) * prevData.tx * 0.2 : 0} />,
    },
  ];

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid rgba(255,255,255,.09)' }}>
          <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Инстанция
          </th>
          <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Количество
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
            <td style={{ padding: '12px 16px', textAlign: 'right' }}>{row.trend}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
