import { Link } from 'react-router-dom';

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-center">
        <div className="topbar-title">Центр мониторинга социальной поддержки отдельных категорий граждан</div>
      </div>
      <Link to="/" className="btn-home" style={{ marginLeft: 'auto' }} title="Вернуться на главную">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </Link>
    </header>
  );
}
