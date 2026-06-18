import assert from 'node:assert/strict';
import test from 'node:test';
import {
  BASE,
  PERIODS,
  PERIOD_LABELS,
  PREV_EXAM,
  PREV_TSR,
  REGIONS,
  ALL_REGIONS,
} from '../src/lib/constants.js';

const EXAM_FIELDS = ['primary', 'reexam', 'appealMain', 'appealFed', 'terms', 'form', 'result'];
const TSR_FIELDS  = ['budgetTotal', 'budgetUsed', 'issuedNat', 'issuedCert', 'status', 'groups'];
// const GROUP_FIELDS = ['name', 'nat', 'cert', 'sum', 'people'];

// ── Exam data ────────────────────────────────────────────────────────────────

test('all exam periods have required fields', () => {
  for (const period of Object.keys(BASE.exam)) {
    const d = BASE.exam[period];
    for (const field of EXAM_FIELDS) {
      assert.ok(field in d, `exam.${period} missing field: "${field}"`);
    }
  }
});

test('exam form and result arrays each sum to 100', () => {
  for (const [period, d] of Object.entries(BASE.exam)) {
    const formSum   = d.form.reduce((a, b) => a + b, 0);
    const resultSum = d.result.reduce((a, b) => a + b, 0);
    assert.equal(formSum,   100, `exam.${period}.form sums to ${formSum}, expected 100`);
    assert.equal(resultSum, 100, `exam.${period}.result sums to ${resultSum}, expected 100`);
  }
});

test('exam terms are positive numbers in realistic range (1–60 days)', () => {
  for (const [period, d] of Object.entries(BASE.exam)) {
    assert.ok(
      typeof d.terms === 'number' && d.terms > 0 && d.terms < 60,
      `exam.${period}.terms = ${d.terms} outside realistic range`
    );
  }
});

test('exam appeal counts are positive integers', () => {
  for (const [period, d] of Object.entries(BASE.exam)) {
    assert.ok(Number.isInteger(d.appealMain) && d.appealMain > 0, `exam.${period}.appealMain invalid`);
    assert.ok(Number.isInteger(d.appealFed)  && d.appealFed  > 0, `exam.${period}.appealFed invalid`);
  }
});

test('exam primary and reexam are positive integers', () => {
  for (const [period, d] of Object.entries(BASE.exam)) {
    assert.ok(Number.isInteger(d.primary) && d.primary > 0, `exam.${period}.primary invalid`);
    assert.ok(Number.isInteger(d.reexam)  && d.reexam  > 0, `exam.${period}.reexam invalid`);
  }
});

test('exam appeal rate is under 100% for all periods', () => {
  for (const [period, d] of Object.entries(BASE.exam)) {
    const total = d.primary + d.reexam;
    const appeals = d.appealMain + d.appealFed;
    const rate = (appeals / total) * 100;
    assert.ok(rate < 100, `exam.${period}: appeal rate ${rate.toFixed(1)}% >= 100%`);
    assert.ok(rate > 0,   `exam.${period}: appeal rate is zero`);
  }
});

// ── TSR data ─────────────────────────────────────────────────────────────────

test('all tsr periods (PERIODS) exist and have required fields', () => {
  for (const period of PERIODS) {
    const d = BASE.tsr[period];
    assert.ok(d, `BASE.tsr missing period: "${period}"`);
    for (const field of TSR_FIELDS) {
      assert.ok(field in d, `tsr.${period} missing field: "${field}"`);
    }
  }
});

test('tsr status arrays sum to 100', () => {
  for (const [period, d] of Object.entries(BASE.tsr)) {
    const sum = d.status.reduce((a, b) => a + b, 0);
    assert.equal(sum, 100, `tsr.${period}.status sums to ${sum}, expected 100`);
  }
});

