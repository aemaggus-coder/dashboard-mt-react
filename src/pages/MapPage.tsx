import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function MapFrame({ src }) {
  const [isFrameLoading, setIsFrameLoading] = useState(true);

  return (
    <div className="map-page-frame-wrap" data-loading={isFrameLoading ? 'true' : 'false'}>
      {isFrameLoading && (
        <div className="map-page-loader" role="status" aria-live="polite">
          <span className="map-page-loader-ring" />
          <span>Загрузка карты</span>
        </div>
      )}
      <iframe
        className="map-page-frame"
        src={src}
        title="Карта РФ и регионы"
        allow="fullscreen"
        loading="eager"
        {...{ fetchPriority: "high" } as React.IframeHTMLAttributes<HTMLIFrameElement>}
        onLoad={() => setIsFrameLoading(false)}
      />
    </div>
  );
}

export default function MapPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const region = params.get('region');
  const fromTab = params.get('from') || 'executive';
  const iframeSrc = region
    ? `/map.html?embedded=1&region=${encodeURIComponent(region)}`
    : '/map.html?embedded=1';

  return (
    <div className="map-page-shell">
      <header className="map-page-topbar">
        <div className="map-page-title">Карта РФ и регионы</div>
        <Link to={`/dashboard?tab=${fromTab}`} className="btn-home map-page-back" title="Вернуться в дашборд">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
      </header>
      <main id="main-content" tabIndex={-1} style={{ display: 'contents' }}>
        <MapFrame key={iframeSrc} src={iframeSrc} />
      </main>
    </div>
  );
}
