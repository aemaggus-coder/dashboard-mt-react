import { useState, useEffect, useRef } from 'react';

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

interface AnimatedValueOptions {
  decimals?: number;
  from?: number;
}

export function useAnimatedValue(
  targetValue: number,
  duration = 800,
  { decimals, from = targetValue }: AnimatedValueOptions = {}
): number {
  const round = (v: number): number => {
    if (decimals === undefined) return v;
    if (decimals === 0) return Math.round(v);
    return parseFloat(v.toFixed(decimals));
  };

  const [displayValue, setDisplayValue] = useState<number>(() => round(from));
  const displayValueRef = useRef<number>(round(from));
  const startValueRef   = useRef<number>(round(from));
  const animationRef    = useRef<number | null>(null);
  const startTimeRef    = useRef<number | null>(null);

  useEffect(() => {
    displayValueRef.current = displayValue;
  }, [displayValue]);

  useEffect(() => {
    const current = displayValueRef.current;
    const threshold = decimals === undefined ? 0 : decimals === 0 ? 0 : Math.pow(10, -(decimals + 1));
    if (Math.abs(current - targetValue) <= threshold) return;

    startValueRef.current = current;
    startTimeRef.current  = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const next = round(startValueRef.current + (targetValue - startValueRef.current) * easeInOutQuad(progress));
      displayValueRef.current = next;
      setDisplayValue(next);
      if (progress < 1) animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [targetValue, duration, decimals]); // eslint-disable-line react-hooks/exhaustive-deps

  return displayValue;
}
