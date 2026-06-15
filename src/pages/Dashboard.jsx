import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../hooks/useStore';
import { useSF } from '../hooks/useSF';
import KpiCard from '../components/KpiCard';
import MinisterSummary from '../components/MinisterSummary';
import Card from '../components/Card';
import CausesChart from '../components/CausesChart';
import AgeChart from '../components/AgeChart';
import NosoList from '../components/NosoList';
import EmployChart from '../components/EmployChart';
import PrimaryStats from '../components/PrimaryStats';
import FormChart from '../components/FormChart';
import ResultChart from '../components/ResultChart';
import AppealFunnel from '../components/AppealFunnel';
import TermsStats from '../components/TermsStats';
import BudgetGauge from '../components/BudgetGauge';
import IssuedCharts from '../components/IssuedCharts';
import GroupsTable from '../components/GroupsTable';
import PeriodSelector from '../components/PeriodSelector';
import BlockDetail from '../components/BlockDetail';
import { BASE, PREV_POP, PREV_EXAM, PREV_TSR } from '../lib/constants';

// trendHtml() — returns {sign,cls,delta} or null. Arrow reflects direction,
// color (cls) reflects whether the change is good given higherIsBetter.
function makeTrend(curr, prev, higherIsBetter = true) {
  if (prev === undefined || prev === null || prev === 0 || curr === undefined || curr === null) return null;
  const delta = (curr - prev) / Math.abs(prev) * 100;
  if (!isFinite(delta)) return null;
  if (Math.abs(delta) < 0.05) return { sign: '→', cls: 'trend-flat', delta: 0 };
  const up = delta > 0;
  const good = higherIsBetter ? up : !up;
  const displayDelta = Math.max(Math.abs(delta), 0.1);
  return { sign: up ? '▲' : '▼', cls: good ? 'trend-up' : 'trend-down', delta: displayDelta };
}

function trendPeriodLabel(activeTab, period) {
  if (activeTab === 'exam') return period === 'today' ? 'к вчера' : 'к началу года';
  if (activeTab === 'tsr') {
    if (period === 'today') return 'к вчера';
    if (period === 'month') return 'к пред. месяцу';
    return 'к прошлому году';
  }
  return 'к пред. периоду';
}

// jitter() — ±1.4% random variation, applied fresh from base each tick (non-compounding)
const jit = (v) => v * (1 + (Math.random() - 0.5) * 0.014);

