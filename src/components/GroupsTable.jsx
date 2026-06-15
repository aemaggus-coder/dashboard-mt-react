import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';

const fmt = (n) => Math.round(n).toLocaleString('ru-RU');
const fmt1 = (n) => n.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function GroupsTable() {
  const { period, issueMode, setIssueMode } = useStore();
  const tsrData = useScaledData(BASE.tsr[period] || BASE.tsr.today, ['groups']);
  const groups = tsrData.groups;
  const issueCfg = issueMode === 'nat'
    ? { key: 'nat', className: 'col-nat' }
    : { key: 'cert', className: 'col-cert' };

  return (
    <div className="tsr-wrap">
      <table className="tsr-table">
        <thead>
          <tr>
            <th>Группа ТСР</th>
            <th>Получателей</th>
            <th className={`${issueCfg.className} tsr-sub-head tsr-issued-cell`}>
              <div className="tsr-head-toggle" role="group" aria-label="Тип выдачи ТСР">
                <button
                  className={`tsr-head-toggle-btn ${issueMode === 'nat' ? 'active' : ''}`}
                  onClick={() => setIssueMode('nat')}
                  type="button"
                >
                  <span className="tsr-sq tsr-sq-fill"></span>
                  Натуральные
                </button>
                <button
                  className={`tsr-head-toggle-btn ${issueMode === 'cert' ? 'active' : ''}`}
                  onClick={() => setIssueMode('cert')}
                  type="button"
                >
                  <span className="tsr-sq tsr-sq-half"></span>
                  Сертификат
                </button>
              </div>
            </th>
            <th className="col-sum">Сумма (млн ₽)</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g, idx) => {
            const total = (g.nat + g.cert) || 1;
            const modeSum = issueMode === 'nat'
              ? g.sum * g.nat / total
              : g.sum * g.cert / total;
            return (
              <tr key={idx}>
                <td>{g.name}</td>
                <td className="col-people">{fmt(g.people)}</td>
                <td className={issueCfg.className}>{fmt(g[issueCfg.key])}</td>
                <td className="col-sum">{fmt1(modeSum)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
