// @ts-nocheck
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, Sparkles, Float } from "@react-three/drei";

function Rig({ children }) {
  const ref = useRef();
  useFrame((s, dt) => {
    const g = ref.current; if (!g) return;
    const k = 1 - Math.exp(-3 * Math.min(dt, 0.05));
    g.rotation.y += (s.pointer.x * 0.5 + s.clock.elapsedTime * 0.12 - g.rotation.y) * k;
    g.rotation.x += (-s.pointer.y * 0.2 - g.rotation.x) * k;
  });
  return <group ref={ref}>{children}</group>;
}

/* Education: open book + orbiting graduation discs */
function Campus({ c }) {
  const ring = useRef();
  useFrame((_, dt) => { if (ring.current) ring.current.rotation.y += Math.min(dt, .05) * .6; });
  return <group>
    <Float speed={2} floatIntensity={.6}>
      <RoundedBox args={[1.5, .12, 1.1]} radius={.05} position={[-.78, 0, 0]} rotation={[0, 0, .18]}><meshStandardMaterial color={c[0]} roughness={.35} /></RoundedBox>
      <RoundedBox args={[1.5, .12, 1.1]} radius={.05} position={[.78, 0, 0]} rotation={[0, 0, -.18]}><meshStandardMaterial color={c[1]} roughness={.35} /></RoundedBox>
      <mesh position={[0, .55, 0]}><boxGeometry args={[.9, .06, .9]} /><meshStandardMaterial color={c[2]} metalness={.4} roughness={.3} /></mesh>
      <mesh position={[0, .42, 0]}><cylinderGeometry args={[.28, .32, .22, 32]} /><meshStandardMaterial color={c[2]} metalness={.4} roughness={.3} /></mesh>
    </Float>
    <group ref={ring}>{[0, 1, 2, 3, 4, 5].map(i => { const a = i / 6 * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 2.1, Math.sin(a * 2) * .3, Math.sin(a) * 2.1]}><icosahedronGeometry args={[.13, 0]} /><meshStandardMaterial color={c[i % 3]} emissive={c[i % 3]} emissiveIntensity={.4} /></mesh>; })}</group>
  </group>;
}

/* Startups: rocket + rising growth bars */
function Launch({ c }) {
  const rocket = useRef(); const bars = useRef([]);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (rocket.current) { rocket.current.position.y = .4 + Math.sin(t * 1.4) * .18; rocket.current.rotation.y = t * .8; }
    bars.current.forEach((b, i) => { if (b) { const h = .4 + (Math.sin(t * 1.2 + i * .7) * .5 + .5) * (0.4 + i * .28); b.scale.y = h; b.position.y = -1 + h / 2; } });
  });
  return <group>
    <group ref={rocket} position={[.9, .4, 0]} rotation={[0, 0, -.3]}>
      <mesh><cylinderGeometry args={[.22, .26, 1, 24]} /><meshStandardMaterial color={c[1]} metalness={.5} roughness={.25} /></mesh>
      <mesh position={[0, .7, 0]}><coneGeometry args={[.22, .45, 24]} /><meshStandardMaterial color={c[0]} metalness={.5} roughness={.25} /></mesh>
      <mesh position={[0, -.62, 0]}><coneGeometry args={[.16, .4, 16]} /><meshStandardMaterial color={c[2]} emissive={c[2]} emissiveIntensity={1.4} /></mesh>
    </group>
    {[0, 1, 2, 3, 4].map(i => <mesh key={i} ref={el => bars.current[i] = el} position={[-1.7 + i * .38, -.6, 0]}><boxGeometry args={[.26, 1, .26]} /><meshStandardMaterial color={c[i % 3]} roughness={.4} /></mesh>)}
  </group>;
}

/* Retail: stacking boxes on a turntable + shopping bag */
function Store({ c }) {
  const table = useRef();
  useFrame((_, dt) => { if (table.current) table.current.rotation.y += Math.min(dt, .05) * .5; });
  const boxes = useMemo(() => [[-.6, -.55, .3, .6], [.1, -.55, -.2, .7], [.7, -.55, .3, .5], [-.25, .1, .05, .55], [.45, .05, 0, .45]], []);
  return <group ref={table}>
    <mesh position={[0, -.95, 0]}><cylinderGeometry args={[1.7, 1.8, .14, 48]} /><meshStandardMaterial color="#2a2433" metalness={.3} roughness={.5} /></mesh>
    {boxes.map(([x, y, z, s], i) => <Float key={i} speed={1.5 + i * .2} floatIntensity={.25} rotationIntensity={.2}><RoundedBox args={[s, s, s]} radius={.05} position={[x, y + s / 2 - .3, z]}><meshStandardMaterial color={c[i % 3]} roughness={.4} /></RoundedBox></Float>)}
    <Float speed={2.5} floatIntensity={.8}><group position={[0, 1, 0]}>
      <RoundedBox args={[.6, .7, .3]} radius={.06}><meshStandardMaterial color={c[0]} roughness={.3} metalness={.2} /></RoundedBox>
      <mesh position={[0, .45, 0]}><torusGeometry args={[.16, .03, 12, 32, Math.PI]} /><meshStandardMaterial color={c[2]} /></mesh>
    </group></Float>
  </group>;
}

export default function IndustryScene({ kind, colors, paused }) {
  const S = kind === "edu" ? Campus : kind === "startup" ? Launch : Store;
  return <Canvas className="iw-canvas" dpr={[1, 1.6]} frameloop={paused ? "never" : "always"} camera={{ position: [0, .6, 5.4], fov: 42 }} gl={{ antialias: true, alpha: true }}>
    <ambientLight intensity={.5} />
    <directionalLight position={[3, 4, 3]} intensity={1.4} />
    <pointLight position={[-3, 1, 2]} intensity={8} color={colors[0]} />
    <Environment resolution={64}><Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} /><Lightformer intensity={1} color={colors[1]} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} /></Environment>
    <Rig><S c={colors} /></Rig>
    <Sparkles count={40} scale={[6, 4, 4]} size={2.4} speed={.4} color={colors[0]} />
  </Canvas>;
}
