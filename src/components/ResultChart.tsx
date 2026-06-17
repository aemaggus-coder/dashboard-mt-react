import { useStore } from '../hooks/useStore';
import { BASE } from '../lib/constants';
import Donut from './Donut';

const RESULT_COLORS = ['#5f98f5', '#b9aeee'];

export default function ResultChart() {
  const { period } = useStore();
  const examData = (BASE.exam as Record<string, typeof BASE.exam.today>)[period] || BASE.exam.ytd;
  const [established, notEstablished] = examData?.result || [71, 29];
  const items = [
    { name: 'Установлена инвалидность', value: established, color: RESULT_COLORS[0] },
    { name: 'Не установлена инвалидность', value: notEstablished, color: RESULT_COLORS[1] },
  ];

  return (
    <div className="mini-donut-wrap result-mini-donut-wrap">
      <Donut
        values={items.map((item) => item.value)}
        colors={items.map((item) => item.color)}
        labels={items.map((item) => item.name)}
        cutout="58%"
        formatValue={(v) => `${v}%`}
      >
        <span className="mini-donut-center">{established}%</span>
        <span className="mini-donut-sub">установлена</span>
      </Donut>
      <div className="mini-donut-legend result-mini-donut-legend">
        {items.map((item) => (
          <div key={item.name} className="mini-donut-leg-item">
            <span className="mini-donut-leg-dot" style={{ backgroundColor: item.color }} />
            <span className="mini-donut-leg-name">{item.name}</span>
            <span className="mini-donut-leg-value">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
