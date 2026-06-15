import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';
import Donut from './Donut';

const FORM_COLORS = ['#2563eb', '#06b6d4'];
const STATUS_COLORS = ['#2563eb', '#f59e0b', '#10b981'];
const FORM_NAMES = ['Натуральное', 'Эл. сертификат'];
const STATUS_NAMES = ['Выдано', 'На рассм.', 'Исполнено'];

export default function IssuedCharts() {
  const { period } = useStore();
  const d = useScaledData(BASE.tsr[period] || BASE.tsr.today, ['issuedNat', 'issuedCert']);
  const status = (BASE.tsr[period] || BASE.tsr.today).status;

  const nat = d.issuedNat;
  const cert = d.issuedCert;
  const tot = (nat + cert) || 1;
  const natPct = Math.round((nat / tot) * 100);
  const certPct = 100 - natPct;

  return (
    <div className="issued-charts">
      <div className="issued-donuts">
        <div className="issued-col">
          <div className="issued-col-title">Форма выдачи</div>
          <Donut
            values={[natPct, certPct]}
            colors={FORM_COLORS}
            labels={FORM_NAMES}
            formatValue={(v) => `${v}%`}
          >
            <span className="donut-center-big" style={{ color: FORM_COLORS[0] }}>{natPct}%</span>
            <span className="donut-center-sub">натуральная</span>
          </Donut>
        </div>
        <div className="issued-col">
          <div className="issued-col-title">Статус заявок</div>
          <Donut
            values={status}
            colors={STATUS_COLORS}
            labels={STATUS_NAMES}
            formatValue={(v) => `${v}%`}
          >
            <span className="donut-center-big" style={{ color: STATUS_COLORS[2] }}>{status[2]}%</span>
            <span className="donut-center-sub">исполнено</span>
          </Donut>
        </div>
      </div>
      <div className="issued-leg">
        {status.map((v, i) => (
          <div key={i} className="issued-leg-row" style={{ borderLeft: `3px solid ${STATUS_COLORS[i]}` }}>
            <span className="issued-leg-name">{STATUS_NAMES[i]}</span>
            <span className="issued-leg-pct">{v}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
