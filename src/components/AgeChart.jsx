import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AgeChart() {
  const [ageMode, setAgeMode] = useState('children');
  const scaledAge = useScaledData(BASE.age, ['values', 'male', 'female']);
  const ageData = scaledAge[ageMode];

  const data = {
    labels: ageData.labels,
    datasets: [
      {
        label: 'Мужчины',
        data: ageData.male,
        backgroundColor: '#3f7bff',
        borderRadius: 6,
      },
      {
        label: 'Женщины',
        data: ageData.female,
        backgroundColor: '#ec4899',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, weight: '700' },
        bodyFont: { size: 12 },
        callbacks: {
          label: (c) => ' ' + c.parsed.y.toLocaleString('ru-RU') + ' чел.',
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          onClick={() => setAgeMode('children')}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            background: ageMode === 'children' ? '#3f7bff' : 'rgba(255,255,255,.1)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
        >
          Дети
        </button>
        <button
          onClick={() => setAgeMode('adults')}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: 'none',
            background: ageMode === 'adults' ? '#3f7bff' : 'rgba(255,255,255,.1)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
        >
          Взрослые
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
