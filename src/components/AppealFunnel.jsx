import { useStore } from '../hooks/useStore';
import { BASE } from '../lib/constants';

export default function AppealFunnel() {
  const { period } = useStore();
  const data = BASE.exam[period] || BASE.exam.ytd;
  const total = (data?.primary || 0) + (data?.reexam || 0) || 1;
  const appealMain = data?.appealMain || 0;
  const appealFed = data?.appealFed || 0;

  const appeals = [
    { label: 'Было обжаловано', value: appealMain, percent: total > 0 ? Math.round((appealMain / total) * 100) : 0 },
    { label: 'На федеральном уровне', value: appealFed, percent: appealMain > 0 ? Math.round((appealFed / appealMain) * 100) : 0 },
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
