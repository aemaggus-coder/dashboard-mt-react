import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';

export default function EmployChart() {
  const scaledData = useScaledData(BASE.employ, ['working', 'notWorking']);
  const { labels, working, notWorking } = scaledData;

  const groups = labels.map((name, idx) => ({
    name,
    working: working[idx] * 1000,
    notWorking: notWorking[idx] * 1000,
    percent: Math.round((working[idx] / (working[idx] + notWorking[idx])) * 100),
  }));

  return (
    <div className="employ-stats">
      {groups.map((group, idx) => (
        <div key={idx} className={`ecard g${idx + 1}`}>
          <div className="ecard-grp">{group.name}</div>
          <div className="ecard-pct">{group.percent}%</div>
          <div className="ecard-pct-lbl">Трудоустроено</div>
          <div className="ecard-sep"></div>
          <div className="ecard-nums">
            <div className="ecard-num">
              <div className="ecard-num-val work">{(group.working / 1000).toFixed(0)}k</div>
              <div className="ecard-num-lbl">Работают</div>
            </div>
            <div className="ecard-num">
              <div className="ecard-num-val nowork">{(group.notWorking / 1000).toFixed(0)}k</div>
              <div className="ecard-num-lbl">Не работают</div>
            </div>
          </div>
          <div className="ecard-bar">
            <div className="ecard-bar-fill" style={{ width: `${group.percent}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}
