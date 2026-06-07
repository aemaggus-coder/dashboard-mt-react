import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AgeChart() {
  const [ageMode, setAgeMode] = useState(localStorage.getItem('age-mode') || 'children');
  const { theme } = useStore();
  const dark = theme === 'dark';
  const scaledAge = useScaledData(BASE.age, ['values', 'male', 'female']);
  const ageData = scaledAge[ageMode];

  const selectMode = (mode) => {
    localStorage.setItem('age-mode', mode);
    setAgeMode(mode);
  };

  const data = {
    labels: ageData.labels,
    datasets: [
      {
        label: 'Мужчины',
        data: ageData.male,
        backgroundColor: '#3f7bff',
        borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
        stack: 'age',
        barPercentage: 0.42,
        categoryPercentage: 0.72,
      },
      {
        label: 'Женщины',
        data: ageData.female,
        backgroundColor: '#ec4899',
        borderRadius: { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
        stack: 'age',
        barPercentage: 0.42,
        categoryPercentage: 0.72,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,17,30,.92)',
        padding: 12,
        cornerRadius: 10,
        titleFont: { size: 13, weight: '700' },
        bodyFont: { size: 12 },
        callbacks: { label: (c) => ' ' + c.parsed.y.toLocaleString('ru-RU') + ' чел.' },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false, drawTicks: true, tickLength: 4, tickColor: dark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(15, 23, 42, 0.22)' },
        border: { display: true, color: dark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(15, 23, 42, 0.18)' },
        ticks: { color: dark ? '#ffffff' : '#172033', font: { size: 16, weight: '800' }, maxRotation: 0, minRotation: 0, autoSkip: false, padding: 10 },
      },
      y: {
        stacked: true,
        grid: { display: false },
        border: { display: false },
        ticks: { display: false },
      },
    },
    layout: { padding: { bottom: 18, left: 4, right: 4 } },
  };

  return (
    <div className="age-chart-panel">
      <div className="age-header">
        <div className="card-toggle age-toggle">
          <button
            className={`card-toggle-btn ${ageMode === 'children' ? 'active' : ''}`}
            onClick={() => selectMode('children')}
          >
            Дети
          </button>
          <button
            className={`card-toggle-btn ${ageMode === 'adults' ? 'active' : ''}`}
            onClick={() => selectMode('adults')}
          >
            Взрослые
          </button>
        </div>
        <div className="age-legend">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', background: '#3f7bff', borderRadius: '3px' }}></span>
            <span style={{ fontSize: '11px', color: 'var(--text-2)' }}>Мужчины</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', background: '#ec4899', borderRadius: '3px' }}></span>
            <span style={{ fontSize: '11px', color: 'var(--text-2)' }}>Женщины</span>
          </span>
        </div>
      </div>
      <div className="chart-wrap age-chart-wrap">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