test('tsr budgetUsed does not exceed budgetTotal', () => {
  for (const [period, d] of Object.entries(BASE.tsr)) {
    assert.ok(d.budgetUsed <= d.budgetTotal,
      `tsr.${period}: budgetUsed (${d.budgetUsed}) > budgetTotal (${d.budgetTotal})`);
    assert.ok(d.budgetUsed > 0, `tsr.${period}: budgetUsed is zero`);
  }
});

test('tsr group names are consistent across all periods', () => {
  const allPeriods = Object.values(BASE.tsr);
  const firstNames = allPeriods[0].groups.map(g => g.name);
  for (let i = 1; i < allPeriods.length; i++) {
    const names = allPeriods[i].groups.map(g => g.name);
    assert.deepEqual(names, firstNames, `TSR group names differ in period index ${i}`);
  }
});

test('tsr group entries have required fields with positive numbers', () => {
  for (const [period, d] of Object.entries(BASE.tsr)) {
    for (const group of d.groups) {
      assert.ok(group.name && group.name.length > 0, `tsr.${period}: group missing name`);
      for (const field of ['nat', 'cert', 'sum', 'people']) {
        assert.ok(
          typeof group[field] === 'number' && group[field] > 0,
          `tsr.${period} group "${group.name}": field "${field}" = ${group[field]}`
        );
      }
    }
  }
});

test('tsr groups have exactly 5 entries per period', () => {
  for (const [period, d] of Object.entries(BASE.tsr)) {
    assert.equal(d.groups.length, 5, `tsr.${period}: expected 5 groups, got ${d.groups.length}`);
  }
});

// ── PERIODS / PERIOD_LABELS ──────────────────────────────────────────────────

test('PERIODS has exactly the expected 5 values in correct order', () => {
  assert.deepEqual(PERIODS, ['today', 'month', 'qtr', 'ytd', 'year']);
});

test('PERIOD_LABELS covers all PERIODS with non-empty strings', () => {
  for (const p of PERIODS) {
    assert.ok(PERIOD_LABELS[p], `PERIOD_LABELS missing period: "${p}"`);
    assert.ok(typeof PERIOD_LABELS[p] === 'string' && PERIOD_LABELS[p].length > 0);
  }
});

// ── PREV_EXAM / PREV_TSR ─────────────────────────────────────────────────────

test('PREV_EXAM covers all exam periods', () => {
  for (const p of Object.keys(BASE.exam)) {
    assert.ok(PREV_EXAM[p], `PREV_EXAM missing period: "${p}"`);
  }
});

test('PREV_EXAM entries have expected comparison fields', () => {
  for (const [period, d] of Object.entries(PREV_EXAM)) {
    assert.ok('terms' in d, `PREV_EXAM.${period} missing "terms"`);
    assert.ok('tx' in d,    `PREV_EXAM.${period} missing "tx"`);
    assert.ok('ar' in d,    `PREV_EXAM.${period} missing "ar"`);
    assert.ok('res' in d,   `PREV_EXAM.${period} missing "res"`);
  }
});

test('PREV_TSR covers all PERIODS', () => {
  for (const p of PERIODS) {
    assert.ok(PREV_TSR[p], `PREV_TSR missing period: "${p}"`);
  }
});

test('PREV_TSR entries have required comparison fields', () => {
  for (const [period, d] of Object.entries(PREV_TSR)) {
    assert.ok('up'  in d, `PREV_TSR.${period} missing "up"`);
    assert.ok('iss' in d, `PREV_TSR.${period} missing "iss"`);
    assert.ok('cp'  in d, `PREV_TSR.${period} missing "cp"`);
  }
});

// ── Population / causes / age / employ / nosology ────────────────────────────

test('population totals are positive and internally consistent', () => {
  assert.ok(BASE.total > 1_000_000, 'total population unrealistically small');
  assert.ok(BASE.adults > 0,   'adults is zero');
  assert.ok(BASE.children > 0, 'children is zero');
  assert.ok(BASE.veterans > 0, 'veterans is zero');
  assert.ok(BASE.adults > BASE.children, 'adults < children — unexpected');
  assert.ok(BASE.veterans < BASE.adults,  'veterans > adults — unexpected');
});

