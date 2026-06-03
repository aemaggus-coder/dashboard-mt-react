import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { BASE } from '../lib/constants';

export default function PrimaryStats() {
  const { period } = useStore();
  const examData = BASE.exam[period] || BASE.exam.ytd;
  const data = useScaledData(examData, ['primary', 'reexam', 'appealMain', 'appealFed']);

  // animNum() - animate primary and reexam counts
  const animPrimary = useAnimatedNumber(data?.primary || 0, 600);
  const animReexam = useAnimatedNumber(data?.reexam || 0, 600);

  if (!data) return <div>Загрузка...</div>;

  return (
    <div className="primary-stats">
      <div className="primary-stat">
        <div className="stat-hero">{Math.round(animPrimary).toLocaleString('ru-RU')}</div>
        <div className="stat-label">Первичная инвалидность</div>
      </div>
      <div className="primary-stat">
        <div className="stat-hero">{Math.round(animReexam).toLocaleString('ru-RU')}</div>
        <div className="stat-label">Переосвидетельствование</div>
      </div>
    </div>
  );
}
