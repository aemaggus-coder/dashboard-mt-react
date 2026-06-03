import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';

export default function NosoList() {
  const scaledNosology = useScaledData(BASE.nosology, ['value']);
  const total = scaledNosology.reduce((sum, item) => sum + item.value, 0);
  const nosoData = scaledNosology.map(item => ({
    ...item,
    percent: Math.round((item.value / total) * 100),
  }));

  return (
    <div className="noso-list">
      {nosoData.map((item, idx) => (
        <div key={idx} className="noso-item">
          <div className="noso-name">{item.name}</div>
          <div className="noso-row">
            <div className="noso-pct" style={{ background: `hsl(${210 - idx * 15}, 70%, 50%)` }}>
              {item.percent}%
            </div>
            <div className="noso-track">
              <div
                className="noso-fill"
                style={{
                  width: `${item.percent}%`,
                  background: `hsl(${210 - idx * 15}, 70%, 50%)`,
                }}
              ></div>
            </div>
            <div className="noso-count">{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