test('causes have name, positive value, and valid hex color', () => {
  assert.ok(BASE.causes.length > 0, 'causes array is empty');
  for (const c of BASE.causes) {
    assert.ok(c.name && c.name.length > 0,            `cause missing name`);
    assert.ok(typeof c.value === 'number' && c.value > 0, `cause "${c.name}" value invalid`);
    assert.match(c.color, /^#[0-9a-fA-F]{6}$/, `cause "${c.name}" color "${c.color}" not valid hex`);
  }
});

test('age children label/value/male/female arrays are same length', () => {
  const { children } = BASE.age;
  assert.equal(children.values.length, children.labels.length);
  assert.equal(children.male.length,   children.labels.length);
  assert.equal(children.female.length, children.labels.length);
});

test('age adults label/value/male/female arrays are same length', () => {
  const { adults } = BASE.age;
  assert.equal(adults.values.length, adults.labels.length);
  assert.equal(adults.male.length,   adults.labels.length);
  assert.equal(adults.female.length, adults.labels.length);
});

test('age male + female = total for every age bucket', () => {
  for (const group of [BASE.age.children, BASE.age.adults]) {
    group.values.forEach((total, i) => {
      const sum = group.male[i] + group.female[i];
      assert.equal(sum, total,
        `age group index ${i}: male(${group.male[i]}) + female(${group.female[i]}) = ${sum} ≠ ${total}`);
    });
  }
});

test('employ working and notWorking arrays match labels length', () => {
  const { labels, working, notWorking } = BASE.employ;
  assert.equal(working.length,    labels.length);
  assert.equal(notWorking.length, labels.length);
});

test('employ okved entries have name, value, share', () => {
  assert.ok(BASE.employ.okved.length > 0, 'okved is empty');
  for (const o of BASE.employ.okved) {
    assert.ok(o.name,   'okved entry missing name');
    assert.ok(typeof o.value === 'number' && o.value > 0, `okved "${o.name}" value invalid`);
    assert.ok(typeof o.share === 'number' && o.share > 0, `okved "${o.name}" share invalid`);
  }
});

test('nosology entries have name and positive value', () => {
  assert.ok(BASE.nosology.length > 0, 'nosology is empty');
  for (const n of BASE.nosology) {
    assert.ok(n.name && n.name.length > 0,             `nosology missing name`);
    assert.ok(typeof n.value === 'number' && n.value > 0, `nosology "${n.name}" value invalid`);
  }
});

// ── REGIONS / ALL_REGIONS ────────────────────────────────────────────────────

test('REGIONS has 8 federal districts plus unassigned subjects group', () => {
  assert.equal(REGIONS.length, 9);
  assert.equal(REGIONS.filter((r) => r.fo.endsWith('ФО')).length, 8);
  assert.ok(REGIONS.some((r) => r.fo === 'Вне федеральных округов'));
});

test('REGIONS each have fo, color, and non-empty list', () => {
  for (const r of REGIONS) {
    assert.ok(r.fo && r.fo.length > 0,   `region missing fo`);
    assert.match(r.color, /^#[0-9a-fA-F]{6}$/, `region "${r.fo}" color invalid`);
    assert.ok(Array.isArray(r.list) && r.list.length > 0, `region "${r.fo}" list empty`);
  }
});

test('ALL_REGIONS has more than 80 unique entries', () => {
  assert.ok(ALL_REGIONS.length > 80, `only ${ALL_REGIONS.length} regions`);
  assert.equal(new Set(ALL_REGIONS).size, ALL_REGIONS.length, 'duplicate regions found');
});

test('ALL_REGIONS contains key federal subjects', () => {
  const required = ['Московская область', 'г. Москва', 'г. Санкт-Петербург',
    'Республика Коми', 'Красноярский край', 'Донецкая НР'];
  for (const name of required) {
    assert.ok(ALL_REGIONS.includes(name), `ALL_REGIONS missing: "${name}"`);
  }
});
