import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';

const fmt = (n) => Math.round(n).toLocaleString('ru-RU');
const fmt1 = (n) => n.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function GroupsTable() {
  const { period } = useStore();
  const tsrData = useScaledData(BASE.tsr[period] || BASE.tsr.today, ['groups']);
  const groups = tsrData.groups;

  return (
    <div className="tsr-wrap">
      <table className="tsr-table">
        <thead>
          <tr>
            <th rowSpan="2">Группа ТСР</th>
            <th rowSpan="2">Получателей</th>
            <th colSpan="2" className="tsr-group-head">Выдано</th>
            <th rowSpan="2" className="col-sum">Сумма (млн ₽)</th>
          </tr>
          <tr>
            <th className="col-nat tsr-sub-head"><span className="tsr-sq tsr-sq-fill"></span>Натуральное</th>
            <th className="col-cert tsr-sub-head"><span className="tsr-sq tsr-sq-half"></span>Сертификат</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g, idx) => (
            <tr key={idx}>
              <td>{g.name}</td>
              <td className="col-people">{fmt(g.people)}</td>
              <td className="col-nat">{fmt(g.nat)}</td>
              <td className="col-cert">{fmt(g.cert)}</td>
              <td className="col-sum">{fmt1(g.sum)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
