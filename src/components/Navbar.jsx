import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import RegionFilter from './RegionFilter';

function prefetchMapAssets() {
  if (typeof document === 'undefined') return;
  [
    { href: '/map.html?embedded=1', as: 'document' },
    { href: '/assets/js/data.js', as: 'script' },
  ].forEach(({ href, as }) => {
    if (document.querySelector(`link[data-map-prefetch="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    link.as = as;
    link.dataset.mapPrefetch = href;
    document.head.appendChild(link);
  });
}

export default function Navbar() {
  const { activeTab, setActiveTab } = useStore();

  useEffect(() => {
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(prefetchMapAssets, { timeout: 2000 })
      : window.setTimeout(prefetchMapAssets, 500);
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  const tabs = [
    { id: 'executive', label: 'Главная' },
    { id: 'population', label: 'Общие сведения' },
    { id: 'exam', label: 'Освидетельствование' },
    { id: 'tsr', label: 'Обеспечение ТСР' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            data-tab={tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <Link
        to="/map"
        className="map-btn"
        title="Карта РФ и регионы"
        onPointerEnter={prefetchMapAssets}
        onFocus={prefetchMapAssets}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </Link>
      <div className="nav-scope">
        <RegionFilter />
      </div>
    </nav>
  );
}
