import { useStore } from '../hooks/useStore';
import { useSF } from '../hooks/useSF';
import { BASE, applyScaleToObject, applyScaleToValue } from '../lib/constants';

const fmt = (n) => Math.round(n).toLocaleString('ru-RU');
const fmt1 = (n) => n.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
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
  const { period } = useStore();
  const sf = useSF();
  const periodWord = period === 'today' ? 'сегодня' : 'с начала года';
  // scaled() — plain (non-hook) data scaling so it can be used inside conditional branches.
  // Handles both objects and arrays (an array would otherwise be turned into an object by spread).
  const scaled = (data, keys = []) => {
    if (Array.isArray(data)) {
      return data.map((item) =>
        item && typeof item === 'object' ? applyScaleToObject(item, sf, keys) : applyScaleToValue(item, sf)
      );
    }
    return applyScaleToObject(data, sf, keys);
  };

  const mTable = (rows) => (
    <table className="detail-table">
      <thead>
        <tr>
          <th>Наименование метрики</th>
          <th>к-во, чел.</th>
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

  // blockDetail() cases
  if (block === 'causes') {
    const scaledCauses = scaled(BASE.causes, ['value']);
    return (
      <div>
        {mTable(
          scaledCauses.map(c => [
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
    return (
      <div>
        {mTable(
          scaledEmploy.labels.map((label, i) => {
            const w = scaledEmploy.working[i];
            const nw = scaledEmploy.notWorking[i];
            const percent = Math.round((w / (w + nw)) * 100);
            return { name: label, count: fmt(w * 1000), share: percent + '%', trend: trendFor(i) };
          })
        )}
      </div>
    );
  }

  if (block === 'age') {
    const mode = localStorage.getItem('age-mode') || 'children';
    const ageData = scaled(BASE.age[mode], ['values', 'male', 'female']);
    const total = ageData.values.reduce((s, v) => s + v, 0);
    return (
      <div>
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
          ]
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
    const totalPeople = tsrData.groups.reduce((sum, group) => sum + group.people, 0);
    return (
      <div>
        {mTable(
          tsrData.groups.map((g, idx) => ({
            name: g.name,
            count: fmt(g.people),
            share: ((g.people / totalPeople) * 100).toFixed(1) + '%',
            trend: trendFor(idx),
          }))
        )}
      </div>
    );
  }

  return <div>No details available</div>;
}
