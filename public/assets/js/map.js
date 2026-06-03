// Map visualization with D3.js

class RussiaMap {
  constructor() {
    this.mode = 'risk';
    this.mapSvg = null;
    this.mapProjection = null;
    this.mapPath = null;
    this.mapG = null;
    this.tooltip = document.getElementById('tooltip');
    this.initEventListeners();
    this.init();
  }

  initEventListeners() {
    document.querySelectorAll('.btn-map').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.target.dataset.mode;
        this.setMode(mode);
        document.querySelectorAll('.btn-map').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    document.addEventListener('mousemove', (e) => {
      if (this.tooltip.style.display !== 'none') {
        this.tooltip.style.left = (e.clientX + 16) + 'px';
        this.tooltip.style.top = (e.clientY + 8) + 'px';
      }
    });
  }

  init() {
    if (!window.topojson || !RUSSIA_TOPO) {
      setTimeout(() => this.init(), 100);
      return;
    }
    this.renderMap();
  }

  renderMap() {
    const svgEl = document.getElementById('russiaMap');
    const container = svgEl.parentElement;

    const W = Math.max(container.clientWidth - 40, 600);
    const H = Math.max(container.clientHeight || 500, 450);

    svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svgEl.setAttribute('width', W);
    svgEl.setAttribute('height', H);

    this.mapSvg = d3.select('#russiaMap');
    this.mapSvg.selectAll('*').remove();

    const geojson = topojson.feature(RUSSIA_TOPO, RUSSIA_TOPO.objects.default);

    this.mapProjection = d3.geoConicEqualArea()
      .rotate([-105, 0])
      .center([0, 65])
      .parallels([50, 75])
      .fitSize([W, H], geojson);

    this.mapPath = d3.geoPath().projection(this.mapProjection);
    this.mapG = this.mapSvg.append('g');

    this.mapG.selectAll('path')
      .data(geojson.features)
      .enter()
      .append('path')
      .attr('d', this.mapPath)
      .attr('fill', d => this.getRegionColor(d))
      .on('mousemove', (event, d) => this.showTooltip(event, d))
      .on('mouseleave', () => this.hideTooltip())
      .on('click', (event, d) => this.handleRegionClick(d));

    this.renderLegend();
  }

  getColorScale(mode) {
    const colorScales = {
      risk: {
        domain: [40, 60, 75],
        range: ['rgba(34, 197, 94, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(251, 146, 60, 0.7)', 'rgba(239, 68, 68, 0.85)'],
        getValue: d => d.properties.score || 50
      },
      tsr: {
        domain: [72, 80, 87],
        range: ['rgba(239, 68, 68, 0.85)', 'rgba(251, 146, 60, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(34, 197, 94, 0.7)'],
        getValue: d => d.properties.tsr || 82
      },
      budget: {
        domain: [60, 72, 82],
        range: ['rgba(239, 68, 68, 0.85)', 'rgba(251, 146, 60, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(34, 197, 94, 0.7)'],
        getValue: d => d.properties.budget || 75
      },
      overdue: {
        domain: [5, 3, 1.5],
        range: ['rgba(239, 68, 68, 0.85)', 'rgba(251, 146, 60, 0.7)', 'rgba(59, 130, 246, 0.7)', 'rgba(34, 197, 94, 0.7)'],
        getValue: d => d.properties.overdue || 2
      }
    };
    return colorScales[mode] || colorScales.risk;
  }

  getRegionColor(d) {
    const scale = this.getColorScale(this.mode);
    const scale_fn = d3.scaleThreshold()
      .domain(scale.domain)
      .range(scale.range);
    return scale_fn(scale.getValue(d));
  }

  showTooltip(event, d) {
    const p = d.properties;
    const name = p.ru_name || p.name || '—';

    this.tooltip.innerHTML = `
      <div class="tooltip-title">${name}</div>
      <div class="tooltip-row">
        <span class="tooltip-label">📊 Индекс риска:</span>
        <span class="tooltip-value">${p.score || '—'}</span>
      </div>
      <div class="tooltip-row">
        <span class="tooltip-label">🦽 Обеспечение ТСР:</span>
        <span class="tooltip-value">${p.tsr ? p.tsr.toFixed(1) + '%' : '—'}</span>
      </div>
      <div class="tooltip-row">
        <span class="tooltip-label">💰 Освоение бюджета:</span>
        <span class="tooltip-value">${p.budget ? p.budget + '%' : '—'}</span>
      </div>
      <div class="tooltip-row">
        <span class="tooltip-label">⏰ Просрочено:</span>
        <span class="tooltip-value">${p.overdue ? p.overdue.toFixed(1) + '%' : '—'}</span>
      </div>
    `;
    this.tooltip.style.display = 'block';
  }

