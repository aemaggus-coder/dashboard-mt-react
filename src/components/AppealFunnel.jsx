import { useStore } from '../hooks/useStore';
import { useSF } from '../hooks/useSF';
import { BASE } from '../lib/constants';

const fmt = (n) => Math.round(n).toLocaleString('ru-RU');

export default function AppealFunnel() {
  const { period } = useStore();
  const f = useSF();
  const d = BASE.exam[period] || BASE.exam.today;
  const total = (d.primary + d.reexam) * f;
  const main = d.appealMain * f;
  const fed = d.appealFed * f;
  const appealTotal = main + fed;
  const appealPct = total > 0 ? (appealTotal / total) * 100 : 0;
  const mainShare = appealTotal > 0 ? (main / appealTotal) * 100 : 0;
  const fedShare  = appealTotal > 0 ? (fed  / appealTotal) * 100 : 0;
  const isWarn = appealPct > 6;

  return (
    <div className="appeal-panel">
      <div className={`appeal-center ${isWarn ? 'warn' : 'ok'}`}>
        <div className={`appeal-pct ${isWarn ? 'warn' : 'ok'}`}>
          {appealPct.toFixed(1)}%
        </div>
        <div className="appeal-pct-label">от освидетельствованных</div>
        <div className={`appeal-badge ${isWarn ? 'warn' : 'ok'}`}>
          {isWarn ? '⚠ Превышен порог 6%' : '✓ В норме'}
        </div>
      </div>

      <div className="appeal-sep" />

      <div className="appeal-rows">
        <div className="appeal-row appeal-row-main">
          <div className="appeal-row-body">
            <span>Главное бюро МСЭ</span>
            <strong>{fmt(main)}</strong>
          </div>
          <div className="appeal-row-track">
            <div className="appeal-row-fill appeal-row-fill-main" style={{ width: `${mainShare}%` }} />
          </div>
        </div>
        <div className="appeal-row appeal-row-fed">
          <div className="appeal-row-body">
            <span>Федеральное бюро МСЭ</span>
            <strong>{fmt(fed)}</strong>
          </div>
          <div className="appeal-row-track">
            <div className="appeal-row-fill appeal-row-fill-fed" style={{ width: `${fedShare}%` }} />
          </div>
        </div>
        <div className="appeal-row appeal-row-total">
          <div className="appeal-row-body">
            <span>Всего обжалований</span>
            <strong>{fmt(appealTotal)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
