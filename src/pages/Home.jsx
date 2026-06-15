import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

const CENTERS = [
  { id: 'pension', title: 'Пенсионное обеспечение', image: '/center-icons/01-pension.png' },
  { id: 'social', title: 'Социальная поддержка отдельных категорий граждан', active: true, href: '/dashboard', image: '/center-icons/02-social.png' },
  { id: 'family', title: 'Поддержка семей с детьми', image: '/center-icons/03-family.png' },
  { id: 'payments', title: 'Социальные выплаты и пособия', image: '/center-icons/04-payments.png', imageStyle: { width: '81.88976287841797px', height: '80px', left: '355px', top: '57px' } },
  { id: 'insurance', title: 'Обязательное социальное страхование и страховые выплаты', image: '/center-icons/05-insurance.png' },
  { id: 'profrisk', title: 'Страхование профессиональных рисков', image: '/center-icons/06-profrisk.png' },
  { id: 'personal', title: 'Персонифицированный учет граждан', image: '/center-icons/07-personal.png' },
  { id: 'rehab', title: 'Реабилитация и санаторно-курортное обеспечение', image: '/center-icons/08-rehab.png' },
  { id: 'resettlement', title: 'Социальное обеспечение при переселении и интеграции', image: '/center-icons/09-resettlement.png' },
  { id: 'services', title: 'Предоставление государственных услуг и клиентское обслуживание', image: '/center-icons/10-services.png' },
  { id: 'budget', title: 'Исполнение бюджета', image: '/center-icons/11-budget.png' },
  { id: 'appeals', title: 'Работа с обращениями граждан', image: '/center-icons/12-appeals.png' },
];

const DEFAULT_CENTER_IMAGE_STYLE = {
  width: '85px',
  height: '80px',
  left: '352px',
  top: '57px',
};