  hideTooltip() {
    this.tooltip.style.display = 'none';
  }

  handleRegionClick(d) {
    const p = d.properties;
    const name = p.ru_name || p.name || '—';

    // Ищем регион в справочнике REGIONS из data.js
    const regionData = REGIONS.find(fo =>
      fo.list.some(region =>
        region.toLowerCase() === name.toLowerCase() ||
        region.includes(name)
      )
    );

    // Формируем детальный вывод с данными из файла
    let details = `<strong>${name}</strong><br>`;
    details += `<small>Федеральный округ: ${regionData ? regionData.fo : 'N/A'}</small><br><br>`;
    details += `<strong>Показатели:</strong><br>`;
    details += `📊 Индекс риска: ${p.score || '—'}<br>`;
    details += `🦽 Обеспечение ТСР: ${p.tsr ? p.tsr.toFixed(1) : '—'}%<br>`;
    details += `💰 Освоение бюджета: ${p.budget || '—'}%<br>`;
    details += `⏰ Просрочено: ${p.overdue ? p.overdue.toFixed(1) : '—'}%`;

    // Отображаем в panel вместо alert
    this.showRegionPanel(name, details);
  }

  showRegionPanel(name, details) {
    // Удаляем старую panel если есть
    const existing = document.getElementById('regionPanel');
    if (existing) existing.remove();

    // Создаем новую panel
    const panel = document.createElement('div');
    panel.id = 'regionPanel';
    panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      padding: 20px;
      min-width: 320px;
      z-index: 1000;
      font-family: Arial, sans-serif;
      color: #333;
      max-height: 80vh;
      overflow-y: auto;
    `;

    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0; font-size: 18px;">${name}</h3>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
          padding: 0;
        ">×</button>
      </div>
      <div>${details}</div>
    `;

    document.body.appendChild(panel);
  }

  setMode(mode) {
    this.mode = mode;
    if (this.mapG) {
      this.mapG.selectAll('path')
        .transition()
        .duration(300)
        .attr('fill', d => this.getRegionColor(d));
    }
    this.renderLegend();
  }

  renderLegend() {
    const legendPanel = document.getElementById('mapLegend');
    legendPanel.innerHTML = '';

    const legends = {
      risk: [
        { color: 'rgba(34, 197, 94, 0.7)', label: '🟢 Норма (<40)' },
        { color: 'rgba(59, 130, 246, 0.7)', label: '🔵 Средний (40–60)' },
        { color: 'rgba(251, 146, 60, 0.7)', label: '🟠 Высокий (60–75)' },
        { color: 'rgba(239, 68, 68, 0.85)', label: '🔴 Критичный (>75)' }
      ],
      tsr: [
        { color: 'rgba(239, 68, 68, 0.85)', label: '<72% — критично' },
        { color: 'rgba(251, 146, 60, 0.7)', label: '72–80% — внимание' },
        { color: 'rgba(59, 130, 246, 0.7)', label: '80–87%' },
        { color: 'rgba(34, 197, 94, 0.7)', label: '>87% — норма' }
      ],
      budget: [
        { color: 'rgba(239, 68, 68, 0.85)', label: '<60% — критично' },
        { color: 'rgba(251, 146, 60, 0.7)', label: '60–72% — риск' },
        { color: 'rgba(59, 130, 246, 0.7)', label: '72–82%' },
        { color: 'rgba(34, 197, 94, 0.7)', label: '>82% — норма' }
      ],
      overdue: [
        { color: 'rgba(239, 68, 68, 0.85)', label: '>5% — критично' },
        { color: 'rgba(251, 146, 60, 0.7)', label: '3–5% — внимание' },
        { color: 'rgba(59, 130, 246, 0.7)', label: '1.5–3%' },
        { color: 'rgba(34, 197, 94, 0.7)', label: '<1.5% — норма' }
      ]
    };

    const legend = legends[this.mode] || legends.risk;

    legend.forEach(item => {
      const div = document.createElement('div');
      div.className = 'legend-item';
      div.innerHTML = `
        <div class="legend-dot" style="background: ${item.color}"></div>
        <span class="legend-label">${item.label}</span>
      `;
      legendPanel.appendChild(div);
    });
  }
}

// Initialize map when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new RussiaMap();
});

// Re-render on window resize
window.addEventListener('resize', () => {
  const mapInstance = window.mapInstance || new RussiaMap();
  mapInstance.renderMap();
});
