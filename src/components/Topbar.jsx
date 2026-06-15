import { Link } from 'react-router-dom';

export default function Topbar() {
  return (
    <header className="topbar">
      <Link to="/" className="brand" title="Вернуться на главную">
        <img src="/mintrud-logo-transparent.png" alt="Минтруд России" className="brand-logo" />
        <div className="brand-text">Минтруд<br />России</div>
      </Link>
      <div className="divider" />
      <div className="topbar-center">
        <div className="topbar-title">Центр мониторинга социальной поддержки отдельных категорий граждан</div>
      </div>
    </header>
  );
}
