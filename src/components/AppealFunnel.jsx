import { useStore } from '../hooks/useStore';
import { useSF } from '../hooks/useSF';
import { BASE } from '../lib/constants';

const fmt = (n) => Math.round(n).toLocaleString('ru-RU');
const barWidth = (pct) => {
  if (pct <= 0) return '0%';
  return `max(8px, ${Math.min(pct, 100)}%)`;
};

export default function AppealFunnel() {
  const { period } = useStore();
  const f = useSF();
  const d = BASE.exam[period] || BASE.exam.today;
  const total = (d.primary + d.reexam) * f;
  const main = d.appealMain * f;
  const fed = d.appealFed * f;
  const mainPct = total > 0 ? (main / total) * 100 : 0;
  const fedPct = total > 0 ? (fed / total) * 100 : 0;

  return (
    <div className="appeal-funnel">
      <div className="appeal-row">
        <div className="appeal-row-top">
          <span className="appeal-row-label">Главное бюро МСЭ</span>
          <span className="appeal-row-pct">{mainPct.toFixed(1)}%</span>
        </div>
        <div className="appeal-track">
          <div className="appeal-fill" style={{ width: barWidth(mainPct), background: '#f59e0b' }}></div>
        </div>
        <div className="appeal-row-num">{fmt(main)} чел.</div>
      </div>

      <div className="appeal-row">
        <div className="appeal-row-top">
          <span className="appeal-row-label">Федеральное бюро МСЭ</span>
          <span className="appeal-row-pct">{fedPct.toFixed(1)}%</span>
        </div>
        <div className="appeal-track">
          <div className="appeal-fill" style={{ width: barWidth(fedPct), background: '#ef4444' }}></div>
        </div>
        <div className="appeal-row-num">{fmt(fed)} чел.</div>
      </div>
    </div>
  );
}
