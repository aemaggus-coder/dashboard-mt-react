import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';

export default function PrimaryStats() {
  const { period } = useStore();
  const data = useScaledData(BASE.exam[period], ['primary', 'reexam', 'appealMain', 'appealFed']);

  return (
    <div className="primary-stats">
      <div className="primary-stat">
        <div className="stat-hero">{data.primary.toLocaleString('ru-RU')}</div>
        <div className="stat-label">Первичная инвалидность</div>
      </div>
      <div className="primary-stat">
        <div className="stat-hero">{data.reexam.toLocaleString('ru-RU')}</div>
        <div className="stat-label">Переосвидетельствование</div>
      </div>
    </div>
  );
}
