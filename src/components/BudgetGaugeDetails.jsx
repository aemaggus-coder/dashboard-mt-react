import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';

export default function BudgetGaugeDetails() {
  const { period } = useStore();
  const data = useScaledData(BASE.tsr[period], ['budgetTotal', 'budgetUsed']);
  const remaining = data.budgetTotal - data.budgetUsed;

  const rows = [
    ['Выделено', data.budgetTotal.toFixed(1) + ' млн ₽'],
    ['Освоено', data.budgetUsed.toFixed(1) + ' млн ₽'],
    ['Остаток', remaining.toFixed(1) + ' млн ₽'],
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
        {rows.map((row, idx) => (
          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <td style={{ padding: '12px 16px', color: 'var(--text)' }}>{row[0]}</td>
            <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text)', fontFamily: 'var(--mono)', fontWeight: '600' }}>
              {row[1]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
