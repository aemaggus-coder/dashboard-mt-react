import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ALL_REGIONS,
  BASE,
  PERIODS,
  applyScaleToObject,
  applyScaleToValue,
  calculateScaleFactor,
  rfactor,
} from '../src/lib/constants.js';

test('periods and base datasets expose expected dashboard periods', () => {
  assert.deepEqual(PERIODS, ['today', 'month', 'qtr', 'ytd', 'year']);
  for (const period of ['today', 'ytd', 'qtr', 'year']) {
    assert.ok(BASE.exam[period], `missing exam period: ${period}`);
  }
  for (const period of PERIODS) {
    assert.ok(BASE.tsr[period], `missing tsr period: ${period}`);
  }
});

test('regions are flattened without losing known regions', () => {
  assert.ok(ALL_REGIONS.length > 80);
  assert.ok(ALL_REGIONS.includes('Московская область'));
  assert.ok(ALL_REGIONS.includes('Республика Коми'));
  assert.equal(new Set(ALL_REGIONS).size, ALL_REGIONS.length);
});

test('scale factor helpers are deterministic and preserve non-numeric values', () => {
  assert.equal(calculateScaleFactor('rf'), 1);
  assert.equal(calculateScaleFactor('fo'), 0.4);
  assert.equal(rfactor('Республика Коми'), rfactor('Республика Коми'));
  assert.equal(applyScaleToValue('10', 0.5), '10');
  assert.equal(applyScaleToValue(10, 0.5), 5);
});

test('object scaling scales selected numeric fields without mutating source', () => {
  const source = {
    label: 'demo',
    total: 100,
    nested: [{ value: 20 }],
    untouched: 7,
  };
  const result = applyScaleToObject(source, 0.5, ['total', 'nested']);

  assert.deepEqual(result, {
    label: 'demo',
    total: 50,
    nested: [{ value: 10 }],
    untouched: 7,
  });
  assert.deepEqual(source.nested, [{ value: 20 }]);
});
