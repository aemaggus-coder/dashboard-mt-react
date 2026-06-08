import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { useAnimatedDecimal } from '../hooks/useAnimatedNumber';
import { BASE } from '../lib/constants';

const fmt1 = (n) => n.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function BudgetGauge() {
  const { period } = useStore();
  const data = useScaledData(BASE.tsr[period] || BASE.tsr.today, ['budgetTotal', 'budgetUsed']);
  const allocated = data.budgetTotal;
  const used = data.budgetUsed;
  const remaining = allocated - used;
  const percent = (used / allocated) * 100;

  // цвет по уровню освоения (как в оригинале): <40 — красный, <70 — янтарный, иначе зелёный
  const pctColor = percent < 40 ? '#ef4444' : percent < 70 ? '#f59e0b' : '#10b981';

  const animPercent = useAnimatedDecimal(percent, 1100);
  const animAllocated = useAnimatedDecimal(allocated, 1100);
  const animUsed = useAnimatedDecimal(used, 1100);
  const animRemaining = useAnimatedDecimal(remaining, 1100);
  const clampedPercent = Math.min(Math.max(animPercent, 0), 100);
  const needleRadians = ((180 - clampedPercent * 1.8) * Math.PI) / 180;
  const needleEndX = 110 + Math.cos(needleRadians) * 68;
  const needleEndY = 110 - Math.sin(needleRadians) * 68;

  return (
    <div className="gauge-wrap">
      <div className="budget-gauge" aria-label={`Освоение бюджета ${animPercent.toFixed(1)}%`}>
        <svg className="budget-gauge-svg" viewBox="0 0 220 132" role="img">
          <defs>
            <linearGradient id="budgetGaugeGradient" x1="20" y1="110" x2="200" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="52%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <path className="budget-gauge-track" d="M30 110 A80 80 0 0 1 190 110" />
          <path className="budget-gauge-arc" d="M30 110 A80 80 0 0 1 190 110" />
          <g className="budget-gauge-needle">
            <line x1="110" y1="110" x2={needleEndX} y2={needleEndY} />
            <circle cx="110" cy="110" r="7" />
          </g>
        </svg>
        <div className="gauge-pct" style={{ color: pctColor }}>{animPercent.toFixed(1)}%</div>
        <div className="gauge-sub">освоение бюджета</div>
      </div>
      <div className="budget-stats">
        <div className="budget-stat b-alloc">
          <div className="budget-stat-lbl">Выделено</div>
          <div className="budget-stat-val">{fmt1(animAllocated)}<span className="budget-stat-unit">млн ₽</span></div>
        </div>
        <div className="budget-stat-row">
          <div className="budget-stat b-used">
            <div className="budget-stat-lbl">Освоено</div>
            <div className="budget-stat-val">{fmt1(animUsed)}<span className="budget-stat-unit">млн ₽</span></div>
          </div>
          <div className="budget-stat b-rest">
            <div className="budget-stat-lbl">Остаток</div>
            <div className="budget-stat-val">{fmt1(animRemaining)}<span className="budget-stat-unit">млн ₽</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
