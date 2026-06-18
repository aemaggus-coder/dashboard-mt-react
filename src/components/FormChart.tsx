import { useStore } from '../hooks/useStore';
import { BASE, variedPair } from '../lib/constants';
import Donut from './Donut';

const FORM_COLORS = ['#5f98f5', '#ffa760'];

export default function FormChart() {
  const { period, scope, selectedRegions, selectedFo } = useStore();
  const examData = (BASE.exam as Record<string, typeof BASE.exam.today>)[period] || BASE.exam.ytd;
  const base = (examData?.form || [65, 35]) as [number, number];
  const seed = scope === 'rf' ? '' : `${scope}::${selectedFo ?? ''}::${selectedRegions.join(',')}`;
  const chartKey = `${period}::${seed}`;
  const [onsite, remote] = variedPair(base, seed);
  const items = [
    { name: 'Очно', value: onsite, color: FORM_COLORS[0] },
    { name: 'Заочно', value: remote, color: FORM_COLORS[1] },
  ];

  return (
    <div className="mini-donut-wrap">
      <Donut
        key={chartKey}
        values={items.map((item) => item.value)}
        colors={items.map((item) => item.color)}
        labels={items.map((item) => item.name)}
        cutout="58%"
        formatValue={(v) => `${v}%`}
      >
        <span className="mini-donut-center">{onsite}%</span>
        <span className="mini-donut-sub">очно</span>
      </Donut>
      <div className="mini-donut-legend">
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
