import { useState } from 'react';
import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';

export default function EmployChart() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const scaledData = useScaledData(BASE.employ, ['working', 'notWorking']);
  const { labels, working, notWorking } = scaledData;
  const maxTotal = Math.max(...labels.map((_, idx) => working[idx] + notWorking[idx]));
  const chartHeight = 196;

  const groups = labels.map((name, idx) => ({
    name,
    working: working[idx] * 1000,
    notWorking: notWorking[idx] * 1000,
    workingRaw: working[idx],
    notWorkingRaw: notWorking[idx],
  }));

  return (
    <div className="employ-chart">
      <div className="employ-legend" aria-hidden="true">
        <span><i className="employ-dot employ-dot-work" />Работают</span>
        <span><i className="employ-dot employ-dot-nowork" />Не работают</span>
      </div>
      <svg className="employ-bars" viewBox="0 0 360 242" role="img" aria-label="Группы трудоустройства">
        <line className="employ-axis" x1="16" y1="204" x2="344" y2="204" />
        {[126, 234].map((x) => (
          <line key={x} className="employ-tick" x1={x} y1="204" x2={x} y2="208" />
        ))}
        {groups.map((group, idx) => {
          const x = 54 + idx * 108;
          const totalHeight = ((group.workingRaw + group.notWorkingRaw) / maxTotal) * chartHeight;
          const workingHeight = (group.workingRaw / (group.workingRaw + group.notWorkingRaw)) * totalHeight;
          const notWorkingHeight = totalHeight - workingHeight;
          const yTop = 204 - totalHeight;
          const ySplit = 204 - workingHeight;

          return (
            <g
              key={group.name}
              className="employ-bar-group"
            >
              <rect
                className="employ-bar employ-bar-work"
                x={x}
                y={ySplit}
                width="48"
                height={workingHeight}
                tabIndex="0"
                onMouseEnter={() => setHoveredItem({ group: group.name, label: 'Работают', value: group.working, idx, color: '#4281ee' })}
                onMouseLeave={() => setHoveredItem(null)}
                onFocus={() => setHoveredItem({ group: group.name, label: 'Работают', value: group.working, idx, color: '#4281ee' })}
                onBlur={() => setHoveredItem(null)}
              />
              <rect
                className="employ-bar employ-bar-nowork"
                x={x}
                y={yTop}
                width="48"
                height={notWorkingHeight}
                tabIndex="0"
                onMouseEnter={() => setHoveredItem({ group: group.name, label: 'Не работают', value: group.notWorking, idx, color: '#9bbdf6' })}
                onMouseLeave={() => setHoveredItem(null)}
                onFocus={() => setHoveredItem({ group: group.name, label: 'Не работают', value: group.notWorking, idx, color: '#9bbdf6' })}
                onBlur={() => setHoveredItem(null)}
              />
              <text className="employ-label" x={x + 24} y="230" textAnchor="middle">{group.name}</text>
            </g>
          );
        })}
      </svg>
      {hoveredItem && (
        <div
          className="employ-tooltip"
          style={{ left: `${18 + hoveredItem.idx * 31}%` }}
          role="status"
        >
          <div className="employ-tooltip-title">{hoveredItem.group}</div>
          <div>
            <span className="employ-tooltip-label">
              <i style={{ background: hoveredItem.color }} />
              {hoveredItem.label}
            </span>
            <strong>{hoveredItem.value.toLocaleString('ru-RU')} чел.</strong>
          </div>
        </div>
      )}
      {groups.map((group, idx) => (
        <span key={idx} className="sr-only">
          {group.name}: работают {group.working.toLocaleString('ru-RU')}, не работают {group.notWorking.toLocaleString('ru-RU')}
        </span>
      ))}
    </div>
  );
}
