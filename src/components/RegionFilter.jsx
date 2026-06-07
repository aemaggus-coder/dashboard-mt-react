import { useState, useRef, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { ALL_REGIONS } from '../lib/constants';

export default function RegionFilter() {
  const { selectedRegions, setSelectedRegions, scope, setScope } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const regions = ALL_REGIONS;
  const filtered = regions.filter(r => r.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (region) => {
    setSelectedRegions(
      selectedRegions.includes(region)
        ? selectedRegions.filter(r => r !== region)
        : [...selectedRegions, region]
    );
    setScope('reg');
  };

  const handleSelectAll = () => {
    if (selectedRegions.length === regions.length) {
      setSelectedRegions([]);
      setScope('rf');
    } else {
      setSelectedRegions(regions);
      setScope('reg');
    }
  };

  const handleReset = () => {
    setSelectedRegions([]);
    setScope('rf');
    setSearch('');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          className={`sc-btn ${scope === 'reg' ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 1.5C7 1.5 4.5 4 4.5 7s2.5 5.5 2.5 5.5M7 1.5C7 1.5 9.5 4 9.5 7S7 12.5 7 12.5M1.5 7h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span>{selectedRegions.length === 0 ? 'Регионы' : `${selectedRegions.length}`}</span>
        </button>

        {isOpen && (
          <div className="region-pop open">
            <input className="region-search" placeholder="Поиск региона…" value={search} onChange={(e) => setSearch(e.target.value)} autoComplete="off"/>
            <div className="region-allrow">
              <label className="region-item" style={{ padding: '4px 6px' }}>
                <span className="cbx">
                  <input type="checkbox" checked={selectedRegions.length === regions.length} onChange={handleSelectAll} style={{ display: 'none' }}/>
                  {selectedRegions.length === regions.length && <svg width="9" height="9" viewBox="0 0 11 11"><path d="M1 5.5L4 8.5L10 2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </span>
                Выбрать все
              </label>
              <span className="region-count">выбрано: <b>{selectedRegions.length}</b></span>
            </div>
            <div className="region-list">
              {filtered.map((region, idx) => (
                <label key={idx} className={`region-item ${selectedRegions.includes(region) ? 'checked' : ''}`}>
                  <span className="cbx">
                    <input type="checkbox" checked={selectedRegions.includes(region)} onChange={() => handleSelect(region)} style={{ display: 'none' }}/>
                    {selectedRegions.includes(region) && <svg width="9" height="9" viewBox="0 0 11 11"><path d="M1 5.5L4 8.5L10 2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </span>
                  {region}
                </label>
              ))}
            </div>
            <div className="region-actions">
              <button className="region-reset" onClick={handleReset} disabled={selectedRegions.length === 0}>
                Сбросить
              </button>
              <button className="region-apply" onClick={() => { setIsOpen(false); if (selectedRegions.length > 0) setScope('reg'); }}>
                Применить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
