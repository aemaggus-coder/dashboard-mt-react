import { useState } from 'react';
import { useSF } from '../../hooks/useSF';
import { BASE, applyScaleToObject } from '../../lib/constants';
import { fmt } from '../../lib/formatters';
import storage from '../../lib/storage';
import DetailTable, { trendFor } from './DetailTable';

function scale(sf: number, data: Record<string, any>, keys: string[] = []): Record<string, any> {
  if (sf === 1) return data;
  if (Array.isArray(data)) return data.map(item => applyScaleToObject(item, sf, keys));
  return applyScaleToObject(data, sf, keys);
}

export function CausesBlock() {
  const sf = useSF();
  const rows = BASE.causes.map((c, idx) => ({
    name: c.name,
    count: fmt((BASE.total * sf * c.value) / 100),
    share: c.value + '%',
    trend: trendFor(idx, false),
  }));
  return <DetailTable rows={rows} />;
}

export function AgeBlock() {
  const sf = useSF();
  const [ageMode, setAgeMode] = useState(() => storage.get('age-mode', 'children'));
  const ageData = scale(sf, (BASE.age as Record<string, typeof BASE.age.children>)[ageMode ?? 'children'], ['values', 'male', 'female']);
  const total = ageData.values.reduce((s, v) => s + v, 0);

  const rows = ageData.labels.map((label, i) => ({
    name: label,
    count: fmt(ageData.values[i]),
    share: Math.round((ageData.values[i] / total) * 100) + '%',
    trend: trendFor(i, false),
  }));

  const select = (mode) => { storage.set('age-mode', mode); setAgeMode(mode); };

  return (
    <div>
      <div className="card-toggle detail-toggle" role="group" aria-label="Детализация демографии">
        {['children', 'adults'].map((m) => (
          <button key={m} type="button" className={`card-toggle-btn ${ageMode === m ? 'active' : ''}`} onClick={() => select(m)}>
            {m === 'children' ? 'Дети' : 'Взрослые'}
          </button>
        ))}
      </div>
      <DetailTable rows={rows} />
    </div>
  );
}

export function EmployBlock() {
  const [employMode, setEmployMode] = useState(() => storage.get('employ-mode', 'groups'));
  const sf = useSF();
  const scaledEmploy = scale(sf, BASE.employ, ['working', 'notWorking']);
  const totalOkved = BASE.employ.okved.reduce((sum, item) => sum + item.value, 0);

  const groupRows = scaledEmploy.labels.map((label, i) => {
    const w = scaledEmploy.working[i];
    const nw = scaledEmploy.notWorking[i];
    return { name: label, count: fmt(w * 1000), share: Math.round((w / (w + nw)) * 100) + '%', trend: trendFor(i) };
  });
  const okvedRows = BASE.employ.okved.map((item, idx) => ({
    name: item.name,
    count: fmt(item.value * 1000 * sf),
    share: item.share ? `${item.share.toLocaleString('ru-RU')}%` : `${Math.round((item.value / totalOkved) * 100)}%`,
    trend: trendFor(idx),
  }));

  const select = (mode) => { storage.set('employ-mode', mode); setEmployMode(mode); };

  return (
    <div>
      <div className="card-toggle detail-toggle" role="group" aria-label="Детализация занятости">
        {['groups', 'okved'].map((m) => (
          <button key={m} type="button" className={`card-toggle-btn ${employMode === m ? 'active' : ''}`} onClick={() => select(m)}>
            {m === 'groups' ? 'Группы' : 'ОКВЭД'}
          </button>
        ))}
      </div>
      <DetailTable rows={employMode === 'groups' ? groupRows : okvedRows} />
    </div>
  );
}

export function NosoBlock() {
  const sf = useSF();
  const scaledNoso = BASE.nosology.map(n => ({ ...n, value: n.value * sf }));
  const total = scaledNoso.reduce((s, n) => s + n.value, 0);
  const rows = scaledNoso.map((n, idx) => ({
    name: n.name,
    count: fmt((BASE.total * sf * n.value) / total),
    share: Math.round((n.value / total) * 100) + '%',
    trend: trendFor(idx, false),
  }));
  return <DetailTable rows={rows} />;
}
