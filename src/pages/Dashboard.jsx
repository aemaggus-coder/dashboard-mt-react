import { useEffect, useState } from 'react';
import { useStore } from '../hooks/useStore';
import { useSF } from '../hooks/useSF';
import KpiCard from '../components/KpiCard';
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
import RegionSelector from '../components/RegionSelector';
import CausesDetails from '../components/CausesDetails';
import PrimaryStatsDetails from '../components/PrimaryStatsDetails';
import FormChartDetails from '../components/FormChartDetails';
import ResultChartDetails from '../components/ResultChartDetails';
import AppealFunnelDetails from '../components/AppealFunnelDetails';
import TermsStatsDetails from '../components/TermsStatsDetails';
import BudgetGaugeDetails from '../components/BudgetGaugeDetails';
import IssuedChartsDetails from '../components/IssuedChartsDetails';
import GroupsTableDetails from '../components/GroupsTableDetails';
import AgeChartDetails from '../components/AgeChartDetails';
import EmployChartDetails from '../components/EmployChartDetails';
import NosoListDetails from '../components/NosoListDetails';
import BlockDetail from '../components/BlockDetail';
import { BASE, PREV_POP, PREV_EXAM, PREV_TSR } from '../lib/constants';

export default function Dashboard() {
  const { activeTab, period } = useStore();
  const sf = useSF();
  const [kpiData, setKpiData] = useState([]);

  // renderKPI() - Dynamically render KPI based on active tab and scale factor
  useEffect(() => {
    let data = [];

    if (activeTab === 'population') {
      const current = Math.round(BASE.total * sf);
      const previous = Math.round(PREV_POP.total * sf);
      const trend = ((current - previous) / previous * 100).toFixed(1);

      data = [
        {
          label: 'Численность инвалидов',
          value: current,
          status: 'ok',
          trend: trend,
          trendIsGood: trend > 0,
        },
      ];
    } else if (activeTab === 'exam') {
      const examData = BASE.exam[period] || BASE.exam.ytd;
      const prevData = PREV_EXAM[period] || PREV_EXAM.ytd;
      const primary = Math.round((examData?.primary || 0) * sf);
      const reexam = Math.round((examData?.reexam || 0) * sf);
      const total = primary + reexam;
      const prevTotal = Math.round((prevData?.tx || 0) * sf);
      const examTrend = prevTotal > 0 ? ((total - prevTotal) / prevTotal * 100).toFixed(1) : '0';

      const terms = examData?.terms || 21.4;
      const prevTerms = prevData?.terms || 22.1;
      const termsTrend = ((terms - prevTerms) / prevTerms * 100).toFixed(1);

      const appealRate = ((examData?.appealMain || 0) + (examData?.appealFed || 0)) / ((examData?.primary || 0) + (examData?.reexam || 0)) * 100;
      const prevAppealRate = (prevData?.ar || 5.8);
      const appealTrend = ((appealRate - prevAppealRate) / prevAppealRate * 100).toFixed(1);

      data = [
        {
          label: 'Освидетельствовано',
          value: total,
          status: total > 200000 ? 'ok' : 'warning',
          trend: examTrend,
          trendIsGood: examTrend > 0,
        },
        {
          label: 'Средний срок рассмотрения',
          value: terms,
          status: terms < 30 ? 'ok' : 'warning',
          note: 'дней',
          trend: termsTrend,
          trendIsGood: termsTrend < 0,
        },
        {
          label: 'Уровень обжалований',
          value: appealRate.toFixed(1),
          status: 'ok',
          note: '%',
          trend: appealTrend,
          trendIsGood: appealTrend < 0,
        },
      ];
    } else if (activeTab === 'tsr') {
      const tsrData = BASE.tsr[period] || BASE.tsr.ytd;
      const prevData = PREV_TSR[period] || PREV_TSR.ytd;
      const issued = Math.round(((tsrData?.issuedNat || 0) + (tsrData?.issuedCert || 0)) * sf);
      const prevIssued = Math.round((prevData?.iss || 0) * sf);
      const issueTrend = prevIssued > 0 ? ((issued - prevIssued) / prevIssued * 100).toFixed(1) : '0';

      const budgetUsed = Math.round((tsrData?.budgetUsed || 0) * sf);
      const budgetTotal = Math.round((tsrData?.budgetTotal || 0) * sf);
      const utilization = budgetTotal > 0 ? Math.round((budgetUsed / budgetTotal) * 100) : 0;
      const prevUtilization = prevData?.up || 66.7;
      const utilizationTrend = ((utilization - prevUtilization) / prevUtilization * 100).toFixed(1);

      data = [
        {
          label: 'Выдано техсредств',
          value: issued,
          status: 'ok',
          trend: issueTrend,
          trendIsGood: issueTrend > 0,
        },
        {
          label: 'Освоено бюджета',
          value: utilization,
          status: utilization > 60 ? 'ok' : 'warning',
          note: '%',
          trend: utilizationTrend,
          trendIsGood: utilizationTrend > 0,
        },
        {
          label: 'Выделено средств',
          value: budgetTotal,
          status: 'ok',
          note: 'млн ₽',
        },
      ];
    }

    setKpiData(data);
  }, [activeTab, sf, period]);

  // Live data refresh every 5 seconds with jitter()
  useEffect(() => {
    const interval = setInterval(() => {
      setKpiData(prev => prev.map(kpi => {
        // jitter() - add ±0.7% random variation for realism
        const jitteredValue = typeof kpi.value === 'number'
          ? Math.round(kpi.value * (1 + (Math.random() - 0.5) * 0.007))
          : kpi.value;
        return {
          ...kpi,
          value: jitteredValue
        };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="content">
      <div className="kpi-row">
        {kpiData.map((kpi, idx) => (
          <KpiCard key={idx} {...kpi} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0' }}>
        <RegionSelector />
        <PeriodSelector />
      </div>

      {activeTab === 'population' && (
        <div className="view active" id="view-population">
          <Card id="card-causes" label="Структура" title="Причины инвалидности" detailsContent={<BlockDetail block="causes" />}>
            <CausesChart />
          </Card>
          <Card id="card-age" label="Демография" title="Возрастные группы" detailsContent={<BlockDetail block="age" />}>
            <div className="chart-wrap">
              <AgeChart />
            </div>
          </Card>
          <Card id="card-employ" label="Занятость" title="Группы трудоустройства" detailsContent={<BlockDetail block="employ" />}>
            <EmployChart />
          </Card>
          <Card id="card-noso" label="Нозологии" title="Нозологии" detailsContent={<BlockDetail block="noso" />}>
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
          <Card id="card-terms" label="Сроки" title="Средний срок рассмотрения" detailsContent={<BlockDetail block="terms" />}>
            <TermsStats />
          </Card>
        </div>
      )}

      {activeTab === 'tsr' && (
        <div className="view active" id="view-tsr">
          <Card id="card-budget" label="Бюджет" title="Объем финансирования" detailsContent={<BlockDetail block="budget" />}>
            <BudgetGauge />
          </Card>
          <Card id="card-issued" label="Выданные ТСР" title="Количество техсредств" detailsContent={<BlockDetail block="issued" />}>
            <IssuedCharts />
          </Card>
          <Card id="card-groups" label="Группы ТСР" title="Распределение по типам" detailsContent={<BlockDetail block="groups" />}>
            <GroupsTable />
          </Card>
        </div>
      )}
    </div>
  );
}
