import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';

export default function GroupsTable() {
  const { period } = useStore();
  const tsrData = useScaledData(BASE.tsr[period], ['groups']);
  const groups = tsrData.groups;

  return (
    <div className="tsr-wrap">
      <table className="tsr-table">
        <thead>
          <tr>
            <th colSpan="4" className="tsr-group-head">
              Распределение по типам техсредств
            </th>
          </tr>
          <tr>
            <th>Категория</th>
            <th className="col-nat">
              <span className="tsr-sq tsr-sq-fill"></span>Национальные
            </th>
            <th className="col-cert">
              <span className="tsr-sq tsr-sq-half"></span>Сертифицированные
            </th>
            <th className="col-people">Получило (люди)</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, idx) => (
            <tr key={idx}>
              <td>{group.name}</td>
              <td className="col-nat">{group.nat.toLocaleString('ru-RU')}</td>
              <td className="col-cert">{group.cert.toLocaleString('ru-RU')}</td>
              <td className="col-people">{group.people.toLocaleString('ru-RU')}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: 'bold' }}>
            <td style={{ color: 'var(--text)' }}>Итого</td>
            <td className="col-nat" style={{ color: 'var(--blue-l)' }}>
              {groups.reduce((sum, g) => sum + g.nat, 0).toLocaleString('ru-RU')}
            </td>
            <td className="col-cert" style={{ color: '#a78bfa' }}>
              {groups.reduce((sum, g) => sum + g.cert, 0).toLocaleString('ru-RU')}
            </td>
            <td className="col-people">
              {groups.reduce((sum, g) => sum + g.people, 0).toLocaleString('ru-RU')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
