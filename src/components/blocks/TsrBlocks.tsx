import { useStore } from '../../hooks/useStore';
import { useSF } from '../../hooks/useSF';
import { BASE, applyScaleToObject } from '../../lib/constants';
import { fmt, fmt1 } from '../../lib/formatters';
import DetailTable, { trendFor } from './DetailTable';

function scale(sf: number, data: Record<string, any>, keys: string[] = []): Record<string, any> {
  if (sf === 1) return data;
  return applyScaleToObject(data, sf, keys);
}

const ISSUE_MODES = {
  all: { key: 'all', label: 'Всего', className: 'col-total' },
  cert: { key: 'cert', label: 'Сертификат', className: 'col-cert' },
  nat: { key: 'nat', label: 'Натуральное', className: 'col-nat' },
};

const isAbsorbentGroup = (name) => name.toLowerCase().includes('абсорбирующее бель');

function getTsrModeValues(group, mode) {
  const rawTotal = (group.nat + group.cert) || 1;
  if (mode === 'all') {
    return {
      people: group.people,
      count: isAbsorbentGroup(group.name) ? group.people * 500 : Math.max(rawTotal, group.people),
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

export function IssuedBlock() {
  const { period } = useStore();
  const sf = useSF();
  const periodWord = period === 'today' ? 'сегодня' : 'с начала года';
  const d = scale(sf, (BASE.tsr as Record<string, typeof BASE.tsr.today>)[period] || BASE.tsr.ytd, ['issuedNat', 'issuedCert']);
  const n = d.issuedNat, c = d.issuedCert, total = n + c || 1;

  return (
    <div>
      <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text)', margin: '12px 0 2px' }}>{fmt(n + c)}</div>
      <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>единиц ТСР · {periodWord}</div>
      <DetailTable rows={[
        { name: 'Натуральное', count: fmt(n), share: ((n / total) * 100).toFixed(1) + '%', trend: trendFor(0) },
        { name: 'Эл. сертификат', count: fmt(c), share: ((c / total) * 100).toFixed(1) + '%', trend: trendFor(1) },
        { name: 'Всего', count: fmt(total), share: '100%', trend: trendFor(2) },
      ]} />
    </div>
  );
}

export function BudgetBlock() {
  const { period } = useStore();
  const sf = useSF();
  const periodWord = period === 'today' ? 'сегодня' : 'с начала года';
  const d = scale(sf, (BASE.tsr as Record<string, typeof BASE.tsr.today>)[period] || BASE.tsr.ytd, ['budgetTotal', 'budgetUsed']);
  const safeTotal = d.budgetTotal || 1;
  const remaining = d.budgetTotal - d.budgetUsed;
  const bp = ((d.budgetUsed / safeTotal) * 100).toFixed(1);
  const col = parseFloat(bp) < 60 ? '#ef4444' : '#10b981';

  return (
    <div>
      <div style={{ fontSize: '28px', fontWeight: '900', color: col, margin: '12px 0 2px' }}>{bp}%</div>
      <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>освоение · {periodWord}</div>
      <DetailTable
        secondColumnLabel="Сумма, млн.р."
        rows={[
          { name: 'Выделено', count: fmt1(d.budgetTotal) + ' млн ₽', share: '100%', trend: trendFor(0) },
          { name: 'Исполнено', count: fmt1(d.budgetUsed) + ' млн ₽', share: bp + '%', trend: trendFor(1) },
          { name: 'Остаток', count: fmt1(remaining) + ' млн ₽', share: (100 - parseFloat(bp)).toFixed(1) + '%', trend: trendFor(2, false) },
        ]}
      />
    </div>
  );
}

export function GroupsBlock() {
  const { period, issueMode, setIssueMode } = useStore();
  const sf = useSF();
  const d = scale(sf, (BASE.tsr as Record<string, typeof BASE.tsr.today>)[period] || BASE.tsr.ytd, ['groups']);
  const issueCfg = ISSUE_MODES[issueMode] || ISSUE_MODES.all;

  return (
    <div>
      <div className="tsr-toggle-row">
        <div className="tsr-head-toggle" role="group" aria-label="Тип выдачи ТСР">
          {Object.values(ISSUE_MODES).map((mode) => (
            <button key={mode.key} type="button" className={`tsr-head-toggle-btn ${issueCfg.key === mode.key ? 'active' : ''}`} onClick={() => setIssueMode(mode.key as import("../../types").IssueMode)}>
              {mode.label}
            </button>
          ))}
        </div>
      </div>
      <table className="tsr-table detail-tsr-table">
        <thead>
          <tr>
            <th>Группа ТСР</th>
            <th>Получателей</th>
            <th className={`${issueCfg.className} tsr-issued-cell`}>Кол-во ТСР</th>
            <th className="col-sum">Сумма (млн ₽)</th>
          </tr>
        </thead>
        <tbody>
          {d.groups.map((g) => {
            const mv = getTsrModeValues(g, issueCfg.key);
            return (
              <tr key={g.name}>
                <td>{g.name}</td>
                <td className="col-people">{fmt(mv.people)}</td>
                <td className={issueCfg.className}>{fmt(mv.count)}</td>
                <td className="col-sum">{fmt1(mv.sum)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