export default function Dashboard() {
  const { activeTab, period, syncFromStorage } = useStore();
  const sf = useSF();
  const [tick, setTick] = useState(0);

  // Re-sync region selection from localStorage when returning from map
  useEffect(() => { syncFromStorage(); }, [syncFromStorage]);

  // Live data refresh every 7 seconds (matches old setInterval(loadData,7000))
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 7000);
    return () => clearInterval(interval);
  }, []);

  // renderKPI() — dynamically render KPI based on active tab and scale factor.
  // tick is included so values re-jitter every refresh interval.
  const kpiData = useMemo(() => {
    const f = sf;
    let data = [];

    if (activeTab === 'executive') {
      const exam = BASE.exam.today;
      const tsr = BASE.tsr.today;
      const examined = (exam.primary + exam.reexam) * f;
      const appealRate = ((exam.appealMain + exam.appealFed) / (exam.primary + exam.reexam)) * 100;
      const budgetPct = (tsr.budgetUsed / tsr.budgetTotal) * 100;
      data = [
        { label: 'Общий статус', value: 82, decimals: 0, suffix: '%', note: 'система в норме', status: 'ok', trend: makeTrend(82, 80, true) },
        { label: 'Освидетельствовано', value: examined, note: 'сегодня', status: 'ok', trend: makeTrend(examined, PREV_EXAM.today.tx * f, true) },
        { label: 'Обжалования', value: appealRate, decimals: 1, suffix: '%', note: appealRate > 6 ? 'повышенный уровень' : 'норма', status: appealRate > 6 ? 'warn' : 'ok', trend: makeTrend(appealRate, PREV_EXAM.today.ar, false) },
        { label: 'Финансирование ТСР', value: budgetPct, decimals: 1, suffix: '%', note: 'освоение бюджета', status: budgetPct < 50 ? 'warn' : 'ok', trend: makeTrend(budgetPct, PREV_TSR.today.up, true) },
      ];
    } else if (activeTab === 'population') {
      const total = jit(BASE.total) * f;
      const ad = BASE.age.adults.values.reduce((s, v) => s + v, 0) * f;
      const ch = BASE.age.children.values.reduce((s, v) => s + v, 0) * f;
      data = [
        { label: 'Общая численность', value: total, note: 'по реестру', status: 'ok', trend: makeTrend(total, PREV_POP.total * f, true) },
        { label: 'Взрослые', value: ad, note: 'в тыс. человек', status: 'ok', trend: makeTrend(ad, PREV_POP.ad * f, false) },
        { label: 'Дети-инвалиды', value: ch, note: 'отдельный контроль', status: 'warn', trend: makeTrend(ch, PREV_POP.ch * f, false) },
        { label: 'СВО / Ветераны', value: Math.round(total * 0.29), note: 'по причине инвалидности', status: 'ok', trend: null },
      ];
    } else if (activeTab === 'exam') {
      const d = BASE.exam[period] || BASE.exam.today;
      const tx = jit(d.primary + d.reexam) * f;
      const ap = jit(d.appealMain + d.appealFed) * f;
      const ar = ap / tx * 100;
      const inval = Math.round(tx * d.result[0] / 100);
      const pp = PREV_EXAM[period] || PREV_EXAM.today;
      const prevTx = pp.tx * f;
      const prevInval = Math.round(prevTx * (pp.res || d.result[0]) / 100);
      const prevAppeal = prevTx * (pp.ar || ar) / 100;
      data = [
        { label: 'Освидетельствовано', value: tx, note: period === 'today' ? 'сегодня' : 'за период', status: 'ok', trend: makeTrend(tx, prevTx, true) },
        { label: 'Установлено', value: inval, note: 'инвалидность', status: 'ok', trend: makeTrend(inval, prevInval, true) },
        { label: 'Обжаловано', value: ap, note: ar > 6 ? 'повышенный уровень' : 'норма', status: ar > 6 ? 'warn' : 'ok', trend: makeTrend(ap, prevAppeal, true) },
      ];
    } else if (activeTab === 'tsr') {
      const d = BASE.tsr[period] || BASE.tsr.today;
      const issNat = jit(d.issuedNat), issCert = jit(d.issuedCert);
      const iss = (issNat + issCert) * f;
      const people = d.groups.reduce((sum, group) => sum + group.people, 0) * f;
      const pp = PREV_TSR[period] || PREV_TSR.today;
      const prevCert = pp.iss * pp.cp / 100 * f;
      data = [
        { label: 'Обеспечено инвалидов', value: people, note: period === 'today' ? 'сегодня' : 'за период', status: 'ok', trend: makeTrend(people, pp.iss * 0.28 * f, true) },
        { label: 'Выдано всего ТСР', value: iss, note: period === 'today' ? 'сегодня' : 'за период', status: 'ok', trend: makeTrend(iss, pp.iss * f, true) },
        { label: 'Выдано натур', value: issNat * f, note: 'натуральная выдача', status: 'ok', trend: makeTrend(issNat * f, pp.iss * 0.54 * f, true) },
        { label: 'Эл. сертификаты', value: issCert * f, note: 'электронная выдача', status: 'ok', trend: makeTrend(issCert * f, prevCert, true) },
      ];
    }

    const periodLabel = trendPeriodLabel(activeTab, period);
    return data.map((item) => (
      item.trend ? { ...item, trend: { ...item.trend, periodLabel } } : item
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, sf, period, tick]); // tick re-jitters values on each refresh interval

  return (
    <div className="content">
      <div className="kpi-row" style={{ gridTemplateColumns: `repeat(${kpiData.length || 4}, 1fr)` }}>
        {kpiData.map((kpi, idx) => (
          <KpiCard key={idx} {...kpi} />
        ))}
      </div>
      {(activeTab === 'exam' || activeTab === 'tsr') && (
        <div className="period-row" style={{ display: 'block' }}>
          <PeriodSelector />
        </div>
      )}

      {activeTab === 'executive' && (
        <div className="view active" id="view-executive">
          <MinisterSummary />
        </div>
      )}

      {activeTab === 'population' && (
        <div className="view active" id="view-population">
          <Card id="card-causes" label="Структура" title="Причины инвалидности" detailsContent={<BlockDetail block="causes" />}>
            <CausesChart />
          </Card>
          <Card id="card-age" label="Демография" title="Возрастные группы" detailsContent={<BlockDetail block="age" />}>
            <AgeChart />
          </Card>
          <Card id="card-employ" label="Труд и занятость" title="Занятость" detailsContent={<BlockDetail block="employ" />}>
            <EmployChart />
          </Card>
          <Card id="card-noso" label="Нозологии" title="Нозологический профиль" detailsContent={<BlockDetail block="noso" />}>
            <NosoList />
          </Card>
        </div>
      )}

      {activeTab === 'exam' && (
        <div className="view active" id="view-exam">
          <Card id="card-primary" label="Экспертиза" title="Освидетельствование" detailsContent={<BlockDetail block="primary" />}>
            <PrimaryStats />
          </Card>
          <Card id="card-form" label="Формат" title="Форма проведения" detailsContent={<BlockDetail block="form" />}>
            <FormChart />
          </Card>
          <Card id="card-result" label="Итог МСЭ" title="Результаты" detailsContent={<BlockDetail block="result" />}>
            <ResultChart />
          </Card>
          <Card id="card-appeal" label="Несогласие" title="Обжалования" detailsContent={<BlockDetail block="appeal" />}>
            <AppealFunnel />
          </Card>
          <Card id="card-terms" label="Сроки МСЭ" title="Эффективность" detailsContent={<BlockDetail block="terms" />}
            titleBadge={(() => { const v = (BASE.exam[period] || BASE.exam.today).terms; return <span className={`terms-badge ${v > 30 ? 'risk' : 'ok'}`}>{v > 30 ? 'Превышен норматив' : 'В норме'}</span>; })()}>
            <TermsStats />
          </Card>
        </div>
      )}

      {activeTab === 'tsr' && (
        <div className="view active" id="view-tsr">
          <Card id="card-issued" label="Выдача" title="Выдача ТСР" detailsContent={<BlockDetail block="issued" />}>
            <IssuedCharts />
          </Card>
          <Card id="card-budget" label="Финансирование" title="Освоение бюджета" detailsContent={<BlockDetail block="budget" />}>
            <BudgetGauge />
          </Card>
          <Card id="card-groups" label="Группы ТСР" title="Распределение по типам" detailsContent={<BlockDetail block="groups" />}>
            <GroupsTable />
          </Card>
        </div>
      )}
    </div>
  );
}
