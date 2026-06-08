import { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { useAnimatedDecimal } from '../hooks/useAnimatedNumber';
import { BASE } from '../lib/constants';

const TMAX = 40; // scale max (days)
const LMAX = 900; // scale max (cases per expert)
const fmt1 = (n) => n.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const tColor = (v) => (v < 25 ? '#10b981' : v < 30 ? '#f59e0b' : '#ef4444');
const lColor = (v) => (v < 520 ? '#10b981' : v < 700 ? '#f59e0b' : '#ef4444');

const PERIOD_BARS = [
  { p: 'today', label: 'Сегодня' },
  { p: 'ytd', label: 'С нач. года' },
  { p: 'year', label: '2025 год' },
];

export default function TermsStats() {
  const { period } = useStore();
  const [mode, setMode] = useState('term');
  const d = BASE.exam[period] || BASE.exam.today;
  const terms = d.terms;
  const load = Math.round((d.primary + d.reexam) / (period === 'today' ? 18 : period === 'year' ? 920 : 260));

  // animDec1() — animate hero value
  const animTerms = useAnimatedDecimal(terms, 1100);
  const animLoad = useAnimatedDecimal(load, 1100);
  const overNorm = terms > 30;
  const highLoad = load > 700;
  const isLoad = mode === 'load';

  return (
    <div className="terms-body">
      <div className="card-toggle terms-toggle" role="group" aria-label="Режим эффективности">
        <button className={`card-toggle-btn ${mode === 'term' ? 'active' : ''}`} onClick={() => setMode('term')}>
          Срок
        </button>
        <button className={`card-toggle-btn ${mode === 'load' ? 'active' : ''}`} onClick={() => setMode('load')}>
          Нагрузка
        </button>
      </div>
      <div className="terms-hero">
        <span className="terms-hero-num" style={{ color: isLoad ? lColor(load) : tColor(terms) }}>
          {isLoad ? fmt1(animLoad) : fmt1(animTerms)}
        </span>
        <span className="terms-hero-unit">{isLoad ? 'дел/эксп.' : 'дн.'}</span>
        <span className={`terms-badge ${(isLoad ? highLoad : overNorm) ? 'risk' : 'ok'}`}>
          {isLoad ? (highLoad ? 'Высокая нагрузка' : 'Нагрузка в норме') : (overNorm ? 'Превышен норматив' : 'В норме')}
        </span>
      </div>

      <div className="terms-bars">
        {PERIOD_BARS.map(({ p, label }) => {
          const item = BASE.exam[p] || BASE.exam.today;
          const v = isLoad
            ? Math.round((item.primary + item.reexam) / (p === 'today' ? 18 : p === 'year' ? 920 : 260))
            : item.terms;
          const color = isLoad ? lColor(v) : tColor(v);
          const max = isLoad ? LMAX : TMAX;
          return (
            <div key={p} className="terms-bar-row">
              <span className="terms-bar-label">{label}</span>
              <div className="terms-bar-track">
                <div
                  className="terms-bar-fill"
                  style={{ width: `${Math.min((v / max) * 100, 100)}%`, background: color }}
                ></div>
                {!isLoad && <div className="terms-norm-line"></div>}
              </div>
              <span className="terms-bar-num" style={{ color }}>{fmt1(v)}</span>
            </div>
          );
        })}
      </div>

      {!isLoad && (
        <div className="terms-scale">
          <div className="terms-scale-bar"></div>
          <div className="terms-norm-label">▲ норматив 30 дн.</div>
        </div>
      )}
    </div>
  );
}
