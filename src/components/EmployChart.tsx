import { useState } from 'react';
import { useScaledData } from '../hooks/useScaledData';
import { useSF } from '../hooks/useSF';
import { useStore } from '../hooks/useStore';
import { BASE, employForSeed } from '../lib/constants';
import storage from '../lib/storage';

const OKVED_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

export default function EmployChart() {
  const [hoveredItem, setHoveredItem] = useState<{ group: string; label: string; value: number; idx: number; color: string } | null>(null);
  const [employMode, setEmployMode] = useState(() => storage.get('employ-mode', 'groups'));
  const sf = useSF();
  const { scope, selectedRegions, selectedFo } = useStore();
  const seed = scope === 'rf' ? '' : `${scope}::${selectedFo ?? ''}::${selectedRegions.join(',')}`;
  const employData = employForSeed(seed);
  const { labels, working, notWorking } = useScaledData(employData, ['working', 'notWorking']);
  const maxTotal = Math.max(...labels.map((_, idx) => working[idx] + notWorking[idx])) || 1;
  const chartHeight = 196;
  const okved = employData.okved.map((item) => ({
    ...item,
    count: Math.round(item.value * 1000 * sf),
  }));

  const groups = labels.map((name, idx) => ({
    name,
    working: working[idx] * 1000,
    notWorking: notWorking[idx] * 1000,
    workingRaw: working[idx],
    notWorkingRaw: notWorking[idx],
  }));

  const selectMode = (mode) => {
    storage.set('employ-mode', mode);
    setEmployMode(mode);
    setHoveredItem(null);
  };

  return (
    <div className="employ-chart">
      <div className="employ-head">
        <div className="card-toggle employ-toggle" role="group" aria-label="Режим занятости">
          <button
            className={`card-toggle-btn ${employMode === 'groups' ? 'active' : ''}`}
            onClick={() => selectMode('groups')}
          >
            Группы
          </button>
          <button
            className={`card-toggle-btn ${employMode === 'okved' ? 'active' : ''}`}
            onClick={() => selectMode('okved')}
          >
            ОКВЭД
          </button>
        </div>
        {employMode === 'groups' && (
          <div className="employ-legend" aria-hidden="true">
            <span><i className="employ-dot employ-dot-work" />Работают</span>
            <span><i className="employ-dot employ-dot-nowork" />Не работают</span>
          </div>
        )}
      </div>

      {employMode === 'groups' ? (
        <>
          <svg className="employ-bars" viewBox="0 0 360 242" role="img" aria-label="Занятость по группам">
            <line className="employ-axis" x1="16" y1="204" x2="344" y2="204" />
            {[126, 234].map((x) => (
              <line key={x} className="employ-tick" x1={x} y1="204" x2={x} y2="208" />
            ))}
            {groups.map((group, idx) => {
              const x = 54 + idx * 108;
              const groupSum = group.workingRaw + group.notWorkingRaw;
              const totalHeight = (groupSum / maxTotal) * chartHeight;
              const workingHeight = groupSum > 0 ? (group.workingRaw / groupSum) * totalHeight : 0;
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
                    tabIndex={0}
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
                    tabIndex={0}
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
            <span key={group.name} className="sr-only">
              {group.name}: работают {group.working.toLocaleString('ru-RU')}, не работают {group.notWorking.toLocaleString('ru-RU')}
            </span>
          ))}
        </>
      ) : (
        <div className="employ-okved" aria-label="Занятость по ОКВЭД">
          {okved.map((item, idx) => (
            <div key={item.name} className="employ-okved-row">
              <span className="employ-okved-name">{item.name}</span>
              <span className="employ-okved-value">{item.count.toLocaleString('ru-RU')} чел.</span>
              <div className="employ-okved-track" aria-hidden="true">
                <span
                  style={{
                    width: `${item.share}%`,
                    background: OKVED_COLORS[idx % OKVED_COLORS.length],
                  }}
                />
              </div>
            </div>
          ))}
          <div className="sr-only">
            Занятость по ОКВЭД: {okved.map((item) => `${item.name} ${item.count.toLocaleString('ru-RU')} человек`).join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}
