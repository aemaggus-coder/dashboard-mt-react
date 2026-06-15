import { useStore } from '../hooks/useStore';
import { useAnimatedDecimal } from '../hooks/useAnimatedNumber';
import { BASE } from '../lib/constants';
import { fmt1 } from '../lib/formatters';

const TMAX = 40;
const tColor = (v) => (v < 25 ? '#10b981' : v < 30 ? '#f59e0b' : '#ef4444');

const PERIOD_BARS = [
  { p: 'today', label: 'Сегодня' },
  { p: 'ytd',   label: 'С нач. года' },
  { p: 'year',  label: '2025 год' },
];

export default function TermsStats() {
  const { period } = useStore();
  const d = BASE.exam[period] || BASE.exam.today;
  const terms = d.terms;
  const animTerms = useAnimatedDecimal(terms, 1100);
  const termsStatus = terms < 25 ? 'ok' : terms < 30 ? 'warn' : 'risk';

  return (
    <div className="terms-body">
      <div className={`terms-hero terms-hero--${termsStatus}`}>
        <span className="terms-hero-num" style={{ color: tColor(terms) }}>
          {fmt1(animTerms)}
        </span>
        <span className="terms-hero-unit">дн.</span>
      </div>

      <div className="terms-bars">
        {PERIOD_BARS.map(({ p, label }) => {
          const item = BASE.exam[p] || BASE.exam.today;
          const v = item.terms;
          const color = tColor(v);
          return (
            <div key={p} className="terms-bar-row" style={{ borderLeft: `3px solid ${color}` }}>
              <span className="terms-bar-label">{label}</span>
              <div className="terms-bar-track">
                <div
                  className="terms-bar-fill"
                  style={{ width: `${Math.min((v / TMAX) * 100, 100)}%`, background: color }}
                ></div>
                <div className="terms-norm-line"></div>
              </div>
              <span className="terms-bar-num" style={{ color }}>{fmt1(v)}</span>
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
