import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';

export default function PrimaryStats() {
  const { period } = useStore();
  const examData = BASE.exam[period] || BASE.exam.ytd;
  const data = useScaledData(examData, ['primary', 'reexam', 'appealMain', 'appealFed']);

  if (!data) return <div>Загрузка...</div>;

  return (
    <div className="primary-stats">
      <div className="primary-stat">
        <div className="stat-hero">{(data.primary || 0).toLocaleString('ru-RU')}</div>
        <div className="stat-label">Первичная инвалидность</div>
      </div>
      <div className="primary-stat">
        <div className="stat-hero">{(data.reexam || 0).toLocaleString('ru-RU')}</div>
        <div className="stat-label">Переосвидетельствование</div>
      </div>
    </div>
  );
}
