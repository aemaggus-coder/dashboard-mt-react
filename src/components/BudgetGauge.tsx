import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { useAnimatedValue } from '../hooks/useAnimatedValue';
import { BASE } from '../lib/constants';
import { fmt1 } from '../lib/formatters';

const R = 80;
const CX = 110;
const CY = 110;
const ARC_LEN = Math.PI * R;

const ptOnArc = (pct, r = R) => {
  const a = ((180 - pct * 1.8) * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY - r * Math.sin(a) };
};

export default function BudgetGauge() {
  const { period } = useStore();
  const data = useScaledData((BASE.tsr as Record<string, typeof BASE.tsr.today>)[period] || BASE.tsr.today, ['budgetTotal', 'budgetUsed']);
  const allocated = data.budgetTotal;
  const used = data.budgetUsed;
  const remaining = allocated - used;
  const percent = (used / allocated) * 100;

  const pctColor = percent < 40 ? '#ef4444' : percent < 70 ? '#f59e0b' : '#10b981';

  const animPercent = useAnimatedValue(percent, 1100, { decimals: 1, from: 0 });
  const animAllocated = useAnimatedValue(allocated, 1100, { decimals: 1, from: 0 });
  const animUsed = useAnimatedValue(used, 1100, { decimals: 1, from: 0 });
  const animRemaining = useAnimatedValue(remaining, 1100, { decimals: 1, from: 0 });
  const clamped = Math.min(Math.max(animPercent, 0), 100);

  const dashOffset = ARC_LEN * (1 - clamped / 100);
  const tip = ptOnArc(clamped);
  const needleAngle = ((180 - clamped * 1.8) * Math.PI) / 180;
  const needleX = CX + Math.cos(needleAngle) * 62;
  const needleY = CY - Math.sin(needleAngle) * 62;

  const tick = (pct) => {
    const inner = ptOnArc(pct, R - 12);
    const outer = ptOnArc(pct, R + 13);
    return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y };
  };

  return (
    <div className="gauge-wrap">
      <div className="budget-gauge" aria-label={`Освоение бюджета ${animPercent.toFixed(1)}%`}>
        <svg className="budget-gauge-svg" viewBox="0 0 220 132" role="img">
          {/* Track */}
          <path className="budget-gauge-track" d="M30 110 A80 80 0 0 1 190 110" />

          {/* Zone threshold ticks: 40% and 70% */}
          {[40, 70].map(p => {
            const t = tick(p);
            return <line key={p} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} className="gauge-zone-tick" />;
          })}

          {/* Filled arc */}
          <path
            className="budget-gauge-fill"
            d="M30 110 A80 80 0 0 1 190 110"
            style={{
              stroke: pctColor,
              strokeDasharray: ARC_LEN,
              strokeDashoffset: dashOffset,
              filter: `drop-shadow(0 0 8px ${pctColor})`,
            }}
          />

          {/* Glowing tip dot */}
          {clamped > 1 && clamped < 99 && (
            <circle
              cx={tip.x}
              cy={tip.y}
              r="9"
              className="gauge-tip-dot"
              style={{ fill: pctColor, filter: `drop-shadow(0 0 10px ${pctColor})` }}
            />
          )}

          {/* Needle */}
          <line
            x1={CX} y1={CY}
            x2={needleX} y2={needleY}
            className="gauge-needle-line"
            style={{ stroke: pctColor }}
          />
          <circle cx={CX} cy={CY} r="6" className="gauge-needle-hub" />

          {/* Edge labels */}
          <text x="22" y="128" className="gauge-edge-label">0%</text>
          <text x="198" y="128" className="gauge-edge-label" textAnchor="end">100%</text>
        </svg>

        <div className="gauge-pct" style={{ color: pctColor }}>{animPercent.toFixed(1)}%</div>
        <div className="gauge-sub">освоение бюджета</div>
      </div>

      <div className="budget-stats budget-stats-row">
        <div className="budget-stat b-alloc">
          <div className="budget-stat-lbl">Выделено</div>
          <div className="budget-stat-val">{fmt1(animAllocated)}<span className="budget-stat-unit">млн ₽</span></div>
        </div>
        <div className="budget-stat b-used">
          <div className="budget-stat-lbl">Исполнено</div>
          <div className="budget-stat-val">{fmt1(animUsed)}<span className="budget-stat-unit">млн ₽</span></div>
        </div>
        <div className="budget-stat b-rest">
          <div className="budget-stat-lbl">Остаток</div>
          <div className="budget-stat-val">{fmt1(animRemaining)}<span className="budget-stat-unit">млн ₽</span></div>
        </div>
      </div>
    </div>
  );
}
