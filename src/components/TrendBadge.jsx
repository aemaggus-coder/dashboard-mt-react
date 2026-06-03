export default function TrendBadge({ current, previous, isHigherBetter = true }) {
  if (!previous || previous === 0) return null;

  const delta = ((current - previous) / previous) * 100;
  const isPositive = delta > 0;
  const isGood = isHigherBetter ? isPositive : !isPositive;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '12px',
        fontWeight: '600',
        color: isGood ? '#10b981' : '#ef4444',
        padding: '4px 8px',
        background: isGood ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        borderRadius: '4px',
      }}
    >
      <span>{isPositive ? '▲' : '▼'}</span>
      <span>{Math.abs(delta).toFixed(1)}%</span>
    </div>
  );
}
