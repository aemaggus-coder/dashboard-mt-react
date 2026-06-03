import { useStore } from '../hooks/useStore';
import { BASE } from '../lib/constants';

export default function FormChart() {
  const { period } = useStore();
  const examData = BASE.exam[period] || BASE.exam.ytd;
  const [onsite, remote] = examData?.form || [65, 35];

  return (
    <div className="donut-kpis">
      <div className="donut-kpi">
        <div className="donut-kpi-num">{onsite}%</div>
        <div className="donut-kpi-label">Очно</div>
      </div>
      <div className="donut-kpi">
        <div className="donut-kpi-num">{remote}%</div>
        <div className="donut-kpi-label">Заочно</div>
      </div>
    </div>
  );
}
