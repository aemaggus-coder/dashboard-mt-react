import { useStore } from '../hooks/useStore';
import { BASE } from '../lib/constants';

export default function TermsStats() {
  const { period } = useStore();
  const data = BASE.exam[period];
  const terms = data.terms;

  const status = terms < 20 ? 'fast' : terms < 30 ? 'ok' : 'slow';
  const statusLabel = status === 'fast' ? 'Быстро' : status === 'ok' ? 'В норме' : 'Задержка';
  const statusColor = status === 'fast' ? '#10b981' : status === 'ok' ? '#f59e0b' : '#ef4444';

  return (
    <div className="terms-body">
      <div className="terms-hero">
        <div className="terms-hero-num">{terms.toFixed(1)}</div>
        <div className="terms-hero-unit">дней</div>
        <div className="terms-badge" style={{ background: statusColor, color: '#fff' }}>
          {statusLabel}
        </div>
      </div>
      <div className="terms-bars">
        <div className="terms-bar-row">
          <div className="terms-bar-label">Быстро (&lt; 20 дн)</div>
          <div className="terms-bar-track">
            <div className="terms-bar-fill" style={{ width: '35%', background: '#10b981' }}></div>
          </div>
          <div className="terms-bar-num">35%</div>
        </div>
        <div className="terms-bar-row">
          <div className="terms-bar-label">Норма (20–30 дн)</div>
          <div className="terms-bar-track">
            <div className="terms-bar-fill" style={{ width: '55%', background: '#f59e0b' }}></div>
          </div>
          <div className="terms-bar-num">55%</div>
        </div>
        <div className="terms-bar-row">
          <div className="terms-bar-label">Задержка (&gt; 30 дн)</div>
          <div className="terms-bar-track">
            <div className="terms-bar-fill" style={{ width: '10%', background: '#ef4444' }}></div>
          </div>
          <div className="terms-bar-num">10%</div>
        </div>
      </div>
    </div>
  );
}
