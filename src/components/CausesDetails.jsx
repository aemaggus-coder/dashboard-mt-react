export default function CausesDetails() {
  const details = [
    {
      name: 'Общее заболевание',
      percent: 36,
      count: 781200,
      trend: '+2.3%',
      color: '#3f7bff',
    },
    {
      name: 'Ветераны',
      percent: 29,
      count: 629900,
      trend: '+0.8%',
      color: '#f59148',
    },
    {
      name: 'Трудовое увечье',
      percent: 4,
      count: 86836,
      trend: '-1.2%',
      color: '#8fdc5a',
    },
    {
      name: 'Проф. заболевание',
      percent: 11,
      count: 238798,
      trend: '+3.1%',
      color: '#b3a8e6',
    },
    {
      name: 'Детство',
      percent: 20,
      count: 434180,
      trend: '+0.5%',
      color: '#a9c4ff',
    },
  ];

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid rgba(255,255,255,.09)' }}>
          <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Причина инвалидности
          </th>
          <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Процент
          </th>
          <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Численность
          </th>
          <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Тренд
          </th>
        </tr>
      </thead>
      <tbody>
        {details.map((item, idx) => (
          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <td style={{ padding: '18px 16px', color: 'var(--text)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    backgroundColor: item.color,
                    flexShrink: 0,
                  }}
                />
                {item.name}
              </div>
            </td>
            <td style={{ padding: '18px 16px', textAlign: 'right', color: 'var(--text)', fontFamily: 'var(--mono)', fontWeight: '600' }}>
              {item.percent}%
            </td>
            <td style={{ padding: '18px 16px', textAlign: 'right', color: 'var(--text)', fontFamily: 'var(--mono)', fontWeight: '600' }}>
              {item.count.toLocaleString('ru-RU')}
            </td>
            <td style={{ padding: '18px 16px', textAlign: 'right', color: item.trend.startsWith('+') ? '#10b981' : '#ef4444', fontWeight: '600' }}>
              {item.trend}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
