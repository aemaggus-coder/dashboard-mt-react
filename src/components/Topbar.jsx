import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { useSF } from '../hooks/useSF';

export default function Topbar() {
  const { theme, setTheme } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const sf = useSF();
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <header className="topbar">
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#fff',
          padding: '0 12px 0 0',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => e.target.style.opacity = '0.8'}
        onMouseLeave={(e) => e.target.style.opacity = '1'}
        title="Вернуться на главную"
      >
        <svg width="32" height="36" viewBox="0 0 100 120" fill="white" style={{ flexShrink: 0 }}>
          <path d="M50 10C28 10 10 28 10 50C10 65 18 78 30 85L25 95C22 100 28 105 32 102L45 92C47 92 49 92 50 92C72 92 90 74 90 52C90 30 72 10 50 10M50 25C65 25 75 35 75 50C75 65 65 75 50 75C35 75 25 65 25 50C25 35 35 25 50 25M45 50L55 40L55 60Z" />
        </svg>
        <div style={{ fontSize: '10px', fontWeight: '700', color: '#fff', lineHeight: '1.2' }}>
          Минтруд<br />России
        </div>
      </button>
      <div className="topbar-center">
        <div className="topbar-title">Центр Мониторинга Минтруда</div>
      </div>
      <div className="topbar-controls">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#fff' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }}></span>
          обновление: {time}
        </div>
        {location.pathname === '/dashboard' && (
          <div style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(59,130,246,.15)', fontSize: '11px', color: '#60a5fa', fontFamily: 'var(--mono)' }}>
            sf={sf.toFixed(3)}
          </div>
        )}
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }`}</style>
        <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '13px', color: 'rgba(255,255,255,.7)' }}>
          {time}
        </div>
        <Link to="/" style={{
          padding: '7px 16px 7px 12px',
          borderRadius: '9px',
          border: '1.5px solid rgba(255,255,255,.18)',
          background: 'rgba(255,255,255,.1)',
          color: '#ffffff',
          textDecoration: 'none',
          fontSize: '11px',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'background 0.18s, border-color 0.18s',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
        }}>
          ← Главная
        </Link>
        <button
          className={`theme-sw ${theme === 'light' ? 'on' : ''}`}
          onClick={toggleTheme}
          title="Переключить тему"
        >
          <div className="theme-knob">{theme === 'light' ? '☀️' : '🌙'}</div>
        </button>
      </div>
    </header>
  );
}
