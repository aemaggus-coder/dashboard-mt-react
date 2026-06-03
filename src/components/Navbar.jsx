import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import RegionFilter from './RegionFilter';

export default function Navbar() {
  const { activeTab, setActiveTab } = useStore();

  const tabs = [
    { id: 'population', label: 'Численность инвалидов' },
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
      <Link to="/map" className="map-btn" title="Карта РФ и регионы">
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
