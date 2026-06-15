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

test('d3 map background uses page background while region fills stay data-driven', () => {
  assert.match(mapHtml, /\.map-view\[data-map="d3"\]\{background:var\(--bg\)\}/);
  assert.match(mapHtml, /background:var\(--bg\);min-height:0"><svg id="d3Map"/);
  assert.match(mapHtml, /\.attr\('fill',d=>_getD3Color\(d\)\)/);
});
