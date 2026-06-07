import { useStore } from '../hooks/useStore';
import { useSF } from '../hooks/useSF';
import { BASE, applyScaleToObject, applyScaleToValue } from '../lib/constants';

const fmt = (n) => Math.round(n).toLocaleString('ru-RU');
const fmt1 = (n) => n.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

// blockDetail() - Returns detailed table content for each block type
export default function BlockDetail({ block }) {
  const { period, selectedRegions, scope } = useStore();
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

  const scopeName =
    scope === 'rf' ? 'Российская Федерация' : scope === 'fo' ? 'Федеральные округа' : selectedRegions.length === 1 ? selectedRegions[0] : `${selectedRegions.length} регионов`;

  // mTable - renders table with data
  const mTable = (headers, rows) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '24px', fontSize: '20px' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid var(--border-s)' }}>
          {headers.map((header, idx) => (
            <th
              key={idx}
              style={{
                textAlign: idx === 0 ? 'left' : 'right',
                padding: '16px 22px',
                color: 'var(--text-2)',
                fontSize: '17px',
                fontWeight: '700',
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
            {row.map((cell, cellIdx) => (
              <td
                key={cellIdx}
                style={{
                  padding: '18px 22px',
                  textAlign: cellIdx === 0 ? 'left' : 'right',
                  color: 'var(--text)',
                  fontFamily: cellIdx > 0 ? 'var(--mono)' : 'inherit',
                  fontWeight: cellIdx > 0 ? '600' : 'normal',
                  fontSize: '20px',
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  // blockDetail() cases
  if (block === 'causes') {
    const scaledCauses = scaled(BASE.causes, ['value']);
    return (
      <div>
        <h3 style={{ margin: '0 0 18px 0', color: 'var(--text)', fontSize: '30px' }}>Причины инвалидности ({scopeName})</h3>
        {mTable(
          ['Причина', 'Доля', 'Оценка, чел.'],
          scaledCauses.map(c => [
            c.name,
            c.value + '%',
            Math.round((BASE.total * sf * c.value) / 100).toLocaleString('ru-RU'),
          ])
        )}
      </div>
    );
  }

  if (block === 'employ') {
    const scaledEmploy = scaled(BASE.employ, ['working', 'notWorking']);
    return (
      <div>
        <h3 style={{ margin: '0 0 18px 0', color: 'var(--text)', fontSize: '30px' }}>Занятость ({scopeName})</h3>
        {mTable(
          ['Группа', 'Работают', 'Не работают', 'Занятость %'],
          scaledEmploy.labels.map((label, i) => {
            const w = scaledEmploy.working[i];
            const nw = scaledEmploy.notWorking[i];
            const percent = Math.round((w / (w + nw)) * 100);
            return [label, (w * 1000).toLocaleString('ru-RU'), (nw * 1000).toLocaleString('ru-RU'), percent + '%'];
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
        <h3 style={{ margin: '0 0 18px 0', color: 'var(--text)', fontSize: '30px' }}>Возрастные группы ({scopeName})</h3>
        {mTable(
          ['Возраст', 'Всего', 'Мужчины', 'Женщины', 'Доля %'],
          ageData.labels.map((label, i) => [
            label,
            ageData.values[i].toLocaleString('ru-RU'),
            ageData.male[i].toLocaleString('ru-RU'),
            ageData.female[i].toLocaleString('ru-RU'),
            Math.round((ageData.values[i] / total) * 100) + '%',
          ])
        )}
      </div>
    );
  }

  if (block === 'noso') {
    const scaledNoso = scaled(BASE.nosology, ['value']);
    const total = scaledNoso.reduce((s, n) => s + n.value, 0);
    return (
      <div>
        <h3 style={{ margin: '0 0 18px 0', color: 'var(--text)', fontSize: '30px' }}>Нозологии ({scopeName})</h3>
        {mTable(
          ['Нозология', 'Доля %', 'Кол-во, чел.'],
          scaledNoso.map(n => [
            n.name,
            Math.round((n.value / total) * 100) + '%',
            fmt((BASE.total * sf * n.value) / total),
          ])
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
        <h3 style={{ margin: '0 0 18px 0', color: 'var(--text)', fontSize: '30px' }}>Освидетельствование ({scopeName})</h3>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text)', margin: '12px 0 2px' }}>
          {fmt(s)}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>освидетельствований · {periodWord}</div>
        {mTable(
          ['Вид', 'Количество', 'Доля'],
          [
            ['Первичная', fmt(p), ((p / s) * 100).toFixed(1) + '%'],
            ['Переосвидетельствование', fmt(r), ((r / s) * 100).toFixed(1) + '%'],
            ['Всего', fmt(s), '100%'],
          ]
        )}
      </div>
    );
  }

  if (block === 'appeal') {
    const examData = scaled(BASE.exam[period] || BASE.exam.ytd, ['appealMain', 'appealFed']);
    return (
      <div>
        <h3 style={{ margin: '0 0 18px 0', color: 'var(--text)', fontSize: '30px' }}>Обжалования ({scopeName})</h3>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text)', margin: '12px 0 2px' }}>
          {fmt(examData.appealMain + examData.appealFed)}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>всего · {periodWord}</div>
        {mTable(
          ['Инстанция', 'Количество'],
          [
            ['Главное бюро МСЭ', fmt(examData.appealMain)],
            ['Федеральное бюро МСЭ', fmt(examData.appealFed)],
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
        <h3 style={{ margin: '0 0 18px 0', color: 'var(--text)', fontSize: '30px' }}>Средние сроки ({scopeName})</h3>
        <div style={{ fontSize: '28px', fontWeight: '900', color: col, margin: '12px 0' }}>
          {terms.toFixed(1)}
        </div>
        {mTable(
          ['Показатель', 'Значение'],
          [
            ['Средний срок', terms.toFixed(1) + ' дней'],
            ['Норматив', '30 дней'],
            ['Отклонение', (terms > 30 ? '+' : '') + (terms - 30).toFixed(1) + ' дней'],
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
        <h3 style={{ margin: '0 0 18px 0', color: 'var(--text)', fontSize: '30px' }}>Форма проведения ({scopeName})</h3>
        {mTable(
          ['Форма', 'Доля %', 'Оценка'],
          [
            ['Очно', onsite + '%', Math.round((total * onsite) / 100).toLocaleString('ru-RU')],
            ['Заочно', remote + '%', Math.round((total * remote) / 100).toLocaleString('ru-RU')],
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
        <h3 style={{ margin: '0 0 18px 0', color: 'var(--text)', fontSize: '30px' }}>Результаты МСЭ ({scopeName})</h3>
        {mTable(
          ['Результат', 'Доля %', 'Оценка'],
          [
            ['Установлена инвалидность', established + '%', Math.round((total * established) / 100).toLocaleString('ru-RU')],
            ['Не установлена', notEstablished + '%', Math.round((total * notEstablished) / 100).toLocaleString('ru-RU')],
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
        <h3 style={{ margin: '0 0 18px 0', color: 'var(--text)', fontSize: '30px' }}>Бюджет ТСР ({scopeName})</h3>
        <div style={{ fontSize: '28px', fontWeight: '900', color: col, margin: '12px 0 2px' }}>
          {bp}%
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>освоение · {periodWord}</div>
        {mTable(
          ['Показатель', 'Значение'],
          [
            ['Выделено', fmt1(tsrData.budgetTotal) + ' млн ₽'],
            ['Освоено', fmt1(tsrData.budgetUsed) + ' млн ₽'],
            ['Остаток', fmt1(remaining) + ' млн ₽'],
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
        <h3 style={{ margin: '0 0 18px 0', color: 'var(--text)', fontSize: '30px' }}>Выдано ТСР ({scopeName})</h3>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text)', margin: '12px 0 2px' }}>
          {fmt(total)}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>единиц ТСР · {periodWord}</div>
        {mTable(
          ['Способ', 'Количество', 'Доля'],
          [
            ['Натуральное', fmt(n), ((n / total) * 100).toFixed(1) + '%'],
            ['Эл. сертификат', fmt(c), ((c / total) * 100).toFixed(1) + '%'],
            ['Всего', fmt(total), '100%'],
          ]
        )}
      </div>
    );
  }

  if (block === 'groups') {
    const tsrData = scaled(BASE.tsr[period] || BASE.tsr.ytd, ['groups']);
    return (
      <div>
        <h3 style={{ margin: '0 0 18px 0', color: 'var(--text)', fontSize: '30px' }}>По группам ТСР ({scopeName})</h3>
        {mTable(
          ['Группа ТСР', 'Получателей', 'Натуральное', 'Сертификат', 'Сумма (млн ₽)'],
          tsrData.groups.map(g => [
            g.name,
            fmt(g.people),
            fmt(g.nat),
            fmt(g.cert),
            fmt1(g.sum),
          ])
        )}
      </div>
    );
  }

  return <div>No details available</div>;
}
