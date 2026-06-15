import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const css = await readFile(new URL('../src/App.css', import.meta.url), 'utf8');

// ── Layout — dashboard grid areas ────────────────────────────────────────────

test('exam tab grid areas define primary, form, result, appeal, terms', () => {
  assert.match(css, /#view-exam\.active/);
  assert.match(css, /'result primary form'/);
  assert.match(css, /'appeal terms terms'/);
});

test('population tab grid areas define causes, age, employ, noso', () => {
  assert.match(css, /#view-population\.active/);
  assert.match(css, /'causes age noso'/);
  assert.match(css, /'causes employ noso'/);
});

test('tsr tab uses 3-column layout with budget and groups', () => {
  assert.match(css, /#view-tsr\.active/);
  assert.match(css, /'issued budget groups'/);
  assert.match(css, /grid-template-columns: 1fr 1\.4fr 1\.6fr/);
});

// ── Dark theme — critical overrides ──────────────────────────────────────────

test('dark theme resets CSS variables', () => {
  assert.match(css, /html:not\(\[data-theme="light"\]\)/);
  assert.match(css, /--surface: #111d36/);
  assert.match(css, /--text: #f7fbff/);
});

test('dark theme card background is defined', () => {
  assert.match(css, /html:not\(\[data-theme="light"\]\) \.card\s*\{/);
  assert.match(css, /background: #26385B/);
});

test('dark theme budget-stat color fills are set per variant', () => {
  assert.match(css, /html:not\(\[data-theme="light"\]\) \.budget-stat\.b-alloc/);
  assert.match(css, /html:not\(\[data-theme="light"\]\) \.budget-stat\.b-used/);
  assert.match(css, /html:not\(\[data-theme="light"\]\) \.budget-stat\.b-rest/);
});

test('light theme budget-stat color fills are set per variant', () => {
  assert.match(css, /html\[data-theme="light"\] \.budget-stat\.b-alloc/);
  assert.match(css, /html\[data-theme="light"\] \.budget-stat\.b-used/);
  assert.match(css, /html\[data-theme="light"\] \.budget-stat\.b-rest/);
});

// ── Gauge ────────────────────────────────────────────────────────────────────

test('budget gauge SVG elements have CSS classes defined', () => {
  assert.match(css, /\.budget-gauge-track/);
  assert.match(css, /\.budget-gauge-fill/);
  assert.match(css, /\.gauge-needle-line/);
  assert.match(css, /\.gauge-needle-hub/);
  assert.match(css, /\.gauge-zone-tick/);
  assert.match(css, /\.gauge-tip-dot/);
  assert.match(css, /\.gauge-pct/);
  assert.match(css, /\.gauge-sub/);
});

test('budget gauge fill has animated transition on stroke-dashoffset', () => {
  assert.match(css, /stroke-dashoffset.*1\.1s/);
});

test('budget stats row uses equal 3-column layout', () => {
  assert.match(css, /\.budget-stats-row\s*\{[^}]*grid-template-columns: 1fr 1fr 1fr/s);
});

// ── Status fills ─────────────────────────────────────────────────────────────

test('appeal-center ok and warn fills are defined', () => {
  assert.match(css, /\.appeal-center\.ok\s*\{/);
  assert.match(css, /\.appeal-center\.warn\s*\{/);
});

test('terms-hero status fills cover ok, warn, risk', () => {
  assert.match(css, /\.terms-hero--ok\s*\{/);
  assert.match(css, /\.terms-hero--warn\s*\{/);
  assert.match(css, /\.terms-hero--risk\s*\{/);
});

test('exam primary summary row fills use orange and blue', () => {
  assert.match(css, /\.exam-primary-summary \.exam-summary-row:first-child/);
  assert.match(css, /rgba\(249, 115, 22/);
  assert.match(css, /\.exam-primary-summary \.exam-summary-row:last-child/);
});

// ── Minister panel ───────────────────────────────────────────────────────────

test('minister-panel-risks spans both rows in the grid', () => {
  assert.match(css, /\.minister-panel-risks\s*\{[^}]*grid-row: 1 \/ span 2/s);
});

test('minister-panel-risks risk list stretches to fill panel height', () => {
  assert.match(css, /\.minister-panel-risks\s*\{[^}]*display: flex/s);
  assert.match(css, /\.minister-panel-risks \.minister-risk-list\s*\{[^}]*flex: 1/s);
});

// ── Responsive breakpoints ───────────────────────────────────────────────────

test('responsive exam layout defined at 1180px breakpoint', () => {
  assert.match(css, /@media.*1180px/);
});

test('responsive population layout falls back to single-column stack', () => {
  const atMedia = css.match(/@media[^{]+1180px[^{]*\{([\s\S]*?)(?=@media|\s*$)/g) || [];
  const combined = atMedia.join('');
  assert.match(combined, /noso noso/);
});

// ── KPI cards ────────────────────────────────────────────────────────────────

test('kpi ok/warn/risk classes are defined for dark theme', () => {
  assert.match(css, /html:not\(\[data-theme="light"\]\) \.kpi\.ok/);
  assert.match(css, /html:not\(\[data-theme="light"\]\) \.kpi\.warn/);
  assert.match(css, /html:not\(\[data-theme="light"\]\) \.kpi\.risk/);
});

// ── CSS custom properties ────────────────────────────────────────────────────

test('root custom properties define core design tokens', () => {
  assert.match(css, /--surface:/);
  assert.match(css, /--text:/);
  assert.match(css, /--text-2:/);
  assert.match(css, /--text-3:/);
  assert.match(css, /--border:/);
  assert.match(css, /--mono:/);
  assert.match(css, /--r:/);
});
