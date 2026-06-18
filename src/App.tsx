import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
import { useStore } from './hooks/useStore';
import type { Scope } from './types';
import './App.css';

const Home           = lazy(() => import('./pages/Home'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const MapPage        = lazy(() => import('./pages/MapPage'));
const NotFound       = lazy(() => import('./pages/NotFound'));

const BASE_TITLE = 'Центр мониторинга Минтруда России';

const TAB_TITLES: Record<string, string> = {
  executive:  'Главная',
  population: 'Общие сведения',
  exam:       'Освидетельствование',
  tsr:        'Обеспечение ТСР',
};

const META_DESCRIPTIONS: Record<string, string> = {
  '/':          'Единая среда для мониторинга, анализа и управления социальной сферой Минтруда России.',
  '/dashboard': 'Оперативные данные по освидетельствованию МСЭ и обеспечению ТСР.',
  '/map':       'Интерактивная карта регионов Российской Федерации.',
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function StorageSync() {
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'mintrud-regions') {
        try { useStore.setState({ selectedRegions: JSON.parse(e.newValue || '[]') as string[] }); } catch { /* ignore */ }
      }
      if (e.key === 'mintrud-scope') {
        const scope = (e.newValue || 'rf') as Scope;
        const fo = scope === 'fo' ? (localStorage.getItem('mintrud-fo') ?? null) : useStore.getState().selectedFo;
        useStore.setState({ scope, selectedFo: fo });
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);
  return null;
}

function TitleSync() {
  const location    = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const path = location.pathname;
    let title: string;
    let description = META_DESCRIPTIONS[path] ?? META_DESCRIPTIONS['/dashboard'];

    if (path === '/') {
      title = 'Минтруд России — Мониторинговые сервисы';
    } else if (path === '/dashboard') {
      const tab   = searchParams.get('tab') || 'executive';
      const label = TAB_TITLES[tab] ?? 'Дашборд';
      title = `${label} | ${BASE_TITLE}`;
    } else if (path === '/map') {
      title = `Карта РФ | ${BASE_TITLE}`;
    } else {
      title = `404 | ${BASE_TITLE}`;
      description = 'Страница не найдена.';
    }

    document.title = title;

    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;
  }, [location.pathname, searchParams]);

  return null;
}

function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg, #0b1430)' }}>
      <div style={{ width: 32, height: 32, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );
}

function App() {
  const { theme } = useStore();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <Router>
      <StorageSync />
      <TitleSync />
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/dashboard" element={<DashboardLayout />} />
          <Route path="/map"       element={<MapPage />} />
          <Route path="*"          element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
