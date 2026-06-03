import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';

export default function NosoListDetails() {
  const scaledNosology = useScaledData(BASE.nosology, ['value']);
  const total = scaledNosology.reduce((sum, item) => sum + item.value, 0);

  const rows = scaledNosology.map(item => [
    item.name,
    Math.round((item.value / total) * 100) + '%',
    item.value.toLocaleString('ru-RU'),
  ]);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid rgba(255,255,255,.09)' }}>
          <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Нозология
          </th>
          <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Доля
          </th>
          <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Численность
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <td style={{ padding: '12px 16px', color: 'var(--text)' }}>{row[0]}</td>
            <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text)', fontFamily: 'var(--mono)', fontWeight: '600' }}>
              {row[1]}
            </td>
            <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text)', fontFamily: 'var(--mono)', fontWeight: '600' }}>
              {row[2]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
