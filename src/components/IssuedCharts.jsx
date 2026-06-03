import { useStore } from '../hooks/useStore';
import { useScaledData } from '../hooks/useScaledData';
import { BASE } from '../lib/constants';

export default function IssuedCharts() {
  const { period } = useStore();
  const data = useScaledData(BASE.tsr[period], ['issuedNat', 'issuedCert']);

  const items = [
    { title: 'Национальные', value: data.issuedNat, color: '#3b82f6' },
    { title: 'Сертифицированные', value: data.issuedCert, color: '#a78bfa' },
  ];

  return (
    <div className="issued-charts">
      <div className="issued-donuts">
        {items.map((item, idx) => (
          <div key={idx} className="issued-col">
            <div className="issued-col-title">{item.title}</div>
            <div className="issued-chart-lbl">
              <span className="icl-big">{item.value.toLocaleString('ru-RU')}</span>
              <span className="icl-lbl">шт.</span>
            </div>
            <div className="issued-leg">
              <div className="issued-leg-row">
                <div className="issued-leg-dot" style={{ background: item.color }}></div>
                <div className="issued-leg-name">{item.title}</div>
                <div className="issued-leg-pct">{item.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
