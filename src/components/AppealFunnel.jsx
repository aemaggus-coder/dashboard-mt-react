import { useStore } from '../hooks/useStore';
import { BASE } from '../lib/constants';

export default function AppealFunnel() {
  const { period } = useStore();
  const data = BASE.exam[period];
  const total = data.primary + data.reexam;

  const appeals = [
    { label: 'Было обжаловано', value: data.appealMain, percent: Math.round((data.appealMain / total) * 100) },
    { label: 'На федеральном уровне', value: data.appealFed, percent: Math.round((data.appealFed / data.appealMain) * 100) },
  ];

  return (
    <div className="appeal-funnel">
      {appeals.map((item, idx) => (
        <div key={idx} className={`appeal-row`}>
          <div className="appeal-row-top">
            <span className="appeal-row-label">{item.label}</span>
            <span className="appeal-row-pct">{item.percent}%</span>
          </div>
          <div className="appeal-track">
            <div
              className="appeal-fill"
              style={{
                width: `${Math.min(item.percent, 100)}%`,
                background: '#3b82f6',
              }}
            ></div>
          </div>
          <div className="appeal-row-num">{item.value.toLocaleString('ru-RU')}</div>
        </div>
      ))}
    </div>
  );
}
