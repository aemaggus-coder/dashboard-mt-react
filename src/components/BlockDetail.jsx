import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { useSF } from '../hooks/useSF';
import TrendBadge from './TrendBadge';
import { BASE, PREV_POP, PREV_EXAM, PREV_TSR } from '../lib/constants';

// blockDetail() - Returns detailed table content for each block type
export default function BlockDetail({ block }) {
  const { period, selectedRegions, scope } = useStore();
  const sf = useSF();

  const scopeName =
    scope === 'rf' ? 'Российская Федерация' : scope === 'fo' ? 'Федеральные округа' : selectedRegions.length === 1 ? selectedRegions[0] : `${selectedRegions.length} регионов`;

  // mTable - renders table with data
  const mTable = (headers, rows) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid rgba(255,255,255,.09)' }}>
          {headers.map((header, idx) => (
            <th
              key={idx}
              style={{
                textAlign: idx === 0 ? 'left' : 'right',
                padding: '10px 16px',
                color: 'var(--text-2)',
                fontSize: '12px',
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
          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            {row.map((cell, cellIdx) => (
              <td
                key={cellIdx}
                style={{
                  padding: '12px 16px',
                  textAlign: cellIdx === 0 ? 'left' : 'right',
                  color: 'var(--text)',
                  fontFamily: cellIdx > 0 ? 'var(--mono)' : 'inherit',
                  fontWeight: cellIdx > 0 ? '600' : 'normal',
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
    const scaledCauses = useScaledData(BASE.causes, ['value']);
    return (
      <div>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Причины инвалидности ({scopeName})</h3>
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
    const scaledEmploy = useScaledData(BASE.employ, ['working', 'notWorking']);
    return (
      <div>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Занятость ({scopeName})</h3>
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
    const scaledAge = useScaledData(BASE.age, ['values', 'male', 'female']);
    const ageData = scaledAge[localStorage.getItem('age-mode') || 'children'];
    const total = ageData.values.reduce((s, v) => s + v, 0);
    return (
      <div>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Возрастные группы ({scopeName})</h3>
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
    const scaledNoso = useScaledData(BASE.nosology, ['value']);
    const total = scaledNoso.reduce((s, n) => s + n.value, 0);
    return (
      <div>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Нозологии ({scopeName})</h3>
        {mTable(
          ['Нозология', 'Доля %'],
          scaledNoso.map(n => [n.name, Math.round((n.value / total) * 100) + '%'])
        )}
      </div>
    );
  }

  if (block === 'primary') {
    const examData = useScaledData(BASE.exam[period] || BASE.exam.ytd, ['primary', 'reexam']);
    const prevData = PREV_EXAM[period] || PREV_EXAM.ytd;
    const p = examData.primary;
    const r = examData.reexam;
    const s = p + r;
    return (
      <div>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Освидетельствование ({scopeName})</h3>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text)', margin: '12px 0' }}>
          {s.toLocaleString('ru-RU')}
        </div>
        {mTable(
          ['Вид', 'Количество', 'Доля %', 'Тренд'],
          [
            ['Первичная', p.toLocaleString('ru-RU'), ((p / s) * 100).toFixed(1) + '%', <TrendBadge key="p" current={p} previous={(prevData?.tx || 0) * 0.35} />],
            ['Переосвидетельствование', r.toLocaleString('ru-RU'), ((r / s) * 100).toFixed(1) + '%', <TrendBadge key="r" current={r} previous={(prevData?.tx || 0) * 0.65} />],
            ['Всего', s.toLocaleString('ru-RU'), '100%', <TrendBadge key="t" current={s} previous={prevData?.tx || 0} />],
          ]
        )}
      </div>
    );
  }

  if (block === 'appeal') {
    const examData = useScaledData(BASE.exam[period] || BASE.exam.ytd, ['appealMain', 'appealFed']);
    return (
      <div>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Обжалования ({scopeName})</h3>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text)', margin: '12px 0' }}>
          {(examData.appealMain + examData.appealFed).toLocaleString('ru-RU')}
        </div>
        {mTable(
          ['Инстанция', 'Количество'],
          [
            ['Главное бюро МСЭ', examData.appealMain.toLocaleString('ru-RU')],
            ['Федеральное бюро МСЭ', examData.appealFed.toLocaleString('ru-RU')],
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
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Средние сроки ({scopeName})</h3>
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
    const examData = useScaledData(BASE.exam[period] || BASE.exam.ytd, ['primary', 'reexam']);
    const total = examData.primary + examData.reexam;
    const [onsite, remote] = (BASE.exam[period] || BASE.exam.ytd).form;
    return (
      <div>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Форма проведения ({scopeName})</h3>
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
    const examData = useScaledData(BASE.exam[period] || BASE.exam.ytd, ['primary', 'reexam']);
    const total = examData.primary + examData.reexam;
    const [established, notEstablished] = (BASE.exam[period] || BASE.exam.ytd).result;
    return (
      <div>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Результаты МСЭ ({scopeName})</h3>
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
    const tsrData = useScaledData(BASE.tsr[period] || BASE.tsr.ytd, ['budgetTotal', 'budgetUsed']);
    const remaining = tsrData.budgetTotal - tsrData.budgetUsed;
    const bp = ((tsrData.budgetUsed / tsrData.budgetTotal) * 100).toFixed(1);
    const col = parseFloat(bp) < 60 ? '#ef4444' : '#10b981';
    return (
      <div>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Бюджет ТСР ({scopeName})</h3>
        <div style={{ fontSize: '28px', fontWeight: '900', color: col, margin: '12px 0' }}>
          {bp}%
        </div>
        {mTable(
          ['Показатель', 'Значение'],
          [
            ['Выделено', (tsrData.budgetTotal / 1000).toFixed(1) + ' млн ₽'],
            ['Освоено', (tsrData.budgetUsed / 1000).toFixed(1) + ' млн ₽'],
            ['Остаток', (remaining / 1000).toFixed(1) + ' млн ₽'],
          ]
        )}
      </div>
    );
  }

  if (block === 'issued') {
    const tsrData = useScaledData(BASE.tsr[period] || BASE.tsr.ytd, ['issuedNat', 'issuedCert']);
    const n = tsrData.issuedNat;
    const c = tsrData.issuedCert;
    const total = n + c;
    return (
      <div>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Выданные ТСР ({scopeName})</h3>
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text)', margin: '12px 0' }}>
          {total.toLocaleString('ru-RU')}
        </div>
        {mTable(
          ['Способ', 'Количество', 'Доля %'],
          [
            ['Натуральное', n.toLocaleString('ru-RU'), ((n / total) * 100).toFixed(1) + '%'],
            ['Эл. сертификат', c.toLocaleString('ru-RU'), ((c / total) * 100).toFixed(1) + '%'],
            ['Всего', total.toLocaleString('ru-RU'), '100%'],
          ]
        )}
      </div>
    );
  }

  if (block === 'groups') {
    const tsrData = useScaledData(BASE.tsr[period] || BASE.tsr.ytd, ['groups']);
    return (
      <div>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>Группы ТСР ({scopeName})</h3>
        {mTable(
          ['Категория', 'Люди', 'Натуральные', 'Сертифицированные'],
          tsrData.groups.map(g => [
            g.name,
            g.people.toLocaleString('ru-RU'),
            g.nat.toLocaleString('ru-RU'),
            g.cert.toLocaleString('ru-RU'),
          ])
        )}
      </div>
    );
  }

  return <div>No details available</div>;
}
