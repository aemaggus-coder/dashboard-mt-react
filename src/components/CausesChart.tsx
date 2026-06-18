import { useSF } from '../hooks/useSF';
import { useStore } from '../hooks/useStore';
import { BASE, causesForSeed } from '../lib/constants';
import Donut from './Donut';

export default function CausesChart() {
  const f = useSF();
  const { scope, selectedRegions, selectedFo } = useStore();
  const chartKey = `${scope}::${selectedFo ?? ''}::${selectedRegions.join(',')}`;

  const seed = scope === 'rf' ? '' : chartKey;
  const causes = [...causesForSeed(seed)].sort((a, b) => b.value - a.value);
  const total = causes.reduce((s, c) => s + c.value, 0);

  // center total — millions / thousands of people
  const totalPeople = Math.round(BASE.total * f);
  const mln = Math.floor(totalPeople / 1000000);
  const ths = Math.round((totalPeople % 1000000) / 1000);
  const totalThs = Math.round(totalPeople / 1000);

  return (
    <div className="causes-donut-wrap">
      <Donut
        key={chartKey}
        values={causes.map((c) => c.value)}
        colors={causes.map((c) => c.color)}
        labels={causes.map((c) => c.name)}
        formatValue={(v) => `${v}%`}
      >
        {mln >= 1 ? (
          <>
            <span className="donut-center-big">{mln}<span className="donut-center-unit"> млн</span></span>
            <span className="donut-center-sub">{ths} тыс. человек</span>
          </>
        ) : (
          <>
            <span className="donut-center-big">{totalThs}<span className="donut-center-unit"> тыс</span></span>
            <span className="donut-center-sub">человек</span>
          </>
        )}
      </Donut>
      <div className="causes-legend">
        {causes.map((cause) => {
          const pct = Math.round((cause.value / total) * 100);
          const count = Math.round((BASE.total * f * cause.value) / 100);
          return (
            <div key={cause.name} className="causes-leg-item">
              <div className="causes-leg-dot" style={{ backgroundColor: cause.color }}></div>
              <div className="causes-leg-body">
                <div className="causes-leg-name">{cause.name}</div>
                <div className="causes-leg-row">
                  <span className="causes-leg-num">{Math.round(count / 1000)}</span>
                  <span className="causes-leg-unit">тыс. чел</span>
                  <span className="causes-leg-pct">{pct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
