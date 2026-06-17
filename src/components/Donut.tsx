import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip);

function getOrCreateTooltip(chart) {
  let tooltipEl = chart.canvas.parentNode.querySelector('.donut-tooltip');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'donut-tooltip';
    tooltipEl.innerHTML = '<div class="donut-tooltip-title"></div><div class="donut-tooltip-body"></div>';
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
}

/**
 * Donut — единый современный стиль колец для всего дашборда.
 * Тонкое кольцо, скруглённые сегменты с зазорами, плавный «sweep» при появлении,
 * лёгкий подъём сегмента при наведении. Центр — через children (overlay).
 */
export default function Donut({
  values,
  colors,
  labels = [] as string[],
  cutout = '74%',
  formatValue = (v: number) => `${v}`,
  children,
}: {
  values: number[];
  colors: string[];
  labels?: string[];
  cutout?: string;
  formatValue?: (v: number) => string;
  children?: React.ReactNode;
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
        enabled: false,
        external: ({ chart, tooltip }) => {
          const tooltipEl = getOrCreateTooltip(chart);

          if (tooltip.opacity === 0) {
            tooltipEl.classList.remove('show');
            return;
          }

          const title = tooltip.title?.[0] || '';
          const body = tooltip.body?.map((item) => item.lines).flat().join('') || '';
          const color = tooltip.labelColors?.[0]?.backgroundColor || 'var(--blue-l)';
          const titleEl = tooltipEl.querySelector('.donut-tooltip-title');
          const bodyEl = tooltipEl.querySelector('.donut-tooltip-body');

          titleEl.textContent = title;
          bodyEl.innerHTML = `<span class="donut-tooltip-dot" style="background:${color}"></span>${body}`;

          const { offsetLeft, offsetTop } = chart.canvas;
          const chartArea = chart.chartArea;
          const boxWidth = chart.canvas.parentNode.clientWidth;
          const boxHeight = chart.canvas.parentNode.clientHeight;

          tooltipEl.classList.add('show');

          const width = tooltipEl.offsetWidth;
          const height = tooltipEl.offsetHeight;
          let left = offsetLeft + chartArea.right + 10;
          let top = offsetTop + tooltip.caretY - height / 2;

          if (left + width > boxWidth - 4) {
            left = offsetLeft + chartArea.left - width - 10;
          }

          left = Math.max(4, Math.min(left, boxWidth - width - 4));
          top = Math.max(4, Math.min(top, boxHeight - height - 4));

          tooltipEl.style.left = `${left}px`;
          tooltipEl.style.top = `${top}px`;
        },
        backgroundColor: 'rgba(15,17,30,.92)',
        padding: 12,
        cornerRadius: 10,
        titleFont: { size: 13, weight: '700' },
        bodyFont: { size: 12, weight: '600' },
        displayColors: true,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: (c) => '  ' + formatValue(c.parsed as number),
        },
      },
    },
  };

  return (
    <div className="donut-box">
      <Doughnut data={data} options={options as any} />
      {children && <div className="donut-center">{children}</div>}
    </div>
  );
}
