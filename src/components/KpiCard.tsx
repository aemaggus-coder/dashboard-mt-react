import { useState } from 'react';
import { useAnimatedValue } from '../hooks/useAnimatedValue';
import Modal from './Modal';
import KpiDetail from './KpiDetail';
import type { KpiCardProps } from '../types';

export default function KpiCard({ label, value, note, status = 'ok', decimals = 0, suffix = '', trend }: KpiCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const animatedValue = useAnimatedValue(value, 1100);
  const kpi = { label, value, note, status, decimals, suffix, trend };

  const fmt = (n: number): string => {
    if (typeof n !== 'number' || !isFinite(n)) return '—';
    if (decimals > 0) return n.toLocaleString('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    return Math.round(n).toLocaleString('ru-RU');
  };

  return (
    <>
      <div
        className={`kpi kpi-active ${status}`}
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen(true)}
      >
        <div className="kpi-label">{label}</div>
        <div className="kpi-value">{fmt(animatedValue)}{suffix}</div>
        <div className="kpi-note">{note}</div>
        <div style={{ height: '16px' }}>
          {trend && (
            <span className={`kpi-trend ${trend.cls}`}>
              {trend.sign} {Math.abs(trend.delta).toFixed(1)}% {trend.periodLabel ?? 'к пред. периоду'}
            </span>
          )}
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={label}>
        <KpiDetail kpi={kpi} />
      </Modal>
    </>
  );
}
