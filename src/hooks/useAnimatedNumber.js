import { useState, useEffect, useRef } from 'react';

// animNum() - animate integer numbers (0 to targetValue)
export function useAnimatedNumber(targetValue, duration = 800) {
  const [displayValue, setDisplayValue] = useState(0);
  const displayValueRef = useRef(displayValue);
  const startValueRef = useRef(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    displayValueRef.current = displayValue;
  }, [displayValue]);

  useEffect(() => {
    const currentValue = displayValueRef.current;

    if (currentValue === targetValue) return;

    startValueRef.current = currentValue;
    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const newValue = startValueRef.current + (targetValue - startValueRef.current) * easeInOutQuad(progress);
      const nextValue = Math.round(newValue);
      displayValueRef.current = nextValue;
      setDisplayValue(nextValue);

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
  const displayValueRef = useRef(displayValue);
  const startValueRef = useRef(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    displayValueRef.current = displayValue;
  }, [displayValue]);

  useEffect(() => {
    const currentValue = displayValueRef.current;

    if (Math.abs(currentValue - targetValue) < 0.05) return;

    startValueRef.current = currentValue;
    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const newValue = startValueRef.current + (targetValue - startValueRef.current) * easeInOutQuad(progress);
      const nextValue = parseFloat(newValue.toFixed(1));
      displayValueRef.current = nextValue;
      setDisplayValue(nextValue);

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
  const displayValueRef = useRef(displayValue);
  const startValueRef = useRef(targetValue);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    displayValueRef.current = displayValue;
  }, [displayValue]);

  useEffect(() => {
    const currentValue = displayValueRef.current;

    if (currentValue === targetValue) return;

    startValueRef.current = currentValue;
    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const newValue = startValueRef.current + (targetValue - startValueRef.current) * easeInOutQuad(progress);
      displayValueRef.current = newValue;
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
