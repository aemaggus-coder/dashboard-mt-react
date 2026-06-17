import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { BASE } from '../lib/constants';
import { fmt } from '../lib/formatters';

const riskRegions = [
  { name: 'Липецкая область',       reason: 'рост обжалований',   value: '+4.8%'   },
  { name: 'Архангельская область',  reason: 'сроки МСЭ',          value: '24.6 дн.' },
  { name: 'Донецкая НР',            reason: 'обеспечение ТСР',    value: '68%'     },
  { name: 'Красноярский край',      reason: 'нагрузка бюро',      value: '+7.1%'   },
  { name: 'Волгоградская область',  reason: 'ожидание выдачи',    value: '15%'     },
  { name: 'Кемеровская область',    reason: 'первичная инвал.',    value: '+3.2%'   },
  { name: 'Саратовская область',    reason: 'сроки МСЭ',          value: '27.1 дн.' },
  { name: 'Иркутская область',      reason: 'обеспечение ТСР',    value: '71%'     },
  { name: 'Ставропольский край',    reason: 'нагрузка бюро',      value: '+5.4%'   },
  { name: 'Оренбургская область',   reason: 'рост обжалований',   value: '+3.9%'   },
];

const riskBadgeColors = [
  { bg: '#ef4444', shadow: 'rgba(239,68,68,0.45)' },
  { bg: '#f97316', shadow: 'rgba(249,115,22,0.40)' },
  { bg: '#f59e0b', shadow: 'rgba(245,158,11,0.35)' },
  { bg: '#eab308', shadow: 'rgba(234,179,8,0.30)' },
  { bg: '#84cc16', shadow: 'rgba(132,204,22,0.25)' },
  { bg: '#ef4444', shadow: 'rgba(239,68,68,0.38)' },
  { bg: '#f97316', shadow: 'rgba(249,115,22,0.34)' },
  { bg: '#f59e0b', shadow: 'rgba(245,158,11,0.28)' },
  { bg: '#eab308', shadow: 'rgba(234,179,8,0.24)' },
  { bg: '#84cc16', shadow: 'rgba(132,204,22,0.20)' },
];

const decisions = [
  { text: 'Проверить регионы с ростом обжалований выше 6%', tab: 'exam' },
  { text: 'Отдельно проконтролировать сроки МСЭ в бюро с высокой нагрузкой', tab: 'exam' },
  { text: 'Ускорить выдачу ТСР по группам с высоким остатком заявок', tab: 'tsr' },
];

export default function MinisterSummary() {
  const navigate = useNavigate();
  const { setFocusTarget } = useStore();
  const exam = BASE.exam.today;
  const tsr = BASE.tsr.today;
  const examined = exam.primary + exam.reexam;
  const appeals = exam.appealMain + exam.appealFed;
  const appealRate = (appeals / examined) * 100;
  const budgetPct = (tsr.budgetUsed / tsr.budgetTotal) * 100;
  const issued = tsr.issuedNat + tsr.issuedCert;
  const signals = [
    { label: 'Освидетельствовано', value: fmt(examined), note: 'сегодня', tab: 'exam', target: 'card-primary' },
    { label: 'Обжалования', value: `${appealRate.toFixed(1)}%`, note: 'от освидетельствованных', tab: 'exam', target: 'card-appeal', warn: true },
    { label: 'Выдано ТСР', value: fmt(issued), note: 'единиц', tab: 'tsr', target: 'card-issued' },
    { label: 'Освоение бюджета', value: `${budgetPct.toFixed(1)}%`, note: 'на текущий период', tab: 'tsr', target: 'card-budget', warn: true },
  ];

  const openDashboardFocus = (tab, target) => {
    setFocusTarget(target);
    navigate(`/dashboard?tab=${tab}`, { replace: true });
  };

  return (
    <div className="minister-summary">
      <section className="minister-panel minister-panel-main">
        <div className="minister-panel-head">
          <div>
            <div className="minister-label">Сводка для руководителя</div>
            <h2>Ситуация стабильная, контроль требуется по 4 направлениям</h2>
          </div>
          <div className="minister-status ok">
            <span className="minister-status-dot" />
            В рабочей норме
          </div>
        </div>
        <div className="minister-signal-grid">
          {signals.map((signal) => (
            <button
              key={signal.label}
              type="button"
              className={`minister-signal ${signal.warn ? 'warn' : ''}`}
              onClick={() => openDashboardFocus(signal.tab, signal.target)}
            >
              <span>{signal.label}</span>
              <strong>{signal.value}</strong>
              <em>{signal.note}</em>
              <small>Открыть данные</small>
            </button>
          ))}
        </div>
      </section>

      <section className="minister-panel minister-panel-risks">
        <div className="minister-label">Регионы риска</div>
        <div className="minister-risk-list">
          {riskRegions.map((region, idx) => (
            <Link className="minister-risk-row" key={region.name} to={`/map?region=${encodeURIComponent(region.name)}`} title={`Открыть карту: ${region.name}`}>
              <span style={{ background: riskBadgeColors[idx].bg, boxShadow: `0 0 8px ${riskBadgeColors[idx].shadow}` }}>{idx + 1}</span>
              <strong>{region.name}</strong>
              <em>{region.reason}</em>
              <b>{region.value}</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="minister-panel minister-panel-actions">
        <div className="minister-label">Решения к контролю</div>
        <div className="minister-action-list">
          {decisions.map((decision, idx) => (
            <button
              className="minister-action-row"
              key={decision.text}
              type="button"
              onClick={() => openDashboardFocus(decision.tab, decision.tab === 'exam' ? 'card-appeal' : 'card-groups')}
            >
              <span>{idx + 1}</span>
              <strong>{decision.text}</strong>
              <em>Открыть данные</em>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
