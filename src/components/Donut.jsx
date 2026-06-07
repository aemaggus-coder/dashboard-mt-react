import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip);

/**
 * Donut — единый современный стиль колец для всего дашборда.
 * Тонкое кольцо, скруглённые сегменты с зазорами, плавный «sweep» при появлении,
 * лёгкий подъём сегмента при наведении. Центр — через children (overlay).
 */
export default function Donut({
  values,
  colors,
  labels = [],
  cutout = '74%',
  formatValue = (v) => `${v}`,
  children,
}) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 0,
        borderRadius: 6,
        spacing: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout,
    radius: '94%',
    layout: { padding: 4 },
    animation: {
      animateRotate: true,
      animateScale: false,
      duration: 1100,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,17,30,.92)',
        padding: 12,
        cornerRadius: 10,
        titleFont: { size: 13, weight: '700' },
        bodyFont: { size: 12, weight: '600' },
        displayColors: true,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: (c) => '  ' + formatValue(c.parsed, c.dataIndex),
        },
      },
    },
  };

  return (
    <div className="donut-box">
      <Doughnut data={data} options={options} />
      {children && <div className="donut-center">{children}</div>}
    </div>
  );
}
