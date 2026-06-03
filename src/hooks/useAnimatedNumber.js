import { useState, useEffect, useRef } from 'react';

// animNum() - animate integer numbers (0 to targetValue)
export function useAnimatedNumber(targetValue, duration = 800) {
  const [displayValue, setDisplayValue] = useState(0);
  const startValueRef = useRef(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (displayValue === targetValue) return;

    startValueRef.current = displayValue;
    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const newValue = startValueRef.current + (targetValue - startValueRef.current) * easeInOutQuad(progress);
      setDisplayValue(Math.round(newValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration]);

  return displayValue;
}

// animDec1() - animate decimal numbers with 1 decimal place (0.0 to targetValue)
export function useAnimatedDecimal(targetValue, duration = 800) {
  const [displayValue, setDisplayValue] = useState(0);
  const startValueRef = useRef(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (Math.abs(displayValue - targetValue) < 0.05) return;

    startValueRef.current = displayValue;
    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const newValue = startValueRef.current + (targetValue - startValueRef.current) * easeInOutQuad(progress);
      setDisplayValue(parseFloat(newValue.toFixed(1)));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration]);

  return displayValue;
}

// animKpiVal() - animate KPI card values with trend visualization
export function useAnimatedKpiValue(targetValue, duration = 600) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const startValueRef = useRef(displayValue);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (displayValue === targetValue) return;

    startValueRef.current = displayValue;
    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const newValue = startValueRef.current + (targetValue - startValueRef.current) * easeInOutQuad(progress);
      setDisplayValue(newValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration]);

  return displayValue;
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
