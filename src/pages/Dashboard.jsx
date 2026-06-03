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
import { BASE, PREV_POP, PREV_EXAM, PREV_TSR } from '../lib/constants';

export default function Dashboard() {
  const { activeTab, period } = useStore();
  const sf = useSF();
  const [kpiData, setKpiData] = useState([]);

  // Dynamically render KPI based on active tab and scale factor
  useEffect(() => {
    let data = [];

    if (activeTab === 'population') {
      data = [
        {
          label: 'Численность инвалидов',
          value: Math.round(BASE.total * sf),
          status: 'ok',
        },
      ];
    } else if (activeTab === 'exam') {
      const examData = BASE.exam[period] || BASE.exam.ytd;
      const primary = Math.round((examData?.primary || 0) * sf);
      const reexam = Math.round((examData?.reexam || 0) * sf);
      const total = primary + reexam;

      data = [
        {
          label: 'Освидетельствовано',
          value: total,
          status: total > 200000 ? 'ok' : 'warning',
        },
        {
          label: 'Средний срок рассмотрения',
          value: examData?.terms || 21.4,
          status: (examData?.terms || 21.4) < 30 ? 'ok' : 'warning',
          note: 'дней',
        },
        {
          label: 'Уровень обжалований',
          value: (((examData?.appealMain || 0) + (examData?.appealFed || 0)) / ((examData?.primary || 0) + (examData?.reexam || 0)) * 100).toFixed(1),
          status: 'ok',
          note: '%',
        },
      ];
    } else if (activeTab === 'tsr') {
      const tsrData = BASE.tsr[period] || BASE.tsr.ytd;
      const issued = Math.round(((tsrData?.issuedNat || 0) + (tsrData?.issuedCert || 0)) * sf);
      const budgetUsed = Math.round((tsrData?.budgetUsed || 0) * sf);
      const budgetTotal = Math.round((tsrData?.budgetTotal || 0) * sf);
      const utilization = budgetTotal > 0 ? Math.round((budgetUsed / budgetTotal) * 100) : 0;

      data = [
        {
          label: 'Выдано техсредств',
          value: issued,
          status: 'ok',
        },
        {
          label: 'Освоено бюджета',
          value: utilization,
          status: utilization > 60 ? 'ok' : 'warning',
          note: '%',
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

  // Live data refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setKpiData(prev => prev.map(kpi => ({
        ...kpi,
        value: Math.round(kpi.value * (1 + (Math.random() - 0.5) * 0.002))
      })));
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
        <div className="view active" id="view-population" style={{ display: 'grid' }}>
          <Card id="card-causes" label="Структура" title="Причины инвалидности" detailsContent={<CausesDetails />}>
            <CausesChart />
          </Card>
          <Card id="card-age" label="Демография" title="Возрастные группы" detailsContent={<AgeChartDetails />}>
            <div className="chart-wrap">
              <AgeChart />
            </div>
          </Card>
          <Card id="card-employ" label="Занятость" title="Группы трудоустройства" detailsContent={<EmployChartDetails />}>
            <EmployChart />
          </Card>
          <Card id="card-noso" label="Нозологии" title="Нозологии" detailsContent={<NosoListDetails />}>
            <NosoList />
          </Card>
        </div>
      )}

      {activeTab === 'exam' && (
        <div className="view active" id="view-exam" style={{ display: 'grid' }}>
          <Card id="card-primary" label="Экспертиза" title="Освидетельствование" detailsContent={<PrimaryStatsDetails />}>
            <PrimaryStats />
          </Card>
          <Card id="card-form" label="Формат" title="Форма проведения" detailsContent={<FormChartDetails />}>
            <FormChart />
          </Card>
          <Card id="card-result" label="Итог МСЭ" title="Результаты" detailsContent={<ResultChartDetails />}>
            <ResultChart />
          </Card>
          <Card id="card-appeal" label="Несогласие" title="Обжалования" detailsContent={<AppealFunnelDetails />}>
            <AppealFunnel />
          </Card>
          <Card id="card-terms" label="Сроки" title="Средний срок рассмотрения" detailsContent={<TermsStatsDetails />}>
            <TermsStats />
          </Card>
        </div>
      )}

      {activeTab === 'tsr' && (
        <div className="view active" id="view-tsr" style={{ display: 'grid' }}>
          <Card id="card-budget" label="Бюджет" title="Объем финансирования" detailsContent={<BudgetGaugeDetails />}>
            <BudgetGauge />
          </Card>
          <Card id="card-issued" label="Выданные ТСР" title="Количество техсредств" detailsContent={<IssuedChartsDetails />}>
            <IssuedCharts />
          </Card>
          <Card id="card-groups" label="Группы ТСР" title="Распределение по типам" detailsContent={<GroupsTableDetails />}>
            <GroupsTable />
          </Card>
        </div>
      )}
    </div>
  );
}
