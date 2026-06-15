import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';
import { fmt, fmt1 } from '../lib/formatters';

const ISSUE_MODES = {
  all: { key: 'all', label: 'Всего', className: 'col-total' },
  cert: { key: 'cert', label: 'Сертификат', className: 'col-cert' },
  nat: { key: 'nat', label: 'Натуральное', className: 'col-nat' },
};

const isAbsorbentGroup = (name) => name.toLowerCase().includes('абсорбирующее бель');

function getModeValues(group, mode) {
  const rawTotal = (group.nat + group.cert) || 1;
  if (mode === 'all') {
    const people = group.people;
    return {
      people,
      count: isAbsorbentGroup(group.name) ? people * 500 : Math.max(rawTotal, people),
      sum: group.sum,
    };
  }

  const rawCount = group[mode] || 0;
  const share = rawCount / rawTotal;
  const people = Math.round(group.people * share);
  return {
    people,
    count: isAbsorbentGroup(group.name) ? people * 500 : Math.max(rawCount, people),
    sum: group.sum * share,
  };
}

export default function GroupsTable() {
  const { period, issueMode, setIssueMode } = useStore();
  const tsrData = useScaledData(BASE.tsr[period] || BASE.tsr.today, ['groups']);
  const groups = tsrData.groups;
  const issueCfg = ISSUE_MODES[issueMode] || ISSUE_MODES.all;

  return (
    <div className="tsr-wrap">
      <table className="tsr-table">
        <thead>
          <tr>
            <th>Группа ТСР</th>
            <th>Получателей</th>
            <th className={`${issueCfg.className} tsr-sub-head tsr-issued-cell`}>
              <div className="tsr-head-stack">
                <span className="tsr-head-label">Кол-во ТСР</span>
                <div className="tsr-head-toggle" role="group" aria-label="Тип выдачи ТСР">
                  {Object.values(ISSUE_MODES).map((mode) => (
                    <button
                      key={mode.key}
                      className={`tsr-head-toggle-btn ${issueCfg.key === mode.key ? 'active' : ''}`}
                      onClick={() => setIssueMode(mode.key)}
                      type="button"
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </th>
            <th className="col-sum">Сумма (млн ₽)</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g, idx) => {
            const modeValues = getModeValues(g, issueCfg.key);
            return (
              <tr key={g.name}>
                <td>{g.name}</td>
                <td className="col-people">{fmt(modeValues.people)}</td>
                <td className={issueCfg.className}>{fmt(modeValues.count)}</td>
                <td className="col-sum">{fmt1(modeValues.sum)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
