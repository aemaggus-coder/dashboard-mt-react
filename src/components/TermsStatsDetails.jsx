import { useStore } from '../hooks/useStore';
import { BASE } from '../lib/constants';

export default function TermsStatsDetails() {
  const { period } = useStore();
  const terms = BASE.exam[period].terms;
  const deviation = (terms - 30).toFixed(1);

  const rows = [
    ['Средний срок', terms.toFixed(1) + ' дней'],
    ['Норматив', '30 дней'],
    ['Отклонение', (terms > 30 ? '+' : '') + deviation + ' дней'],
  ];

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid rgba(255,255,255,.09)' }}>
          <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Показатель
          </th>
          <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Значение
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          const isDeviation = idx === 2;
          const deviationColor = terms > 30 ? '#ef4444' : '#10b981';
          return (
            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
              <td style={{ padding: '12px 16px', color: 'var(--text)' }}>{row[0]}</td>
              <td
                style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  color: isDeviation ? deviationColor : 'var(--text)',
                  fontFamily: 'var(--mono)',
                  fontWeight: '600',
                }}
              >
                {row[1]}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
