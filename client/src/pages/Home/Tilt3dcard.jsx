import { useRef, useState } from "react";
import { Box } from "@mui/material";

/**
 * Wraps any card content and applies a real-time 3D tilt based on
 * mouse position inside the card, plus a subtle "shine" highlight
 * that follows the cursor. Pure CSS transform — cheap, no WebGL,
 * safe to use on many cards on the same page.
 *
 * Usage:
 *   <Tilt3DCard>
 *     <Paper>...your existing card content...</Paper>
 *   </Tilt3DCard>
 */   
const Tilt3DCard = ({ children, maxTilt = 10, scale = 1.02, glare = true }) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = x / rect.width; // 0..1
    const py = y / rect.height; // 0..1

    const rotateY = (px - 0.5) * maxTilt * 2;
    const rotateX = -(py - 0.5) * maxTilt * 2;

    setStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
    });

    if (glare) {
      setGlareStyle({
        opacity: 0.5,
        background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.35), transparent 55%)`,
      });
    }
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
    });
    setGlareStyle({ opacity: 0 });
  };

  return (
    <Box
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: "relative",
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
        willChange: "transform",
        ...style,
      }}
    >
      {children}

      {glare && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            transition: "opacity 0.2s ease-out",
            ...glareStyle,
          }}
        />
      )}
    </Box>
  );
};

export default Tilt3DCard;
