import { useState, useRef, useEffect, useMemo } from 'react';
import { useStore } from '../hooks/useStore';
import { REGIONS } from '../lib/constants';

const FO_ABBR = {
  'Центральный ФО': 'ЦФО',
  'Северо-Западный ФО': 'СЗФО',
  'Южный ФО': 'ЮФО',
  'Северо-Кавказский ФО': 'СКФО',
  'Приволжский ФО': 'ПФО',
  'Уральский ФО': 'УФО',
  'Сибирский ФО': 'СФО',
  'Дальневосточный ФО': 'ДВФО',
  'Вне федеральных округов': 'Прочие',
};

function truncate(str, max = 16) {
  return str && str.length > max ? str.slice(0, max) + '…' : str;
}

export default function RegionFilter() {
  const { selectedRegions, setSelectedRegions, scope, setScope, selectedFo, setSelectedFo } = useStore();
  const [foOpen, setFoOpen] = useState(false);
  const [regOpen, setRegOpen] = useState(false);
  const [search, setSearch] = useState('');
  const foRef = useRef<HTMLDivElement>(null);
  const regRef = useRef<HTMLDivElement>(null);

  const selectedRegion = selectedRegions[0] || null;

  const regionList = useMemo(() => {
    if (selectedFo) {
      const group = REGIONS.find(g => g.fo === selectedFo);
      return group ? group.list : [];
    }
    return REGIONS.flatMap(g => g.list);
  }, [selectedFo]);

  const filteredRegions = useMemo(
    () => regionList.filter(r => r.toLowerCase().includes(search.toLowerCase())),
    [search, regionList]
  );

  const handleSelectFo = (fo) => {
    if (selectedFo === fo) {
      setSelectedFo(null);
      setSelectedRegions([]);
      setScope('rf');
    } else {
      setSelectedFo(fo);
      setSelectedRegions([]);
      setScope('fo');
    }
    setFoOpen(false);
  };

  const handleSelectRegion = (region) => {
    if (selectedRegion === region) {
      setSelectedRegions([]);
      setScope(selectedFo ? 'fo' : 'rf');
    } else {
      setSelectedRegions([region]);
      setScope('reg');
    }
    setSearch('');
    setRegOpen(false);
  };

  const handleResetFo = () => {
    setSelectedFo(null);
    setSelectedRegions([]);
    setScope('rf');
    setFoOpen(false);
  };

  const handleResetRegion = () => {
    setSelectedRegions([]);
    setScope(selectedFo ? 'fo' : 'rf');
    setSearch('');
    setRegOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (foRef.current && !foRef.current.contains(e.target)) setFoOpen(false);
      if (regRef.current && !regRef.current.contains(e.target)) setRegOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>

      {/* ФО selector */}
      <div style={{ position: 'relative' }} ref={foRef}>
        <button
          className={`sc-btn ${selectedFo ? 'active' : ''}`}
          onClick={() => { setFoOpen(v => !v); setRegOpen(false); }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 1.5C7 1.5 4.5 4 4.5 7s2.5 5.5 2.5 5.5M7 1.5C7 1.5 9.5 4 9.5 7S7 12.5 7 12.5M1.5 7h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span>{selectedFo ? FO_ABBR[selectedFo] || selectedFo : 'ФО'}</span>
        </button>

        {foOpen && (
          <div className="region-pop open">
            <div className="region-list" style={{ maxHeight: '300px' }}>
              {REGIONS.map(({ fo, color }) => (
                <div
                  key={fo}
                  className={`region-item ${selectedFo === fo ? 'checked' : ''}`}
                  onClick={() => handleSelectFo(fo)}
                >
                  <span className="cbx">
                    {selectedFo === fo && (
                      <svg width="9" height="9" viewBox="0 0 11 11">
                        <path d="M1 5.5L4 8.5L10 2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
                  {fo}
                </div>
              ))}
            </div>
            {selectedFo && (
              <div className="region-actions" style={{ gridTemplateColumns: '1fr' }}>
                <button className="region-reset" onClick={handleResetFo}>Сбросить</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Region selector */}
      <div style={{ position: 'relative' }} ref={regRef}>
        <button
          className={`sc-btn ${selectedRegion ? 'active' : ''}`}
          onClick={() => { setRegOpen(v => !v); setFoOpen(false); }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
            <path d="M5.5 12S1 8 1 5a4.5 4.5 0 0 1 9 0c0 3-4.5 7-4.5 7z" stroke="currentColor" strokeWidth="1.4"/>
            <circle cx="5.5" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          <span>{selectedRegion ? truncate(selectedRegion) : 'Регион'}</span>
        </button>

        {regOpen && (
          <div className="region-pop open">
            <input
              className="region-search"
              placeholder="Поиск региона…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoComplete="off"
              autoFocus
            />
            <div className="region-list">
              {filteredRegions.map(region => (
                <div
                  key={region}
                  className={`region-item ${selectedRegion === region ? 'checked' : ''}`}
                  onClick={() => handleSelectRegion(region)}
                >
                  <span className="cbx">
                    {selectedRegion === region && (
                      <svg width="9" height="9" viewBox="0 0 11 11">
                        <path d="M1 5.5L4 8.5L10 2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  {region}
                </div>
              ))}
            </div>
            {selectedRegion && (
              <div className="region-actions" style={{ gridTemplateColumns: '1fr' }}>
                <button className="region-reset" onClick={handleResetRegion}>Сбросить</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
