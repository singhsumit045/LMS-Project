import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Image as DreiImage } from "@react-three/drei";
import { Suspense, useRef, useMemo, useState } from "react";
import { Box, useMediaQuery, useTheme as useMuiTheme } from "@mui/material";

// ---------------------------------------------------------
// MouseRig: must live INSIDE <Canvas> — useFrame only works
// on components that are children of Canvas. It lerps `target`
// (raw pointer pos) into `current` (smoothed) every frame.
// ---------------------------------------------------------
function MouseRig({ target, current }) {
  useFrame(() => {
    current.current.x += (target.current.x - current.current.x) * 0.04;
    current.current.y += (target.current.y - current.current.y) * 0.04;
  });
  return null;
}

// ---------------------------------------------------------
// A single glass-like floating shape
// ---------------------------------------------------------
function GlassShape({ position, color, speed = 1, geometry, mouse, scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    meshRef.current.rotation.x += 0.0025 * speed;
    meshRef.current.rotation.y += 0.0035 * speed;

    meshRef.current.rotation.x += (mouse.current.y * 0.35 - meshRef.current.rotation.x) * 0.015;
    meshRef.current.rotation.y += (mouse.current.x * 0.35 - meshRef.current.rotation.y) * 0.015;

    meshRef.current.position.x = position[0] + mouse.current.x * 0.4 + Math.sin(t * 0.3 * speed) * 0.15;
    meshRef.current.position.y = position[1] + mouse.current.y * 0.4 + Math.cos(t * 0.25 * speed) * 0.15;
  });

  return (
    <Float speed={1.4 * speed} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
        {geometry === "torus" && <torusGeometry args={[0.75, 0.28, 32, 100]} />}
        {geometry === "octahedron" && <octahedronGeometry args={[1, 0]} />}
        {geometry === "torusKnot" && <torusKnotGeometry args={[0.6, 0.2, 128, 16]} />}
        {geometry === "sphere" && <sphereGeometry args={[0.9, 32, 32]} />}

        <meshPhysicalMaterial
          color={color}
          roughness={0.08}
          metalness={0.1}
          transmission={0.92}
          thickness={1.4}
          ior={1.4}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.4}
        />
      </mesh>
    </Float>
  );
}
    
// ---------------------------------------------------------
// FloatingImageCard: a real image rendered as a 3D plane.
// Tilts toward the mouse (like a physical card being turned
// in your hand) and lifts/scales up slightly on hover.
// ---------------------------------------------------------
function FloatingImageCard({ src, position, width = 2.6, height = 1.7, mouse }) {
  const groupRef = useRef();
  const imgRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // idle bob
    groupRef.current.position.y = position[1] + Math.sin(t * 0.6) * 0.12;

    // tilt like a card responding to mouse (rotateX/Y toward pointer)
    const targetRotX = -mouse.current.y * 0.25;
    const targetRotY = mouse.current.x * 0.35;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.06;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.06;

    // hover lift + scale
    const targetScale = hovered ? 1.08 : 1;
    groupRef.current.scale.x += (targetScale - groupRef.current.scale.x) * 0.1;
    groupRef.current.scale.y += (targetScale - groupRef.current.scale.y) * 0.1;
    groupRef.current.scale.z += (targetScale - groupRef.current.scale.z) * 0.1;

    if (imgRef.current) {
      imgRef.current.material.radius = 0.12;
      imgRef.current.material.zoom = hovered ? 1.08 : 1;
    }
  });


  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* soft glow plate behind the image for a "floating card" feel */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[width + 0.15, height + 0.15]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>

      <DreiImage
        ref={imgRef}
        url={src}
        scale={[width, height]}
        radius={0.12}
        transparent
        toneMapped={false}
      />
    </group>
  );
}

function Scene({ primary, secondary, isDark, imageSrc }) {
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  const onPointerMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    target.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    target.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const onPointerLeave = () => {
    target.current.x = 0;
    target.current.y = 0;
  };

  const shapes = useMemo(
    () => [
      { position: [-3.6, 1.6, -1], color: primary, speed: 1, geometry: "icosahedron", scale: 0.9 },
      { position: [3.5, -1.2, -1.5], color: secondary, speed: 0.7, geometry: "torus", scale: 0.85 },
      { position: [-2.1, -1.9, -1], color: secondary, speed: 0.9, geometry: "torusKnot", scale: 0.5 },
      { position: [2.6, 1.9, -2], color: primary, speed: 1.2, geometry: "octahedron", scale: 0.6 },
    ],
    [primary, secondary]
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 42 }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
    >
      <fog attach="fog" args={[isDark ? "#0b0f19" : "#f8fbff", 7, 15]} />

      <ambientLight intensity={isDark ? 0.5 : 0.7} />
      <directionalLight position={[5, 6, 5]} intensity={1.1} />
      <pointLight position={[-6, -4, -4]} intensity={0.7} color={secondary} />
      <pointLight position={[6, 4, 4]} intensity={0.6} color={primary} />

      <MouseRig target={target} current={current} />

      <Suspense fallback={null}>
        <Environment preset={isDark ? "night" : "city"} />

        {shapes.map((s, i) => (
          <GlassShape key={i} {...s} mouse={current} />
        ))}

        {imageSrc && (
          <FloatingImageCard src={imageSrc} position={[0, 0.2, 0.5]} mouse={current} />
        )}
      </Suspense>
    </Canvas>
  );
}

// primary/secondary: theme.palette.primary.main / secondary.main
// imageSrc: URL or imported asset (e.g. import dashboardImg from "../assets/dashboard-preview.png")
const Hero3DBackground = ({ primary, secondary, isDark, imageSrc }) => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  if (isMobile) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 1, // above glow blobs, below hero content (zIndex 2)
        pointerEvents: "auto",
        opacity: isDark ? 0.9 : 0.85,
        maskImage: "radial-gradient(ellipse at center, black 55%, transparent 95%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 95%)",
      }}
    >
      <Scene primary={primary} secondary={secondary} isDark={isDark} imageSrc={imageSrc} />
    </Box>
  );
};

export default Hero3DBackground;
