import { useEffect, useRef, useState } from "react";
import { Typography } from "@mui/material";

/**
 * Animates a number counting up from 0 to `value` once it scrolls
 * into view. Handles values like "100+", "5K+", "4.8" by parsing
 * out the numeric part and re-attaching the prefix/suffix/decimals.
 *
 * Usage:
 *   <CountUp value="92%" variant="h4" fontWeight={900} color="primary" />
 */
const CountUp = ({ value, duration = 1400, ...typographyProps }) => {
  const ref = useRef(null);
  const [display, setDisplay] = useState(null);
  const startedRef = useRef(false);

  // parse "100+", "5K+", "4.8", "92%" into number + suffix + decimals
  const match = String(value).match(/^([\d.]+)(.*)$/);
  const numeric = match ? parseFloat(match[1]) : null;
  const suffix = match ? match[2] : "";
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0;

  useEffect(() => {
    if (numeric === null) {
      setDisplay(value); // not a parseable number, just show as-is
      return;
    }
    setDisplay((0).toFixed(decimals) + suffix);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = ref.current;
    if (!el || numeric === null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const start = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = numeric * eased;
            setDisplay(current.toFixed(decimals) + suffix);
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [numeric, duration, decimals, suffix]);

  return (
    <Typography ref={ref} {...typographyProps}>
      {display ?? value}
    </Typography>
  );
};

export default CountUp;
