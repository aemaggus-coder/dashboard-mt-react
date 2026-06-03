export const BASE = {
  total: 2170900,
  adults: 2160000,
  children: 670000,
  veterans: 629561,
  causes: [
    { name: 'Общее заболевание', value: 36, color: '#2563eb' },
    { name: 'Ветераны', value: 29, color: '#f59e0b' },
    { name: 'Трудовое увечье', value: 4, color: '#10b981' },
    { name: 'Проф. заболевание', value: 11, color: '#8b5cf6' },
    { name: 'Детство', value: 20, color: '#60a5fa' },
  ],
  employ: {
    labels: ['I группа', 'II группа', 'III группа'],
    working: [120, 260, 470],
    notWorking: [180, 240, 220],
  },
  age: {
    children: {
      labels: ['до 3 лет', 'от 3 до 8', 'от 9 до 13', '13–18 лет'],
      values: [120000, 180000, 210000, 160000],
      male: [65000, 98000, 115000, 87000],
      female: [55000, 82000, 95000, 73000],
    },
    adults: {
      labels: ['18–30 лет', '31–45 лет', '46–60 лет', '60+ лет'],
      values: [310000, 480000, 620000, 750000],
      male: [143000, 221000, 285000, 345000],
      female: [167000, 259000, 335000, 405000],
    },
  },
  nosology: [
    { name: 'Злокачественные новообразования', value: 90 },
    { name: 'Болезни нервной системы', value: 80 },
    { name: 'Травмы, отравления и другие последствия внешних причин', value: 70 },
    { name: 'Болезни системы кровообращения', value: 50 },
    { name: 'Болезни костно-мышечной системы', value: 30 },
  ],
  exam: {
    today: { primary: 380, reexam: 1092, appealMain: 68, appealFed: 16, terms: 18.8, form: [65, 35], result: [73, 27] },
    ytd: { primary: 54200, reexam: 151800, appealMain: 7340, appealFed: 1620, terms: 21.4, form: [61, 39], result: [69, 31] },
    qtr: { primary: 27800, reexam: 78900, appealMain: 3620, appealFed: 840, terms: 20.6, form: [63, 37], result: [71, 29] },
    year: { primary: 210000, reexam: 589000, appealMain: 14800, appealFed: 3240, terms: 22.1, form: [61, 39], result: [70, 30] },
  },
  tsr: {
    today: {
      budgetTotal: 64,
      budgetUsed: 34,
      issuedNat: 740,
      issuedCert: 661,
      status: [13, 15, 72],
      groups: [
        { name: 'Кресла-коляски', nat: 128, cert: 204, sum: 17.6, people: 280 },
        { name: 'Протезно-ортопедические изделия', nat: 107, cert: 219, sum: 49.3, people: 310 },
        { name: 'Слуховые аппараты', nat: 158, cert: 228, sum: 10.0, people: 350 },
        { name: 'Абсорбирующее бельё', nat: 356, cert: 51, sum: 9.9, people: 390 },
        { name: 'Другие виды ТСР', nat: 154, cert: 110, sum: 39.4, people: 240 },
      ],
    },
    ytd: {
      budgetTotal: 8420,
      budgetUsed: 5980,
      issuedNat: 96300,
      issuedCert: 84100,
      status: [12, 14, 74],
      groups: [
        { name: 'Кресла-коляски', nat: 18200, cert: 27400, sum: 2310, people: 43200 },
        { name: 'Протезно-ортопедические изделия', nat: 15600, cert: 29800, sum: 6480, people: 41800 },
        { name: 'Слуховые аппараты', nat: 21300, cert: 30100, sum: 1320, people: 48000 },
        { name: 'Абсорбирующее бельё', nat: 47900, cert: 6800, sum: 1290, people: 52700 },
        { name: 'Другие виды ТСР', nat: 20800, cert: 14900, sum: 5180, people: 33100 },
      ],
    },
    month: {
      budgetTotal: 535,
      budgetUsed: 298,
      issuedNat: 8100,
      issuedCert: 7020,
      status: [14, 18, 68],
      groups: [
        { name: 'Кресла-коляски', nat: 1420, cert: 2280, sum: 195, people: 3400 },
        { name: 'Протезно-ортопедические изделия', nat: 1300, cert: 2490, sum: 540, people: 3490 },
        { name: 'Слуховые аппараты', nat: 1775, cert: 2510, sum: 110, people: 4000 },
        { name: 'Абсорбирующее бельё', nat: 3990, cert: 568, sum: 107, people: 4400 },
        { name: 'Другие виды ТСР', nat: 1730, cert: 1240, sum: 432, people: 2760 },
      ],
    },
    qtr: {
      budgetTotal: 2105,
      budgetUsed: 1480,
      issuedNat: 25200,
      issuedCert: 21900,
      status: [13, 16, 71],
      groups: [
        { name: 'Кресла-коляски', nat: 4800, cert: 7200, sum: 620, people: 11400 },
        { name: 'Протезно-ортопедические изделия', nat: 4100, cert: 7800, sum: 1720, people: 10900 },
        { name: 'Слуховые аппараты', nat: 5600, cert: 8200, sum: 350, people: 12600 },
        { name: 'Абсорбирующее бельё', nat: 12700, cert: 1800, sum: 340, people: 13900 },
        { name: 'Другие виды ТСР', nat: 5500, cert: 3900, sum: 1380, people: 8700 },
      ],
    },
    year: {
      budgetTotal: 7980,
      budgetUsed: 6420,
      issuedNat: 90400,
      issuedCert: 80600,
      status: [11, 13, 76],
      groups: [
        { name: 'Кресла-коляски', nat: 17200, cert: 26800, sum: 2190, people: 41000 },
        { name: 'Протезно-ортопедические изделия', nat: 14800, cert: 28200, sum: 6140, people: 39600 },
        { name: 'Слуховые аппараты', nat: 20200, cert: 28900, sum: 1250, people: 45500 },
        { name: 'Абсорбирующее бельё', nat: 45400, cert: 6500, sum: 1220, people: 49900 },
        { name: 'Другие виды ТСР', nat: 19700, cert: 14100, sum: 4910, people: 31400 },
      ],
    },
  },
};

