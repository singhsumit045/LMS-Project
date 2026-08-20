import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

/**
 * Fades + slides in its children when they scroll into view.
 * Uses IntersectionObserver — cheap, runs once per element by default.
 *
 * Usage:
 *   <Reveal delay={0.1}>
 *     <Paper>...</Paper>
 *   </Reveal>
 */
const Reveal = ({ children, delay = 0, y = 24, once = true, sx = {} }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default Reveal;
