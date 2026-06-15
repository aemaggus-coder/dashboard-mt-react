import assert from 'node:assert/strict';
import test from 'node:test';
import {
  jitter,
  applyJitterToData,
  applyScaleToValue,
  applyScaleToArray,
  applyScaleToObject,
  calculateScaleFactor,
  rfactor,
  ALL_REGIONS,
} from '../src/lib/constants.js';

// ── jitter ──────────────────────────────────────────────────────────────────

test('jitter stays within default ±0.7% range', () => {
  for (let i = 0; i < 200; i++) {
    const result = jitter(1000, 0.007);
    assert.ok(result >= 993 && result <= 1007, `jitter(1000) = ${result} out of ±0.7%`);
  }
});

test('jitter stays within custom variation range', () => {
  for (let i = 0; i < 100; i++) {
    const result = jitter(500, 0.1);
    assert.ok(result >= 475 && result <= 525, `jitter(500, 0.1) = ${result}`);
  }
});

test('jitter returns non-numbers unchanged', () => {
  assert.equal(jitter('text', 0.5), 'text');
  assert.equal(jitter(null, 0.5), null);
  assert.equal(jitter(undefined, 0.5), undefined);
});

test('jitter returns an integer (Math.round)', () => {
  for (let i = 0; i < 50; i++) {
    const r = jitter(777);
    assert.ok(Number.isInteger(r), `jitter returned non-integer: ${r}`);
  }
});

// ── applyJitterToData ────────────────────────────────────────────────────────

test('applyJitterToData handles primitive number', () => {
  const r = applyJitterToData(100, 0.007);
  assert.ok(r >= 99 && r <= 101, `applyJitterToData(100) = ${r}`);
});

test('applyJitterToData leaves strings untouched', () => {
  assert.equal(applyJitterToData('hello'), 'hello');
});

test('applyJitterToData recurses into arrays', () => {
  const arr = [100, 200, 300];
  const result = applyJitterToData(arr, 0.007);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, arr.length);
});

test('applyJitterToData recurses into objects', () => {
  const obj = { count: 100, label: 'test', nested: { val: 50 } };
  const result = applyJitterToData(obj, 0.007);
  assert.equal(result.label, 'test');
  assert.ok(typeof result.count === 'number');
  assert.ok(typeof result.nested.val === 'number');
});

test('applyJitterToData does not mutate the source', () => {
  const src = { a: 100, arr: [10, 20] };
  applyJitterToData(src, 0.5);
  assert.equal(src.a, 100);
  assert.deepEqual(src.arr, [10, 20]);
});

// ── applyScaleToValue ────────────────────────────────────────────────────────

test('applyScaleToValue scales numbers', () => {
  assert.equal(applyScaleToValue(100, 0.5), 50);
  assert.equal(applyScaleToValue(100, 2), 200);
  assert.equal(applyScaleToValue(3, 0.333), 1);
});

test('applyScaleToValue returns non-numbers unchanged', () => {
  assert.equal(applyScaleToValue('str', 0.5), 'str');
  assert.equal(applyScaleToValue(null, 0.5), null);
});

// ── applyScaleToArray ────────────────────────────────────────────────────────

test('applyScaleToArray scales every element', () => {
  assert.deepEqual(applyScaleToArray([10, 20, 30], 0.5), [5, 10, 15]);
  assert.deepEqual(applyScaleToArray([100], 2), [200]);
});

test('applyScaleToArray returns non-arrays unchanged', () => {
  assert.equal(applyScaleToArray(null, 0.5), null);
  assert.equal(applyScaleToArray('str', 0.5), 'str');
});

test('applyScaleToArray handles empty array', () => {
  assert.deepEqual(applyScaleToArray([], 0.5), []);
});

// ── applyScaleToObject ───────────────────────────────────────────────────────

test('applyScaleToObject scales specified keys only', () => {
  const src = { label: 'x', total: 100, untouched: 7 };
  const result = applyScaleToObject(src, 0.5, ['total']);
  assert.equal(result.total, 50);
  assert.equal(result.untouched, 7);
  assert.equal(result.label, 'x');
});

test('applyScaleToObject scales all numeric keys when no keys specified', () => {
  const src = { a: 10, b: 20, s: 'str' };
  const result = applyScaleToObject(src, 2);
  assert.equal(result.a, 20);
  assert.equal(result.b, 40);
  assert.equal(result.s, 'str');
});

test('applyScaleToObject recurses into array-of-objects', () => {
  const src = { items: [{ v: 10 }, { v: 20 }] };
  const result = applyScaleToObject(src, 0.5, ['items']);
  assert.deepEqual(result.items, [{ v: 5 }, { v: 10 }]);
});

test('applyScaleToObject does not mutate source', () => {
  const src = { nested: [{ value: 20 }], total: 100 };
  applyScaleToObject(src, 0.5, ['total', 'nested']);
  assert.equal(src.total, 100);
  assert.deepEqual(src.nested, [{ value: 20 }]);
});

// ── calculateScaleFactor ─────────────────────────────────────────────────────

test('calculateScaleFactor rf returns 1 regardless of regions', () => {
  assert.equal(calculateScaleFactor('rf'), 1);
  assert.equal(calculateScaleFactor('rf', ['Московская область']), 1);
  assert.equal(calculateScaleFactor('rf', []), 1);
});

test('calculateScaleFactor fo returns 0.4 regardless of regions', () => {
  assert.equal(calculateScaleFactor('fo'), 0.4);
  assert.equal(calculateScaleFactor('fo', ['Московская область']), 0.4);
});

test('calculateScaleFactor region with no selection returns 0.11', () => {
  assert.equal(calculateScaleFactor('region'), 0.11);
  assert.equal(calculateScaleFactor('region', []), 0.11);
  assert.equal(calculateScaleFactor('region', null), 0.11);
});

test('calculateScaleFactor region sums rfactors for each selected region', () => {
  const regions = ['Московская область', 'Республика Коми'];
  const expected = rfactor('Московская область') + rfactor('Республика Коми');
  assert.equal(calculateScaleFactor('region', regions), expected);
});

test('calculateScaleFactor single region equals its rfactor', () => {
  const name = 'Саратовская область';
  assert.equal(calculateScaleFactor('region', [name]), rfactor(name));
});

// ── rfactor ──────────────────────────────────────────────────────────────────

test('rfactor is deterministic', () => {
  for (const name of ALL_REGIONS.slice(0, 30)) {
    assert.equal(rfactor(name), rfactor(name), `rfactor not deterministic for "${name}"`);
  }
});

test('rfactor returns value in [0.004, 0.03] range for all regions', () => {
  for (const name of ALL_REGIONS) {
    const f = rfactor(name);
    assert.ok(f >= 0.004 && f <= 0.03, `rfactor("${name}") = ${f} outside [0.004, 0.03]`);
  }
});

test('rfactor returns different values for different region names', () => {
  const values = new Set(ALL_REGIONS.map(rfactor));
  // Not all are unique due to hash collisions, but vast majority should be distinct
  assert.ok(values.size > ALL_REGIONS.length * 0.8, 'too many rfactor collisions');
});
