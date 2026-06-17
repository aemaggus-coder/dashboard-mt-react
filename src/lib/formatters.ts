export const fmt = (n: unknown): string => {
  if (typeof n !== 'number' || !isFinite(n)) return '—';
  return Math.round(n).toLocaleString('ru-RU');
};

export const fmt1 = (n: unknown): string => {
  if (typeof n !== 'number' || !isFinite(n)) return '—';
  return n.toLocaleString('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
};
