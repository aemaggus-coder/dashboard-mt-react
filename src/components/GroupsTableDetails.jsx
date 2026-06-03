import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import TrendBadge from './TrendBadge';
import { BASE, PREV_TSR } from '../lib/constants';

export default function GroupsTableDetails() {
  const { period } = useStore();
  const tsrData = useScaledData(BASE.tsr[period], ['groups']);
  const groups = tsrData.groups;
  const prevData = PREV_TSR[period] || {};

  return (
    <div className="tsr-wrap">
      <table className="tsr-table" style={{ fontSize: '14px' }}>
        <thead>
          <tr>
            <th colSpan="5" className="tsr-group-head">
              Распределение по типам техсредств
            </th>
          </tr>
          <tr>
            <th>Категория</th>
            <th className="col-people" style={{ textAlign: 'right' }}>
              Получило (люди)
            </th>
            <th className="col-nat" style={{ textAlign: 'right' }}>
              Натуральные
            </th>
            <th className="col-cert" style={{ textAlign: 'right' }}>
              Сертифицированные
            </th>
            <th style={{ textAlign: 'right', width: '80px' }}>Тренд</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, idx) => (
            <tr key={idx}>
              <td>{group.name}</td>
              <td className="col-people" style={{ textAlign: 'right' }}>
                {group.people.toLocaleString('ru-RU')}
              </td>
              <td className="col-nat" style={{ textAlign: 'right' }}>
                {group.nat.toLocaleString('ru-RU')}
              </td>
              <td className="col-cert" style={{ textAlign: 'right' }}>
                {group.cert.toLocaleString('ru-RU')}
              </td>
              <td style={{ textAlign: 'right', padding: '12px 16px' }}>
                <TrendBadge current={group.people} previous={prevData.iss ? (prevData.iss / groups.length) * 0.5 : 0} isHigherIsBetter={true} />
              </td>
            </tr>
          ))}
          <tr style={{ fontWeight: 'bold' }}>
            <td style={{ color: 'var(--text)' }}>Итого</td>
            <td className="col-people" style={{ color: 'var(--text)', textAlign: 'right' }}>
              {groups.reduce((sum, g) => sum + g.people, 0).toLocaleString('ru-RU')}
            </td>
            <td className="col-nat" style={{ color: 'var(--blue-l)', textAlign: 'right' }}>
              {groups.reduce((sum, g) => sum + g.nat, 0).toLocaleString('ru-RU')}
            </td>
            <td className="col-cert" style={{ color: '#a78bfa', textAlign: 'right' }}>
              {groups.reduce((sum, g) => sum + g.cert, 0).toLocaleString('ru-RU')}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
