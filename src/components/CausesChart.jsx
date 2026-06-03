import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { BASE } from '../lib/constants';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CausesChart() {
  const causes = BASE.causes;
  const labels = causes.map(c => c.name);
  const values = causes.map(c => c.value);
  const colors = causes.map(c => c.color);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 2,
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
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="causes-donut-wrap">
      <div className="chart-wrap">
        <Doughnut data={data} options={options} />
      </div>
      <div className="causes-legend">
        {causes.map((cause, idx) => (
          <div key={idx} className="causes-leg-item">
            <div className="causes-leg-dot" style={{ backgroundColor: cause.color }}></div>
            <div className="causes-leg-body">
              <div className="causes-leg-name">{cause.name}</div>
              <div className="causes-leg-row">
                <div className="causes-leg-num">{cause.value}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
