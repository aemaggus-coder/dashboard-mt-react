import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';

export default function IssuedChartsDetails() {
  const { period } = useStore();
  const data = useScaledData(BASE.tsr[period], ['issuedNat', 'issuedCert']);
  const total = data.issuedNat + data.issuedCert;

  const rows = [
    ['Натуральное', data.issuedNat.toLocaleString('ru-RU'), ((data.issuedNat / total) * 100).toFixed(1) + '%'],
    ['Электронный сертификат', data.issuedCert.toLocaleString('ru-RU'), ((data.issuedCert / total) * 100).toFixed(1) + '%'],
    ['Всего', total.toLocaleString('ru-RU'), '100%'],
  ];

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid rgba(255,255,255,.09)' }}>
          <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Способ
          </th>
          <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--text-2)', fontSize: '12px', fontWeight: '700' }}>
            Количество
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
            <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text)', fontFamily: 'var(--mono)', fontWeight: '600' }}>
              {row[2]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
