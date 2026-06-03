import { useEffect, useState } from 'react';
import { useStore } from '../hooks/useStore';
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
import { BASE, PREV_POP, PREV_EXAM, PREV_TSR, calculateScaleFactor } from '../lib/constants';

export default function Dashboard() {
  const { activeTab, selectedRegions, scope, period } = useStore();
  const [kpiData, setKpiData] = useState([
    { label: 'Численность инвалидов', value: BASE.total, status: 'ok' },
  ]);

  // Update KPI data based on active tab
  useEffect(() => {
    const scale = calculateScaleFactor(scope, selectedRegions);
    let data = [];
    if (activeTab === 'population') {
      data = [
        { label: 'Численность инвалидов', value: Math.round(BASE.total * scale), status: 'ok' },
      ];
    } else if (activeTab === 'exam') {
      const examData = BASE.exam[period];
      const scaledPrimary = Math.round(examData.primary * scale);
      const scaledReexam = Math.round(examData.reexam * scale);
      data = [
        { label: 'Освидетельствовано', value: scaledPrimary + scaledReexam, status: 'ok' },
        { label: 'Средний срок рассмотрения', value: examData.terms, status: 'ok', note: 'дней' },
      ];
    } else if (activeTab === 'tsr') {
      const tsrData = BASE.tsr[period];
      const scaledNat = Math.round(tsrData.issuedNat * scale);
      const scaledCert = Math.round(tsrData.issuedCert * scale);
      const scaledUsed = Math.round(tsrData.budgetUsed * scale);
      const scaledTotal = Math.round(tsrData.budgetTotal * scale);
      data = [
        { label: 'Выдано техсредств', value: scaledNat + scaledCert, status: 'ok' },
        { label: 'Использовано бюджета', value: Math.round((scaledUsed / scaledTotal) * 100), status: 'ok', note: '%' },
      ];
    }
    setKpiData(data);
  }, [activeTab, scope, selectedRegions, period]);

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

  const exportCSV = () => {
    const timestamp = new Date().toLocaleString('ru-RU');
    let csv = 'Центр мониторинга социальной поддержки\n';
    csv += `Экспорт: ${timestamp}\n\n`;
    csv += 'КЛЮЧЕВЫЕ ПОКАЗАТЕЛИ\n';
    csv += 'Показатель,Значение,Статус\n';

    kpiData.forEach(kpi => {
      csv += `"${kpi.label}",${kpi.value},${kpi.status}\n`;
    });

    csv += '\n\nРЕГИОНЫ\n';
    csv += selectedRegions.length > 0 ? selectedRegions.join('\n') : 'Все регионы РФ\n';

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `report_${new Date().getTime()}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="content">
      <div className="kpi-row">
        {kpiData.map((kpi, idx) => (
          <KpiCard key={idx} {...kpi} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between', padding: '14px 0' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <RegionSelector />
          <PeriodSelector />
        </div>
        <button
          onClick={exportCSV}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(59,130,246,.3)',
            background: 'rgba(59,130,246,.12)',
            color: '#60a5fa',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => {
            e.target.style.background = 'rgba(59,130,246,.2)';
            e.target.style.borderColor = '#60a5fa';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'rgba(59,130,246,.12)';
            e.target.style.borderColor = 'rgba(59,130,246,.3)';
          }}
        >
          📥 Экспорт CSV
        </button>
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
