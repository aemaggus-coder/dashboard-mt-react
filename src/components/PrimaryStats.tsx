import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { useAnimatedValue } from '../hooks/useAnimatedValue';
import { BASE } from '../lib/constants';

export default function PrimaryStats() {
  const { period } = useStore();
  const examData = (BASE.exam as Record<string, typeof BASE.exam.today>)[period] || BASE.exam.ytd;
  const data = useScaledData(examData, ['primary', 'reexam', 'appealMain', 'appealFed']);

  // animNum() - animate primary and reexam counts
  const animPrimary = useAnimatedValue(data?.primary || 0, 600, { decimals: 0, from: 0 });
  const animReexam = useAnimatedValue(data?.reexam || 0, 600, { decimals: 0, from: 0 });

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
