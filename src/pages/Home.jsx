import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

const CENTERS = [
  { id: 'pension', title: 'Центр мониторинга пенсионного обеспечения' },
  { id: 'social', title: 'Центр мониторинга социальной поддержки отдельных категорий граждан', active: true, href: '/dashboard' },
  { id: 'family', title: 'Центр мониторинга поддержки семей с детьми' },
  { id: 'payments', title: 'Центр мониторинга социальных выплат и пособий' },
  { id: 'insurance', title: 'Центр мониторинга обязательного социального страхования и страховых выплат' },
  { id: 'profrisk', title: 'Центр мониторинга страхования профессиональных рисков' },
  { id: 'personal', title: 'Центр мониторинга персонифицированного учета граждан' },
  { id: 'rehab', title: 'Центр мониторинга реабилитации и санаторно-курортного обеспечения' },
  { id: 'resettlement', title: 'Центр мониторинга социального обеспечения при переселении и интеграции' },
  { id: 'services', title: 'Центр мониторинга предоставления государственных услуг и клиентского обслуживания' },
  { id: 'budget', title: 'Центр мониторинга исполнения бюджета' },
  { id: 'appeals', title: 'Центр мониторинга работы с обращениями граждан' },
];

export default function Home() {
  const { theme, setTheme } = useStore();
  const navigate = useNavigate();
  const [time, setTime] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      background: `linear-gradient(0deg, #FFFFFF, #FFFFFF),
                   linear-gradient(149.79deg, #F4F6FA 0%, #E7EBF2 100%),
                   radial-gradient(55.56% 66.67% at -5% 110%, rgba(63, 123, 255, 0.08) 0%, rgba(63, 123, 255, 0) 55%),
                   radial-gradient(62.5% 55.56% at 80% -10%, rgba(63, 123, 255, 0.1) 0%, rgba(63, 123, 255, 0) 60%)`,
      fontFamily: 'Manrope, Inter, sans-serif',
      position: 'relative'
    }}>
      {/* Компоненты */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
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
          }}
          title="Минтруд России"
        >
          <svg width="32" height="36" viewBox="0 0 100 120" fill="white" style={{ flexShrink: 0 }}>
            <path d="M50 10C28 10 10 28 10 50C10 65 18 78 30 85L25 95C22 100 28 105 32 102L45 92C47 92 49 92 50 92C72 92 90 74 90 52C90 30 72 10 50 10M50 25C65 25 75 35 75 50C75 65 65 75 50 75C35 75 25 65 25 50C25 35 35 25 50 25M45 50L55 40L55 60Z" />
          </svg>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#fff', lineHeight: '1.2' }}>
            Минтруд<br />России
          </div>
        </button>
        <div className="topbar-center">
          <div style={{
            fontSize: '30px',
            fontWeight: '800',
            letterSpacing: '-0.4px',
            color: '#fff',
            fontFamily: 'Manrope, sans-serif'
          }}>Центр Мониторинга Минтруда</div>
        </div>
        <div className="topbar-controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#fff' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }}></span>
            обновление: {time}
          </div>
          <style>{`@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }`}</style>
          <button
            className={`theme-sw ${theme === 'light' ? 'on' : ''}`}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Переключить тему"
          >
            <div className="theme-knob">{theme === 'light' ? '☀️' : '🌙'}</div>
          </button>
        </div>
      </header>

      <main style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ width: '100%', padding: '0 36px' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
            {/* HERO + INFO CARDS ROW */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '907px 1fr',
              gap: '12px',
              marginTop: '130px',
              marginBottom: '20px',
              alignItems: 'start'
            }}>
              {/* HERO BLOCK */}
              <div style={{
                width: '907px',
                height: '190px',
                background: '#3F7BFF',
                border: '1px solid #3F7BFF',
                borderRadius: '16px',
                padding: '32px 36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  letterSpacing: '-0.8px',
                  color: '#fff',
                  marginBottom: '8px',
                  fontFamily: 'Manrope, sans-serif'
                }}>
                  Мониторинговые сервисы Минтруда России
                </h1>
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,.75)',
                  lineHeight: '1.5',
                  maxWidth: '400px',
                  fontFamily: 'Manrope, sans-serif'
                }}>
                  Единая среда для мониторинга, анализа и управления социальной сферой
                </p>
              </div>

              {/* INFO CARDS COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Info Card 1 */}
                <div style={{
                  width: '445px',
                  height: '145px',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid #E3E7EF',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.74) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏱️</div>
                  <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4', fontFamily: 'Manrope, sans-serif' }}>
                    <strong>Данные онлайн.</strong><br />Обновление каждые 5 секунд
                  </div>
                </div>

                {/* Info Card 2 */}
                <div style={{
                  width: '445px',
                  height: '145px',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid #E3E7EF',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.74) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
                  <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4', fontFamily: 'Manrope, sans-serif' }}>
                    <strong>Провал</strong><br />по клику на любой блок
                  </div>
                </div>
              </div>
            </div>

            {/* CENTERS GRID */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 445px)',
              gap: '12px',
              justifyContent: 'start',
              marginBottom: '40px'
            }}>
              {CENTERS.map((center, idx) => (
                <Link
                  key={idx}
                  to={center.href || '#'}
                  style={{ textDecoration: 'none' }}
                  onClick={(e) => !center.href && e.preventDefault()}
                >
                  <div style={{
                    width: '445px',
                    height: '145px',
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid #E3E7EF',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.74) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: center.active ? '0 0 0 1.5px #3F7BFF' : 'none',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = center.active ? '0 0 0 1.5px #3F7BFF' : 'none';
                  }}
                  >
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#0f172a',
                      lineHeight: '1.4',
                      fontFamily: 'Manrope, sans-serif'
                    }}>
                      {center.title}
                    </div>
                    <button
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#3F7BFF',
                        color: '#fff',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        alignSelf: 'flex-start'
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        center.href && navigate(center.href);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#2563eb';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#3F7BFF';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      →
                    </button>
                  </div>
                </Link>
              ))}
            </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
