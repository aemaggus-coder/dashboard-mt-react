import { useStore } from '../../hooks/useStore';
import { useSF } from '../../hooks/useSF';
import { BASE, applyScaleToObject } from '../../lib/constants';
import { fmt } from '../../lib/formatters';
import DetailTable, { trendFor } from './DetailTable';

function scale(sf: number, data: Record<string, any>, keys: string[] = []): Record<string, any> {
  if (sf === 1) return data;
  return applyScaleToObject(data, sf, keys);
}

export function PrimaryBlock() {
  const { period } = useStore();
  const sf = useSF();
  const periodWord = period === 'today' ? 'сегодня' : 'с начала года';
  const d = scale(sf, (BASE.exam as Record<string, typeof BASE.exam.today>)[period] || BASE.exam.ytd, ['primary', 'reexam']);
  const p = d.primary, r = d.reexam, s = p + r;

  return (
    <div>
      <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text)', margin: '12px 0 2px' }}>{fmt(s)}</div>
      <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>освидетельствований · {periodWord}</div>
      <DetailTable rows={[
        { name: 'Первичная', count: fmt(p), share: ((p / s) * 100).toFixed(1) + '%', trend: trendFor(0) },
        { name: 'Переосвидетельствование', count: fmt(r), share: ((r / s) * 100).toFixed(1) + '%', trend: trendFor(1, false) },
        { name: 'Всего', count: fmt(s), share: '100%', trend: trendFor(2) },
      ]} />
    </div>
  );
}

export function FormBlock() {
  const { period } = useStore();
  const sf = useSF();
  const d = scale(sf, (BASE.exam as Record<string, typeof BASE.exam.today>)[period] || BASE.exam.ytd, ['primary', 'reexam']);
  const total = d.primary + d.reexam;
  const [onsite, remote] = ((BASE.exam as Record<string, typeof BASE.exam.today>)[period] || BASE.exam.ytd).form;

  return (
    <DetailTable rows={[
      { name: 'Очно', count: fmt((total * onsite) / 100), share: onsite + '%', trend: trendFor(0) },
      { name: 'Заочно', count: fmt((total * remote) / 100), share: remote + '%', trend: trendFor(1) },
    ]} />
  );
}

export function ResultBlock() {
  const { period } = useStore();
  const sf = useSF();
  const d = scale(sf, (BASE.exam as Record<string, typeof BASE.exam.today>)[period] || BASE.exam.ytd, ['primary', 'reexam']);
  const total = d.primary + d.reexam;
  const [established, notEstablished] = ((BASE.exam as Record<string, typeof BASE.exam.today>)[period] || BASE.exam.ytd).result;

  return (
    <DetailTable rows={[
      { name: 'Установлена инвалидность', count: fmt((total * established) / 100), share: established + '%', trend: trendFor(0) },
      { name: 'Не установлена', count: fmt((total * notEstablished) / 100), share: notEstablished + '%', trend: trendFor(1, false) },
    ]} />
  );
}

export function AppealBlock() {
  const { period } = useStore();
  const sf = useSF();
  const periodWord = period === 'today' ? 'сегодня' : 'с начала года';
  const d = scale(sf, (BASE.exam as Record<string, typeof BASE.exam.today>)[period] || BASE.exam.ytd, ['appealMain', 'appealFed']);
  const total = d.appealMain + d.appealFed;

  return (
    <div>
      <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text)', margin: '12px 0 2px' }}>{fmt(total)}</div>
      <div style={{ fontSize: '13px', color: 'var(--text-3)' }}>всего · {periodWord}</div>
      <DetailTable rows={[
        { name: 'Главное бюро МСЭ', count: fmt(d.appealMain), share: '82.1%', trend: trendFor(0, false) },
        { name: 'Федеральное бюро МСЭ', count: fmt(d.appealFed), share: '17.9%', trend: trendFor(1, false) },
      ]} />
    </div>
  );
}

export function TermsBlock() {
  const { period } = useStore();
  const terms = ((BASE.exam as Record<string, typeof BASE.exam.today>)[period] || BASE.exam.ytd).terms;
  const col = terms > 30 ? '#ef4444' : '#10b981';

  return (
    <div>
      <div style={{ fontSize: '28px', fontWeight: '900', color: col, margin: '12px 0' }}>{terms.toFixed(1)}</div>
      <DetailTable rows={[
        { name: 'Средний срок', count: terms.toFixed(1) + ' дней', share: '62.7%', trend: trendFor(0, false) },
        { name: 'Норматив', count: '30 дней', share: '100%', trend: { sign: '→' as const, cls: 'trend-flat' as const, delta: 0, text: '0.0%' } },
        { name: 'Отклонение', count: (terms > 30 ? '+' : '') + (terms - 30).toFixed(1) + ' дней', share: 'к нормативу', trend: trendFor(2, false) },
      ]} />
    </div>
  );
}
