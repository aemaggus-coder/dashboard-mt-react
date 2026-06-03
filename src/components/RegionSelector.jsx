import { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { REGIONS, ALL_REGIONS } from '../lib/constants';

export default function RegionSelector() {
  const { selectedRegions, setSelectedRegions, scope, setScope } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [regionDraft, setRegionDraft] = useState(new Set(selectedRegions));

  const handleScopeChange = (newScope) => {
    setScope(newScope);
    if (newScope === 'rf') {
      setSelectedRegions([]);
      setRegionDraft(new Set());
      setIsOpen(false);
    } else if (newScope === 'fo') {
      setSelectedRegions([]);
      setRegionDraft(new Set());
      setIsOpen(false);
    }
  };

  const toggleRegion = (region) => {
    const newDraft = new Set(regionDraft);
    if (newDraft.has(region)) {
      newDraft.delete(region);
    } else {
      newDraft.add(region);
    }
    setRegionDraft(newDraft);
  };

  const toggleAllRegions = () => {
    if (regionDraft.size === ALL_REGIONS.length) {
      setRegionDraft(new Set());
    } else {
      setRegionDraft(new Set(ALL_REGIONS));
    }
  };

  const handleApply = () => {
    const newRegions = Array.from(regionDraft);
    setSelectedRegions(newRegions);
    if (newRegions.length === 0) {
      setScope('rf');
    } else {
      setScope('reg');
    }
    setIsOpen(false);
  };

  const getScopeName = () => {
    if (scope === 'rf') return 'Российская Федерация';
    if (scope === 'fo') return 'Федеральные округа';
    if (selectedRegions.length === 0) return 'Российская Федерация';
    if (selectedRegions.length === 1) return selectedRegions[0];
    return `${selectedRegions.length} регион${selectedRegions.length < 5 ? 'а' : 'ов'}`;
  };

  const filteredRegions = search
    ? ALL_REGIONS.filter(r => r.toLowerCase().includes(search.toLowerCase()))
    : ALL_REGIONS;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(59,130,246,.3)',
          background: 'rgba(59,130,246,.12)',
          color: '#60a5fa',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.25s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          e.target.style.background = 'rgba(59,130,246,.2)';
          e.target.style.borderColor = '#60a5fa';
        }}
        onMouseLeave={e => {
          e.target.style.background = 'rgba(59,130,246,.12)';
          e.target.style.borderColor = 'rgba(59,130,246,.3)';
        }}
      >
        📍 {getScopeName()}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ margin: '0 0 12px 0', color: 'var(--text)' }}>Выбор уровня анализа</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {[
                  { id: 'rf', label: 'Вся РФ' },
                  { id: 'fo', label: 'Федеральные округа' },
                  { id: 'reg', label: 'Регионы' },
                ].map(btn => (
                  <button
                    key={btn.id}
                    onClick={() => handleScopeChange(btn.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      background: scope === btn.id ? '#3b82f6' : 'rgba(59,130,246,.1)',
                      color: scope === btn.id ? '#fff' : '#60a5fa',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {scope === 'reg' && (
                <input
                  type="text"
                  placeholder="Поиск регионов..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    fontSize: '13px',
                  }}
                />
              )}
            </div>

            {scope === 'fo' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {REGIONS.map(fo => (
                    <div
                      key={fo.fo}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid ' + fo.color,
                        background: 'rgba(255,255,255,.03)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,.08)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255,255,255,.03)';
                      }}
                    >
                      <div style={{ color: fo.color, fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                        {fo.fo}
                      </div>
                      <div style={{ color: 'var(--text-2)', fontSize: '11px' }}>
                        {fo.list.length} регион{fo.list.length % 10 === 1 ? '' : fo.list.length % 10 < 5 ? 'а' : 'ов'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scope === 'reg' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={regionDraft.size === ALL_REGIONS.length}
                      onChange={toggleAllRegions}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ color: 'var(--text)', fontSize: '13px', fontWeight: '600' }}>
                      Все регионы ({regionDraft.size} выбрано)
                    </span>
                  </label>
                </div>

                {REGIONS.map(fo => (
                  <div key={fo.fo} style={{ marginBottom: '16px' }}>
                    <div style={{ color: fo.color, fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
                      {fo.fo}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {(search ? filteredRegions : fo.list).map(region => (
                        <label
                          key={region}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            color: 'var(--text)',
                            fontSize: '12px',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={regionDraft.has(region)}
                            onChange={() => toggleRegion(region)}
                            style={{ cursor: 'pointer' }}
                          />
                          {region}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                padding: '16px 20px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Отмена
              </button>
              {scope === 'reg' && (
                <button
                  onClick={handleApply}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#3b82f6',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Применить
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
