import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      fontFamily: 'var(--font-ui)',
      color: 'var(--text, #f7fbff)',
      background: 'var(--bg, #0b1430)',
      textAlign: 'center',
      padding: '24px',
    }}>
      <div style={{ fontSize: '72px', fontWeight: 800, opacity: 0.15, lineHeight: 1 }}>404</div>
      <div style={{ fontSize: '20px', fontWeight: 600 }}>Страница не найдена</div>
      <div style={{ fontSize: '14px', opacity: 0.6 }}>Запрошенный адрес не существует</div>
      <Link to="/" style={{
        marginTop: '8px',
        padding: '10px 24px',
        borderRadius: '8px',
        background: '#2563eb',
        color: '#fff',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 600,
      }}>
        На главную
      </Link>
    </div>
  );
}
