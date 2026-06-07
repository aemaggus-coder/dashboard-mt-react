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
  const total = data.primary + data.reexam;
  const primaryPct = total > 0 ? (data.primary / total) * 100 : 0;
  const reexamPct = total > 0 ? (data.reexam / total) * 100 : 0;

  return (
    <div className="exam-summary-card exam-primary-summary">
      <div className="exam-summary-row">
        <div className="exam-summary-title">Первичная инвалидность</div>
        <div className="exam-summary-value">
          {Math.round(animPrimary).toLocaleString('ru-RU')} <span>({primaryPct.toFixed(1)}%)</span>
        </div>
      </div>
      <div className="exam-summary-row">
        <div className="exam-summary-title">Переосвидетельствование<br />(повторное)</div>
        <div className="exam-summary-value">
          {Math.round(animReexam).toLocaleString('ru-RU')} <span>({reexamPct.toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  );
}
