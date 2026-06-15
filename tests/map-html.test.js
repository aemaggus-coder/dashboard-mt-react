import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const mapHtml = await readFile(new URL('../public/map.html', import.meta.url), 'utf8');

test('map view toggle uses modern SVG controls without emoji labels', () => {
  assert.match(mapHtml, /class="map-switcher map-view-toggle"/);
  assert.match(mapHtml, /class="map-switcher-btn map-view-toggle-btn active" data-map="grid"/);
  assert.match(mapHtml, /class="map-switcher-btn map-view-toggle-btn" data-map="d3"/);
  assert.doesNotMatch(mapHtml, /🔲|🗺️/);
});

test('legacy d3 show-by toolbar is removed', () => {
  assert.doesNotMatch(mapHtml, /id="d3ModeButtons"/);
  assert.doesNotMatch(mapHtml, /Показывать по:/);
  assert.doesNotMatch(mapHtml, /data-mode="/);
});

test('selection mode stays in the side panel and side heading is removed', () => {
  assert.match(mapHtml, /<div class="mbar-select-mode" aria-label="Режим выбора">/);
  assert.match(mapHtml, /data-panel="region"/);
  assert.match(mapHtml, /data-panel="metric"/);
  assert.doesNotMatch(mapHtml, /class="mbar-head"/);
  assert.doesNotMatch(mapHtml, /id="mbarTitle"/);
});

test('map script keeps diagnostics out of the browser console', () => {
  assert.match(mapHtml, /function mapIssue/);
  assert.doesNotMatch(mapHtml, /console\./);
  assert.doesNotMatch(mapHtml, /function showRegionPanel/);
});

test('d3 map uses local vendor libraries instead of CDN scripts', () => {
  assert.match(mapHtml, /src="\/assets\/vendor\/d3\.v7\.min\.js"/);
  assert.match(mapHtml, /src="\/assets\/vendor\/topojson\.v3\.min\.js"/);
  assert.doesNotMatch(mapHtml, /https:\/\/d3js\.org/);
});

test('d3 map background uses page background while region fills stay data-driven', () => {
  assert.match(mapHtml, /\.map-view\[data-map="d3"\]\{background:var\(--bg\)\}/);
  assert.match(mapHtml, /background:var\(--bg\);min-height:0"><svg id="d3Map"/);
  assert.match(mapHtml, /\.attr\('fill',d=>_getD3Color\(d\)\)/);
});

test('tile map legend uses the same heat colors as region tiles', () => {
  assert.match(mapHtml, /function _mapHeatColor\(t\)/);
  assert.match(mapHtml, /const stops=\[0,\s*\.25,\s*\.5,\s*\.75,\s*1\]\.map\(t=>_mapHeatColor\(t\)/);
  assert.match(mapHtml, /\.mleg-bar\{[^}]*rgba\(34,197,94,\.55\)[^}]*rgba\(250,191,36,\.75\)[^}]*rgba\(255,67,67,\.95\)/);
  assert.doesNotMatch(mapHtml, /\.mleg-bar\{[^}]*#22a34a/);
});

test('legend switches to d3 color ranges when d3 map is active', () => {
  assert.match(mapHtml, /function _getD3ModeConfig\(\)/);
  assert.match(mapHtml, /let _mapViewMode='grid'/);
  assert.match(mapHtml, /_mapViewMode=type==='d3'\?'d3':'grid'/);
  assert.match(mapHtml, /const isD3=_mapViewMode==='d3'/);
  assert.match(mapHtml, /bar\.dataset\.mapMode=_mapViewMode/);
  assert.match(mapHtml, /const cfg=_getD3ModeConfig\(\);[\s\S]*?const stops=cfg\.range\.map/);
  assert.doesNotMatch(mapHtml, /const stops=cfg\.range\.flatMap/);
  assert.match(mapHtml, /updateLegendVals\(\);\s*if\(type==='d3'\)/);
});

test('federal district selection uses official groups and region name aliases', () => {
  assert.match(mapHtml, /fo:'Вне федеральных округов'/);
  assert.doesNotMatch(mapHtml, /fo:'Новые субъекты РФ'/);
  assert.match(mapHtml, /'еврейская ао':'еврейская автономная область'/);
  assert.match(mapHtml, /'ненецкий ао':'ненецкий автономный округ'/);
  assert.match(mapHtml, /'ханты-мансийский ао':'ханты-мансийский автономный округ - югра'/);
  assert.match(mapHtml, /'ханты-мансийский ао - югра':'ханты-мансийский автономный округ - югра'/);
  assert.match(mapHtml, /'ханты-мансийский автономный округ':'ханты-мансийский автономный округ - югра'/);
  assert.match(mapHtml, /'хмао - югра':'ханты-мансийский автономный округ - югра'/);
  assert.match(mapHtml, /'янао':'ямало-ненецкий автономный округ'/);
  assert.match(mapHtml, /'донецкая нр':'донецкая народная республика'/);
  assert.match(mapHtml, /function regionMatches\(a,b\)\{return regionKey\(a\)===regionKey\(b\);\}/);
});

test('d3 map is prewarmed and reuses cached geojson before switching', () => {
  assert.match(mapHtml, /let _russiaGeojson=null/);
  assert.match(mapHtml, /let _d3PrewarmStarted=false/);
  assert.match(mapHtml, /function getRussiaGeojson\(\)/);
  assert.match(mapHtml, /function prewarmMapD3\(\)/);
  assert.match(mapHtml, /function runWhenIdle\(fn\)/);
  assert.match(mapHtml, /else prewarmMapD3\(\)/);
  assert.match(mapHtml, /getRussiaGeojson\(\);\s*return true;/);
});