const CENTER_ACCENTS = ['#3b82f6', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ef4444'];

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function CenterIcon({ id }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  const shapes = {
    pension: (
      <>
        <circle cx="29" cy="24" r="8" {...common} />
        <circle cx="49" cy="23" r="8" {...common} />
        <path d="M20 62V45c0-9 18-9 18 0v17M40 62V44c0-9 18-9 18 0v18" {...common} />
        <path d="M24 36c4 6 11 6 15 0M44 35c5 6 12 6 17 0" {...common} />
        <circle cx="16" cy="58" r="13" fill="currentColor" opacity=".95" />
        <path d="M11 57h10M11 52h7a5 5 0 0 1 0 10h-7M14 49v18" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    social: (
      <>
        <path d="M34 62V26M23 62V34c0-8 22-8 22 0v28" {...common} />
        <circle cx="34" cy="20" r="7" fill="currentColor" />
        <path d="M12 62V37c0-9 12-9 12 0M56 62V37c0-9-12-9-12 0" {...common} />
        <circle cx="12" cy="28" r="5" {...common} />
        <circle cx="56" cy="28" r="5" {...common} />
      </>
    ),
    family: (
      <>
        <path d="M22 61c-8-6-12-16-10-29 2-13 17-13 20-2 3-11 18-11 20 2 2 13-2 23-10 29" {...common} />
        <circle cx="24" cy="35" r="7" {...common} />
        <circle cx="45" cy="28" r="7" {...common} />
        <circle cx="35" cy="48" r="8" {...common} />
        <path d="M44 43l5-5 5 5" {...common} />
      </>
    ),
    payments: (
      <>
        <rect x="10" y="30" width="46" height="30" rx="4" {...common} />
        <path d="M16 30v-9h38l10 10v29H56" {...common} />
        <circle cx="21" cy="25" r="12" fill="currentColor" />
        <path d="M16 24h10M16 19h7a5 5 0 0 1 0 10h-7M19 16v18" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <rect x="45" y="43" width="20" height="10" rx="5" fill="currentColor" />
      </>
    ),
    insurance: (
      <>
        <path d="M23 16h22M28 10h12M18 16h32v46H18z" {...common} />
        <path d="m25 29 4 4 7-8M25 42l4 4 7-8M25 55l4 4 7-8M41 29h10M41 42h10M41 55h6" {...common} />
        <path d="M52 39 65 35v15c0 8-5 13-13 16-8-3-13-8-13-16V35l13 4Z" fill="currentColor" />
        <path d="m47 50 4 4 8-9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    profrisk: (
      <>
        <path d="M49 13 67 18v13c0 16-9 25-18 31-5-3-10-7-13-13" {...common} />
        <path d="m43 34 6 6 11-13" {...common} />
        <path d="m26 18 6 4-2 8 7 5-4 7 3 8-8 2-4 8-7-4-8 2-2-8-7-4 4-7-3-8 8-2 4-8 7 4 8-2Z" {...common} />
        <path d="M15 41 28 28M28 41 15 28" {...common} />
      </>
    ),
    personal: (
      <>
        <rect x="17" y="8" width="40" height="56" rx="3" {...common} />
        <rect x="23" y="14" width="28" height="44" {...common} />
        <circle cx="37" cy="33" r="8" fill="currentColor" opacity=".9" />
        <path d="M26 50c5-11 17-11 22 0M29 20h16M30 57h14" {...common} />
        <path d="m47 48 14 14M54 48l-7 7" {...common} />
      </>
    ),
    rehab: (
      <>
        <path d="M14 62V36h12v26M26 62V23h18v39M44 62V31h14v31" {...common} />
        <path d="M18 30h4M31 29h8M31 37h8M31 45h8M49 38h4M49 46h4" {...common} />
        <path d="M7 62h58M56 19l3-5M61 24h5M50 24h-5" {...common} />
        <path d="M8 55c0-9 5-13 12-13M8 47c5 0 10 4 10 8" {...common} />
      </>
    ),
    resettlement: (
      <>
        <circle cx="35" cy="36" r="25" {...common} />
        <path d="M10 36h50M35 11c8 8 12 16 12 25S43 53 35 61M35 11c-8 8-12 16-12 25s4 17 12 25" {...common} />
        <path d="M55 45c7 0 12 5 12 12 0 9-12 20-12 20S43 66 43 57c0-7 5-12 12-12Z" fill="currentColor" />
        <circle cx="55" cy="57" r="4" fill="#fff" />
      </>
    ),
    services: (
      <>
        <circle cx="36" cy="26" r="12" {...common} />
        <path d="M16 64c0-15 8-24 20-24s20 9 20 24M24 25v12M48 25v12" {...common} />
        <rect x="4" y="34" width="28" height="17" rx="5" fill="currentColor" />
        <path d="M11 42h2M18 42h2M25 42h2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      </>
    ),
    budget: (
      <>
        <ellipse cx="18" cy="47" rx="14" ry="7" {...common} />
        <path d="M4 47v14c0 4 6 7 14 7s14-3 14-7V47M4 54c0 4 6 7 14 7s14-3 14-7" {...common} />
        <rect x="34" y="16" width="30" height="43" rx="2" {...common} />
        <path d="M39 23h20v9H39zM39 38h8M51 38h8M39 46h8M51 46h8M39 54h8M51 54h8" {...common} />
        <circle cx="35" cy="61" r="13" fill="currentColor" />
        <path d="M30 60h10M30 55h7a5 5 0 0 1 0 10h-7M33 52v18" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
    appeals: (
      <>
        <path d="M21 47c-9-9-12-20-10-28l13-2 5 13-8 5c3 6 8 11 14 14l5-8 13 5-2 13c-8 2-21-1-30-12Z" {...common} />
        <path d="M42 14h20v18H50l-8 8V14Z" {...common} />
        <path d="M52 19c5 0 5 6 0 7v3M52 34h.01" {...common} />
        <rect x="47" y="39" width="28" height="17" rx="5" fill="currentColor" />
        <path d="M54 47h2M61 47h2M68 47h2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      </>
    ),
  };

  return (
    <svg width="78" height="78" viewBox="0 0 78 78" aria-hidden="true" style={{ color: '#3f7bff' }}>
      {shapes[id]}
    </svg>
  );
}

export default function Home() {
  const { theme, setTheme } = useStore();
  const navigate = useNavigate();
  const dark = theme === 'dark';
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.classList.add('home-page-body');
    return () => document.body.classList.remove('home-page-body');
  }, [theme]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    handleFullscreenChange();
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
      return;
    }

    document.documentElement.requestFullscreen?.();
  };

  const page = {
    minHeight: '100vh',
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'relative',
    isolation: 'isolate',
    background: dark
      ? `
        radial-gradient(circle at 8% 10%, rgba(59, 130, 246, 0.24) 0, transparent 28%),
        radial-gradient(circle at 88% 8%, rgba(14, 165, 233, 0.18) 0, transparent 30%),
        radial-gradient(circle at 18% 88%, rgba(34, 197, 148, 0.13) 0, transparent 31%),
        radial-gradient(circle at 92% 82%, rgba(248, 170, 34, 0.1) 0, transparent 27%),
        linear-gradient(145deg, #071021 0%, #0b1430 46%, #081a2b 100%)
      `
      : `
        radial-gradient(circle at 8% 10%, rgba(47, 115, 255, 0.18) 0, transparent 28%),
        radial-gradient(circle at 88% 8%, rgba(14, 165, 233, 0.16) 0, transparent 30%),
        radial-gradient(circle at 18% 88%, rgba(16, 185, 129, 0.13) 0, transparent 30%),
        radial-gradient(circle at 92% 82%, rgba(245, 158, 11, 0.11) 0, transparent 26%),
        linear-gradient(145deg, #f7fbff 0%, #eaf3ff 42%, #edfdf8 100%)
      `,
    fontFamily: 'Manrope, Inter, system-ui, sans-serif',
    color: dark ? '#f7fbff' : '#102033',
  };

  const shell = {
    width: '100%',
    maxWidth: '1440px',
    margin: '0 auto',
    padding: 'clamp(20px, 2.5vw, 36px)',
    position: 'relative',
    zIndex: 1,
  };

  const cardBorderColor = dark ? 'rgba(128, 163, 204, 0.28)' : 'rgba(126, 156, 190, 0.32)';

  const card = {
    height: '145px',
    borderRadius: '16px',
    border: `1px solid ${cardBorderColor}`,
    background: dark
      ? 'linear-gradient(155deg, rgba(17, 29, 54, 0.96), rgba(10, 22, 42, 0.94))'
      : 'linear-gradient(155deg, rgba(255, 255, 255, 0.98), rgba(247, 251, 255, 0.94))',
    boxShadow: dark
      ? '0 18px 44px rgba(2, 8, 23, 0.32), 0 2px 10px rgba(2, 8, 23, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
      : '0 16px 38px rgba(31, 76, 129, 0.1), 0 2px 8px rgba(31, 76, 129, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(14px)',
  };

  const headerButton = {
    width: '43px',
    height: '43px',
    borderRadius: '12px',
    border: dark ? '1px solid rgba(96, 165, 250, 0.28)' : '1px solid rgba(96, 165, 250, 0.32)',
    background: dark ? 'rgba(15, 30, 58, 0.72)' : 'rgba(255, 255, 255, 0.78)',
    color: dark ? '#bfdbfe' : '#2563eb',
    boxShadow: dark
      ? '0 8px 20px rgba(2, 8, 23, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
      : '0 8px 20px rgba(37, 99, 235, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(14px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };

  return (
    <div style={page}>
      <div className="home-bg-layer home-bg-layer-a" />
      <div className="home-bg-layer home-bg-layer-b" />
      <div className="home-bg-layer home-bg-layer-c" />
      <div style={shell}>
        <header style={{
          minHeight: '66px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px, 2.4vw, 34px)', flexWrap: 'wrap' }}>
            <button
              className="home-brand-action"
              onClick={() => navigate('/')}
              title="Минтруд России"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: 0,
                background: 'transparent',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <img
                src="/mintrud-logo-transparent.png"
                alt="Минтруд России"
                style={{ width: '50px', height: '50px', objectFit: 'contain' }}
              />
              <div style={{
                fontSize: '16px',
                fontWeight: 800,
                lineHeight: 1.05,
                color: dark ? '#f7fbff' : '#102033',
                textAlign: 'left',
                whiteSpace: 'nowrap',
              }}>
                Минтруд<br />России
              </div>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '22px', paddingTop: '8px' }}>
            <button
              className="home-header-action"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Выйти из полного экрана' : 'Полный экран'}
              style={{ ...headerButton, fontSize: '18px', lineHeight: 1 }}
            >
              {isFullscreen ? '✕' : '⛶'}
            </button>
            <button
              className="home-header-action"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Переключить тему"
              style={headerButton}
            >
              {dark ? '☾' : <SunIcon />}
            </button>
          </div>
        </header>

        <section style={{
          display: 'block',
          marginBottom: '40px',
        }}>
          <div style={{
            width: '100%',
            minHeight: '190px',
            borderRadius: '16px',
            border: dark ? '1px solid rgba(191, 219, 254, 0.18)' : '1px solid rgba(255, 255, 255, 0.28)',
            background: dark
              ? 'linear-gradient(120deg, rgba(34, 197, 148, 0.12) 0%, transparent 32%), linear-gradient(135deg, #0b275e 0%, #1e3a8a 48%, #075985 100%)'
              : 'linear-gradient(120deg, rgba(16, 185, 129, 0.18) 0%, transparent 32%), linear-gradient(135deg, #174ea6 0%, #2563eb 48%, #0ea5e9 100%)',
            boxShadow: dark
              ? '0 24px 64px rgba(2, 8, 23, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
              : '0 24px 58px rgba(37, 99, 235, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
            overflow: 'hidden',
            position: 'relative',
            padding: 'clamp(22px, 2.4vw, 28px) clamp(20px, 2.8vw, 36px)',
            color: '#fff',
          }}>
            <div style={{ maxWidth: '510px', position: 'relative', zIndex: 2 }}>
              <h1 style={{
                margin: 0,
                fontSize: 'clamp(28px, 2.8vw, 36px)',
                lineHeight: '1.22',
                fontWeight: 500,
                letterSpacing: '-0.7px',
              }}>
                Мониторинговые сервисы<br />Минтруда России
              </h1>
              <p style={{
                margin: '18px 0 0',
                maxWidth: '430px',
                fontSize: '16px',
                lineHeight: '21px',
                color: 'rgba(255, 255, 255, 0.88)',
              }}>
                Единая среда для мониторинга, анализа<br />и управления социальной сферой
              </p>
            </div>
            <div style={{
                position: 'absolute',
              right: 'clamp(18px, 3.2vw, 46px)',
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: 1,
            }}>
              <img
                src="/home/hero.png"
                alt=""
                style={{
                  width: 'min(281.45306396484375px, 34vw)',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </section>

        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '16px',
        }}>
          {CENTERS.map((center, index) => {
            const accent = CENTER_ACCENTS[index % CENTER_ACCENTS.length];
            const accentSoft = dark ? `${accent}2e` : `${accent}26`;
            const accentSofter = dark ? `${accent}16` : `${accent}12`;

            return (
            <button
              key={center.id}
              className="home-center-card"
              onClick={() => center.href && navigate(center.href)}
              disabled={!center.href}
              style={{
                ...card,
                position: 'relative',
                padding: '20px min(120px, 28%) 22px 20px',
                textAlign: 'left',
                cursor: center.href ? 'pointer' : 'default',
                borderColor: center.active
                  ? (dark ? 'rgba(34, 197, 148, 0.46)' : 'rgba(16, 185, 129, 0.46)')
                  : cardBorderColor,
                background: `
                  radial-gradient(circle at 92% 16%, ${accentSoft}, transparent 38%),
                  radial-gradient(circle at 0% 100%, ${accentSofter}, transparent 30%),
                  ${card.background}
                `,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                transition: 'transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease, background 0.24s ease',
              }}
            >
              <span style={{
                maxWidth: '335px',
                color: dark ? '#f7fbff' : '#102033',
                fontFamily: 'Manrope, Inter, system-ui, sans-serif',
                fontSize: '20px',
                lineHeight: '1.25',
                fontWeight: center.active ? 700 : 600,
                letterSpacing: '-0.35px',
              }}>
                {center.title}
              </span>
              <span className="home-center-arrow" style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: dark ? '1px solid rgba(96, 165, 250, 0.28)' : '1px solid rgba(96, 165, 250, 0.32)',
                background: dark ? 'rgba(15, 30, 58, 0.72)' : 'rgba(255, 255, 255, 0.78)',
                color: accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                lineHeight: 1,
                fontWeight: 500,
              }}>
                →
              </span>
              <span className="home-center-icon" style={{
                position: 'absolute',
                right: center.imageStyle ? undefined : '18px',
                bottom: center.imageStyle ? undefined : '8px',
                left: center.imageStyle?.left,
                top: center.imageStyle?.top,
                opacity: 1,
                filter: dark
                  ? 'drop-shadow(0 12px 18px rgba(2, 8, 23, 0.28))'
                  : 'drop-shadow(0 12px 18px rgba(37, 99, 235, 0.12))',
              }}>
                {center.image ? (
                  <img
                    src={center.image}
                    alt=""
                    style={{
                      width: center.imageStyle?.width || DEFAULT_CENTER_IMAGE_STYLE.width,
                      height: center.imageStyle?.height || DEFAULT_CENTER_IMAGE_STYLE.height,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                ) : (
                  <CenterIcon id={center.id} />
                )}
              </span>
            </button>
            );
          })}
        </section>
      </div>
    </div>
  );
}