export const PREV_POP = { total: 2145000, er: 32.1, ch: 665000 };

export const PREV_EXAM = {
  today: { tx: 1450, terms: 19.2, ar: 5.9, res: 72 },
  ytd: { tx: 206000, terms: 22.1, ar: 5.8, res: 68 },
  qtr: { tx: 104800, terms: 21.8, ar: 6.1, res: 70 },
  year: { tx: 796000, terms: 23.4, ar: 6.3, res: 70 },
};

export const PREV_TSR = {
  today: { up: 47.7, iss: 1320, cp: 46.3 },
  month: { up: 51.2, iss: 14200, cp: 46.8 },
  ytd: { up: 66.7, iss: 168200, cp: 46.6 },
  qtr: { up: 66.2, iss: 44200, cp: 46.6 },
  year: { up: 72.0, iss: 164000, cp: 47.4 },
};

export const PERIODS = ['today', 'month', 'qtr', 'ytd', 'year'];

export const PERIOD_LABELS = {
  today: 'Сегодня',
  month: 'Месяц',
  qtr: 'Квартал',
  ytd: 'С начала года',
  year: 'За год',
};

export const REGIONS = [
  { fo: 'Центральный ФО', color: '#3b82f6', list: ['Белгородская область', 'Брянская область', 'Владимирская область', 'Воронежская область', 'Ивановская область', 'Калужская область', 'Костромская область', 'Курская область', 'Липецкая область', 'Московская область', 'Орловская область', 'Рязанская область', 'Смоленская область', 'Тамбовская область', 'Тверская область', 'Тульская область', 'Ярославская область', 'г. Москва'] },
  { fo: 'Северо-Западный ФО', color: '#06b6d4', list: ['Республика Карелия', 'Республика Коми', 'Архангельская область', 'Вологодская область', 'Калининградская область', 'Ленинградская область', 'Мурманская область', 'Новгородская область', 'Псковская область', 'г. Санкт-Петербург', 'Ненецкий автономный округ'] },
  { fo: 'Южный ФО', color: '#22c55e', list: ['Республика Адыгея', 'Республика Калмыкия', 'Республика Крым', 'Краснодарский край', 'Астраханская область', 'Волгоградская область', 'Ростовская область', 'г. Севастополь'] },
  { fo: 'Северо-Кавказский ФО', color: '#f59e0b', list: ['Республика Дагестан', 'Республика Ингушетия', 'Кабардино-Балкарская Республика', 'Карачаево-Черкесская Республика', 'Республика Северная Осетия — Алания', 'Чеченская Республика', 'Ставропольский край'] },
  { fo: 'Приволжский ФО', color: '#a855f7', list: ['Республика Башкортостан', 'Республика Марий Эл', 'Республика Мордовия', 'Республика Татарстан', 'Удмуртская Республика', 'Чувашская Республика', 'Пермский край', 'Кировская область', 'Нижегородская область', 'Оренбургская область', 'Пензенская область', 'Самарская область', 'Саратовская область', 'Ульяновская область'] },
  { fo: 'Уральский ФО', color: '#0ea5e9', list: ['Курганская область', 'Свердловская область', 'Тюменская область', 'Челябинская область', 'Ханты-Мансийский АО — Югра', 'Ямало-Ненецкий АО'] },
  { fo: 'Сибирский ФО', color: '#14b8a6', list: ['Республика Алтай', 'Республика Тыва', 'Республика Хакасия', 'Алтайский край', 'Красноярский край', 'Иркутская область', 'Кемеровская область', 'Новосибирская область', 'Омская область', 'Томская область'] },
  { fo: 'Дальневосточный ФО', color: '#6366f1', list: ['Республика Бурятия', 'Республика Саха (Якутия)', 'Забайкальский край', 'Камчатский край', 'Приморский край', 'Хабаровский край', 'Амурская область', 'Магаданская область', 'Сахалинская область', 'Еврейская АО', 'Чукотский АО'] },
  { fo: 'Новые субъекты РФ', color: '#ef4444', list: ['Донецкая НР', 'Луганская НР', 'Запорожская область', 'Херсонская область'] },
];

