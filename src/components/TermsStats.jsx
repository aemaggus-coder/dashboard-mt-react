import { useStore } from '../hooks/useStore';
import { useAnimatedDecimal } from '../hooks/useAnimatedNumber';
import { BASE } from '../lib/constants';

const TMAX = 40; // scale max (days)
const fmt1 = (n) => n.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const tColor = (v) => (v < 25 ? '#10b981' : v < 30 ? '#f59e0b' : '#ef4444');

const PERIOD_BARS = [
  { p: 'today', label: 'Сегодня' },
  { p: 'ytd', label: 'С нач. года' },
  { p: 'year', label: '2025 год' },
];

export default function TermsStats() {
  const { period } = useStore();
  const d = BASE.exam[period] || BASE.exam.today;
  const terms = d.terms;

  // animDec1() — animate hero value
  const animTerms = useAnimatedDecimal(terms, 1100);
  const overNorm = terms > 30;

  return (
    <div className="terms-body">
      <div className="terms-hero">
        <span className="terms-hero-num" style={{ color: tColor(terms) }}>{fmt1(animTerms)}</span>
        <span className="terms-hero-unit">дн.</span>
        <span className={`terms-badge ${overNorm ? 'risk' : 'ok'}`}>
          {overNorm ? 'Превышен норматив' : 'В норме'}
        </span>
      </div>

      <div className="terms-bars">
        {PERIOD_BARS.map(({ p, label }) => {
          const v = (BASE.exam[p] || BASE.exam.today).terms;
          return (
            <div key={p} className="terms-bar-row">
              <span className="terms-bar-label">{label}</span>
              <div className="terms-bar-track">
                <div
                  className="terms-bar-fill"
                  style={{ width: `${Math.min((v / TMAX) * 100, 100)}%`, background: tColor(v) }}
                ></div>
                <div className="terms-norm-line"></div>
              </div>
              <span className="terms-bar-num" style={{ color: tColor(v) }}>{fmt1(v)}</span>
            </div>
          );
        })}
      </div>

      <div className="terms-scale">
        <div className="terms-scale-bar"></div>
        <div className="terms-norm-label">▲ норматив 30 дн.</div>
      </div>
    </div>
  );
}
