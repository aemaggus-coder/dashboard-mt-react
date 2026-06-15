import { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { useSF } from '../hooks/useSF';
import { BASE, applyScaleToObject, applyScaleToValue } from '../lib/constants';
import { fmt, fmt1 } from '../lib/formatters';
const ISSUE_MODES = {
  all: { key: 'all', label: 'Всего', className: 'col-total' },
  cert: { key: 'cert', label: 'Сертификат', className: 'col-cert' },
  nat: { key: 'nat', label: 'Натуральное', className: 'col-nat' },
};
const isAbsorbentGroup = (name) => name.toLowerCase().includes('абсорбирующее бель');

function getTsrModeValues(group, mode) {
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
const trendFor = (idx, higherIsBetter = true) => {
  const values = [4.8, -2.1, 3.4, -1.3, 1.9, 0.7, -3.2];
  const delta = values[idx % values.length];
  const good = higherIsBetter ? delta >= 0 : delta <= 0;
  return {
    sign: delta >= 0 ? '▲' : '▼',
    cls: good ? 'trend-up' : 'trend-down',
    text: `${Math.abs(delta).toFixed(1)}%`,
  };
};

// blockDetail() - Returns detailed table content for each block type
export default function BlockDetail({ block }) {
  const { period, issueMode, setIssueMode } = useStore();
  const [ageMode, setAgeMode] = useState(() => localStorage.getItem('age-mode') || 'children');
  const [employMode, setEmployMode] = useState(() => localStorage.getItem('employ-mode') || 'groups');
  const sf = useSF();
  const periodWord = period === 'today' ? 'сегодня' : 'с начала года';
  // scaled() — plain (non-hook) data scaling so it can be used inside conditional branches.
  // Handles both objects and arrays (an array would otherwise be turned into an object by spread).
  const scaled = (data, keys = []) => {
    if (sf === 1) return data;
    if (Array.isArray(data)) {
      return data.map((item) =>
        item && typeof item === 'object' ? applyScaleToObject(item, sf, keys) : applyScaleToValue(item, sf)
      );
    }
    return applyScaleToObject(data, sf, keys);
  };

  const mTable = (rows, secondColumnLabel = 'к-во, чел.') => (
    <table className="detail-table">
      <thead>
        <tr>
          <th>Наименование метрики</th>
          <th>{secondColumnLabel}</th>
          <th>Доля</th>
          <th>Тренд</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          const trend = row.trend || trendFor(idx);
          return (
          <tr key={idx}>
            <td>{row.name}</td>
            <td>{row.count}</td>
            <td>{row.share}</td>
            <td>
              <span className={`detail-trend ${trend.cls}`}>
                {trend.sign} {trend.text}
              </span>
            </td>
          </tr>
          );
        })}
      </tbody>
    </table>
  );

  const selectAgeMode = (mode) => {
    localStorage.setItem('age-mode', mode);
    setAgeMode(mode);
  };

  const selectEmployMode = (mode) => {
    localStorage.setItem('employ-mode', mode);
    setEmployMode(mode);
  };

  // blockDetail() cases
  if (block === 'causes') {
    // BASE.causes[].value is a percentage (they sum to 100), not an absolute count —
    // scaling it by sf would corrupt both the share label and the person count.
    return (
      <div>
        {mTable(
          BASE.causes.map(c => [
            c.name,
            fmt((BASE.total * sf * c.value) / 100),
            c.value + '%',
          ]).map(([name, count, share], idx) => ({ name, count, share, trend: trendFor(idx, false) }))
        )}
      </div>
    );
  }

  if (block === 'employ') {
    const scaledEmploy = scaled(BASE.employ, ['working', 'notWorking']);
    const totalOkved = BASE.employ.okved.reduce((sum, item) => sum + item.value, 0);
    const groupRows = scaledEmploy.labels.map((label, i) => {
      const w = scaledEmploy.working[i];
      const nw = scaledEmploy.notWorking[i];
      const percent = Math.round((w / (w + nw)) * 100);
      return { name: label, count: fmt(w * 1000), share: percent + '%', trend: trendFor(i) };
    });
    const okvedRows = BASE.employ.okved.map((item, idx) => ({
      name: item.name,
      count: fmt(item.value * 1000 * sf),
      share: item.share ? `${item.share.toLocaleString('ru-RU')}%` : `${Math.round((item.value / totalOkved) * 100)}%`,
      trend: trendFor(idx),
    }));

    return (
      <div>
        <div className="card-toggle detail-toggle" role="group" aria-label="Детализация занятости">
          <button
            type="button"
            className={`card-toggle-btn ${employMode === 'groups' ? 'active' : ''}`}
            onClick={() => selectEmployMode('groups')}
          >
            Группы
          </button>
          <button
            type="button"
            className={`card-toggle-btn ${employMode === 'okved' ? 'active' : ''}`}
            onClick={() => selectEmployMode('okved')}
          >
            ОКВЭД
          </button>
        </div>
        {mTable(employMode === 'groups' ? groupRows : okvedRows)}
      </div>
    );
  }

  if (block === 'age') {
    const ageData = scaled(BASE.age[ageMode], ['values', 'male', 'female']);
    const total = ageData.values.reduce((s, v) => s + v, 0);
    return (
      <div>
        <div className="card-toggle detail-toggle" role="group" aria-label="Детализация демографии">
          <button
            type="button"
            className={`card-toggle-btn ${ageMode === 'children' ? 'active' : ''}`}
            onClick={() => selectAgeMode('children')}
          >
            Дети
          </button>
          <button
            type="button"
            className={`card-toggle-btn ${ageMode === 'adults' ? 'active' : ''}`}
            onClick={() => selectAgeMode('adults')}
          >
            Взрослые
          </button>
        </div>
        {mTable(
          ageData.labels.map((label, i) => [
            label,
            fmt(ageData.values[i]),
            Math.round((ageData.values[i] / total) * 100) + '%',
          ]).map(([name, count, share], idx) => ({ name, count, share, trend: trendFor(idx, false) }))
        )}
      </div>
    );
  }

  if (block === 'noso') {
    const scaledNoso = scaled(BASE.nosology, ['value']);
    const total = scaledNoso.reduce((s, n) => s + n.value, 0);
    return (
      <div>
        {mTable(
          scaledNoso.map(n => [
            n.name,
            fmt((BASE.total * sf * n.value) / total),
            Math.round((n.value / total) * 100) + '%',
          ]).map(([name, count, share], idx) => ({ name, count, share, trend: trendFor(idx, false) }))
        )}
      </div>
    );
  }

  if (block === 'primary') {
    const examData = scaled(BASE.exam[period] || BASE.exam.ytd, ['primary', 'reexam']);
    const p = examData.primary;
    const r = examData.reexam;
    const s = p + r;
    return (
      <div>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text)', margin: '12px 0 2px' }}>
          {fmt(s)}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>освидетельствований · {periodWord}</div>
        {mTable(
          [
            { name: 'Первичная', count: fmt(p), share: ((p / s) * 100).toFixed(1) + '%', trend: trendFor(0) },
            { name: 'Переосвидетельствование', count: fmt(r), share: ((r / s) * 100).toFixed(1) + '%', trend: trendFor(1, false) },
            { name: 'Всего', count: fmt(s), share: '100%', trend: trendFor(2) },
          ]
        )}
      </div>
    );
  }

  if (block === 'appeal') {
    const examData = scaled(BASE.exam[period] || BASE.exam.ytd, ['appealMain', 'appealFed']);
    return (
      <div>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text)', margin: '12px 0 2px' }}>
          {fmt(examData.appealMain + examData.appealFed)}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>всего · {periodWord}</div>
        {mTable(
          [
            { name: 'Главное бюро МСЭ', count: fmt(examData.appealMain), share: '82.1%', trend: trendFor(0, false) },
            { name: 'Федеральное бюро МСЭ', count: fmt(examData.appealFed), share: '17.9%', trend: trendFor(1, false) },
          ]
        )}
      </div>
    );
  }

  if (block === 'terms') {
    const examData = BASE.exam[period] || BASE.exam.ytd;
    const terms = examData.terms;
    const col = terms > 30 ? '#ef4444' : '#10b981';
    return (
      <div>
        <div style={{ fontSize: '28px', fontWeight: '900', color: col, margin: '12px 0' }}>
          {terms.toFixed(1)}
        </div>
        {mTable(
          [
            { name: 'Средний срок', count: terms.toFixed(1) + ' дней', share: '62.7%', trend: trendFor(0, false) },
            { name: 'Норматив', count: '30 дней', share: '100%', trend: { sign: '→', cls: 'trend-flat', text: '0.0%' } },
            { name: 'Отклонение', count: (terms > 30 ? '+' : '') + (terms - 30).toFixed(1) + ' дней', share: 'к нормативу', trend: trendFor(2, false) },
          ]
        )}
      </div>
    );
  }

  if (block === 'form') {
    const examData = scaled(BASE.exam[period] || BASE.exam.ytd, ['primary', 'reexam']);
    const total = examData.primary + examData.reexam;
    const [onsite, remote] = (BASE.exam[period] || BASE.exam.ytd).form;
    return (
      <div>
        {mTable(
          [
            { name: 'Очно', count: fmt((total * onsite) / 100), share: onsite + '%', trend: trendFor(0) },
            { name: 'Заочно', count: fmt((total * remote) / 100), share: remote + '%', trend: trendFor(1) },
          ]
        )}
      </div>
    );
  }

  if (block === 'result') {
    const examData = scaled(BASE.exam[period] || BASE.exam.ytd, ['primary', 'reexam']);
    const total = examData.primary + examData.reexam;
    const [established, notEstablished] = (BASE.exam[period] || BASE.exam.ytd).result;
    return (
      <div>
        {mTable(
          [
            { name: 'Установлена инвалидность', count: fmt((total * established) / 100), share: established + '%', trend: trendFor(0) },
            { name: 'Не установлена', count: fmt((total * notEstablished) / 100), share: notEstablished + '%', trend: trendFor(1, false) },
          ]
        )}
      </div>
    );
  }

  if (block === 'budget') {
    const tsrData = scaled(BASE.tsr[period] || BASE.tsr.ytd, ['budgetTotal', 'budgetUsed']);
    const remaining = tsrData.budgetTotal - tsrData.budgetUsed;
    const bp = ((tsrData.budgetUsed / tsrData.budgetTotal) * 100).toFixed(1);
    const col = parseFloat(bp) < 60 ? '#ef4444' : '#10b981';
    return (
      <div>
        <div style={{ fontSize: '28px', fontWeight: '900', color: col, margin: '12px 0 2px' }}>
          {bp}%
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>освоение · {periodWord}</div>
        {mTable(
          [
            { name: 'Выделено', count: fmt1(tsrData.budgetTotal) + ' млн ₽', share: '100%', trend: trendFor(0) },
            { name: 'Освоено', count: fmt1(tsrData.budgetUsed) + ' млн ₽', share: bp + '%', trend: trendFor(1) },
            { name: 'Остаток', count: fmt1(remaining) + ' млн ₽', share: (100 - parseFloat(bp)).toFixed(1) + '%', trend: trendFor(2, false) },
          ],
          'Сумма, млн.р.'
        )}
      </div>
    );
  }

  if (block === 'issued') {
    const tsrData = scaled(BASE.tsr[period] || BASE.tsr.ytd, ['issuedNat', 'issuedCert']);
    const n = tsrData.issuedNat;
    const c = tsrData.issuedCert;
    const total = n + c;
    return (
      <div>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text)', margin: '12px 0 2px' }}>
          {fmt(total)}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>единиц ТСР · {periodWord}</div>
        {mTable(
          [
            { name: 'Натуральное', count: fmt(n), share: ((n / total) * 100).toFixed(1) + '%', trend: trendFor(0) },
            { name: 'Эл. сертификат', count: fmt(c), share: ((c / total) * 100).toFixed(1) + '%', trend: trendFor(1) },
            { name: 'Всего', count: fmt(total), share: '100%', trend: trendFor(2) },
          ]
        )}
      </div>
    );
  }

  if (block === 'groups') {
    const tsrData = scaled(BASE.tsr[period] || BASE.tsr.ytd, ['groups']);
    const issueCfg = ISSUE_MODES[issueMode] || ISSUE_MODES.all;
    return (
      <div>
        <table className="tsr-table detail-tsr-table">
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
            {tsrData.groups.map((g, idx) => {
              const modeValues = getTsrModeValues(g, issueCfg.key);
              return (
                <tr key={idx}>
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

  return <div>No details available</div>;
}
