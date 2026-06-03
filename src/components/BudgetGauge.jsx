import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';

export default function BudgetGauge() {
  const { period } = useStore();
  const data = useScaledData(BASE.tsr[period], ['budgetTotal', 'budgetUsed']);
  const allocated = data.budgetTotal;
  const used = data.budgetUsed;
  const remaining = allocated - used;
  const percent = Math.round((used / allocated) * 100);

  return (
    <div className="gauge-wrap">
      <div className="gauge-pct">{percent}%</div>
      <div className="gauge-sub">Использовано бюджета</div>
      <div className="budget-stats">
        <div className="budget-stat b-alloc">
          <div className="budget-stat-val">{allocated}</div>
          <div className="budget-stat-unit">Выделено</div>
          <div className="budget-stat-lbl">млн ₽</div>
        </div>
        <div className="budget-stat b-used">
          <div className="budget-stat-val">{used}</div>
          <div className="budget-stat-unit">Израсходовано</div>
          <div className="budget-stat-lbl">млн ₽</div>
        </div>
        <div className="budget-stat b-rest">
          <div className="budget-stat-val">{remaining}</div>
          <div className="budget-stat-unit">Осталось</div>
          <div className="budget-stat-lbl">млн ₽</div>
        </div>
      </div>
    </div>
  );
}
