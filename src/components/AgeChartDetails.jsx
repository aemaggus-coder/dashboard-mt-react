import { useState } from 'react';
import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';

export default function AgeChartDetails() {
  const [ageMode, setAgeMode] = useState('children');
  const scaledAge = useScaledData(BASE.age, ['values', 'male', 'female']);
  const ageData = scaledAge[ageMode];
  const total = ageData.values.reduce((sum, v) => sum + v, 0);

  const rows = ageData.labels.map((label, i) => [
    label,
    ageData.values[i].toLocaleString('ru-RU'),
    ageData.male[i].toLocaleString('ru-RU'),
    ageData.female[i].toLocaleString('ru-RU'),
    Math.round((ageData.values[i] / total) * 100) + '%',
  ]);

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        {['children', 'adults'].map(mode => (
          <button
            key={mode}
            onClick={() => setAgeMode(mode)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              background: ageMode === mode ? '#3b82f6' : 'rgba(59,130,246,.1)',
              color: ageMode === mode ? '#fff' : '#60a5fa',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {mode === 'children' ? 'Дети' : 'Взрослые'}
          </button>
        ))}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid rgba(255,255,255,.09)' }}>
            <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
              Возраст
            </th>
            <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
              Всего
            </th>
            <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
              Мужчины
            </th>
            <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
              Женщины
            </th>
            <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
              Доля
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
              <td style={{ padding: '12px 16px', textAlign: 'right', color: '#3f7bff', fontFamily: 'var(--mono)', fontWeight: '600' }}>
                {row[2]}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', color: '#ec4899', fontFamily: 'var(--mono)', fontWeight: '600' }}>
                {row[3]}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text)', fontFamily: 'var(--mono)', fontWeight: '600' }}>
                {row[4]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
