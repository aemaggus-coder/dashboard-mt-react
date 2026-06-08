import { useState, useEffect, useRef } from 'react';

export function useAnimatedValue(targetValue, duration = 600) {
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
