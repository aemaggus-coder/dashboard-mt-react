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

  return (
    <div className="gauge-wrap">
      <div className="gauge-pct" style={{ color: pctColor }}>{animPercent.toFixed(1)}%</div>
      <div className="gauge-sub">освоение бюджета</div>
      <div className="budget-stats">
        <div className="budget-stat b-alloc">
          <div className="budget-stat-val">{fmt1(animAllocated)}<span className="budget-stat-unit">млн ₽</span></div>
          <div className="budget-stat-lbl">Выделено</div>
        </div>
        <div className="budget-stat b-used">
          <div className="budget-stat-val">{fmt1(animUsed)}<span className="budget-stat-unit">млн ₽</span></div>
          <div className="budget-stat-lbl">Освоено</div>
        </div>
        <div className="budget-stat b-rest">
          <div className="budget-stat-val">{fmt1(animRemaining)}<span className="budget-stat-unit">млн ₽</span></div>
          <div className="budget-stat-lbl">Остаток</div>
        </div>
      </div>
    </div>
  );
}
