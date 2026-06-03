import { useStore } from '../hooks/useStore';
import { BASE } from '../lib/constants';

export default function ResultChart() {
  const { period } = useStore();
  const [established, notEstablished] = BASE.exam[period].result;

  return (
    <div className="donut-kpis">
      <div className="donut-kpi">
        <div className="donut-kpi-num" style={{ color: '#10b981' }}>
          {established}%
        </div>
        <div className="donut-kpi-label">Установлена</div>
      </div>
      <div className="donut-kpi">
        <div className="donut-kpi-num">{notEstablished}%</div>
        <div className="donut-kpi-label">Не установлена</div>
      </div>
    </div>
  );
}