export const ALL_REGIONS = REGIONS.flatMap(g => g.list);

export function rfactor(regionName) {
  let h = 0;
  for (const c of regionName) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return 0.004 + (h % 260) / 10000;
}

export function calculateScaleFactor(scope, selectedRegions) {
  if (scope === 'rf') return 1;
  if (scope === 'fo') return 0.4;
  if (!selectedRegions || selectedRegions.length === 0) return 0.11;
  return selectedRegions.reduce((sum, r) => sum + rfactor(r), 0);
}

export function applyScaleToValue(value, scale) {
  if (typeof value !== 'number') return value;
  return Math.round(value * scale);
}

export function applyScaleToArray(arr, scale) {
  if (!Array.isArray(arr)) return arr;
  return arr.map(v => applyScaleToValue(v, scale));
}

export function applyScaleToObject(obj, scale, keys = []) {
  const result = { ...obj };
  const allKeys = keys.length > 0 ? keys : Object.keys(obj);
  allKeys.forEach(key => {
    if (Array.isArray(obj[key])) {
      // Check if it's an array of objects (like groups)
      if (obj[key].length > 0 && typeof obj[key][0] === 'object') {
        result[key] = obj[key].map(item => applyScaleToObject(item, scale));
      } else {
        result[key] = applyScaleToArray(obj[key], scale);
      }
    } else if (typeof obj[key] === 'number') {
      result[key] = applyScaleToValue(obj[key], scale);
    }
  });
  return result;
}

// jitter() - add random ±0.7% variation to value for realism
export function jitter(value, variation = 0.007) {
  if (typeof value !== 'number') return value;
  const factor = 1 + (Math.random() - 0.5) * variation;
  return Math.round(value * factor);
}

// applyJitterToData() - recursively apply jitter to all numeric values
export function applyJitterToData(obj, variation = 0.007) {
  if (typeof obj === 'number') {
    return jitter(obj, variation);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => applyJitterToData(item, variation));
  }
  if (typeof obj === 'object' && obj !== null) {
    const result = { ...obj };
    Object.keys(result).forEach(key => {
      result[key] = applyJitterToData(result[key], variation);
    });
    return result;
  }
  return obj;
}
