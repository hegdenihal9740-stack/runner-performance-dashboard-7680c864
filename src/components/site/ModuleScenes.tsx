// @ts-nocheck
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, Line, Sparkles } from "@react-three/drei";
import { modulePalette } from "./modulePalette";

const clamp = THREE.MathUtils.clamp;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
function easeOutBounce(x) {
  const n1 = 7.5625, d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
}

/* ---------- shared wrappers ---------- */
function Appear({ children }) {
  const ref = useRef();
  const t = useRef(0);
  useFrame((_, dt) => {
    if (!ref.current) return;
    t.current = Math.min(1, t.current + Math.min(dt, 0.05) * 1.4);
    const e = easeOutCubic(t.current);
    ref.current.scale.setScalar(0.5 + 0.5 * e);
    ref.current.rotation.y = (1 - e) * -1.4;
  });
  return <group ref={ref} scale={0.5}>{children}</group>;
}

function Rig({ children }) {
  const ref = useRef();
  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    const k = 1 - Math.exp(-3.5 * Math.min(dt, 0.05));
    g.rotation.y += (state.pointer.x * 0.4 - g.rotation.y) * k;
    g.rotation.x += (-state.pointer.y * 0.18 - g.rotation.x) * k;
  });
  return <group ref={ref}>{children}</group>;
}

/* ---------- 0 · Sales & CRM — pipeline funnel ---------- */
const funnelR = (y) => THREE.MathUtils.lerp(1.45, 0.26, Math.pow(clamp((1.4 - y) / 2.6, 0, 1), 0.75));
function CRMScene({ p }) {
  const lathe = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 28; i++) { const y = 1.4 - (2.6 * i) / 28; pts.push(new THREE.Vector2(funnelR(y), y)); }
    return new THREE.LatheGeometry(pts, 72);
  }, []);
  const N = 28;
  const leads = useRef([]);
  const won = useRef();
  const ca = useMemo(() => new THREE.Color(p.a), [p]);
  const cb = useMemo(() => new THREE.Color(p.b), [p]);
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    leads.current.forEach((m, i) => {
      if (!m) return;
      const off = i / N;
      const t = (time * 0.085 + off) % 1;
      const y = 1.75 - 3.2 * t;
      const r = y > 1.4 ? funnelR(1.4) * 0.92 : y < -1.2 ? 0.04 : funnelR(y) * 0.8;
      const ang = off * Math.PI * 6 + t * Math.PI * 5;
      m.position.set(Math.cos(ang) * r, y, Math.sin(ang) * r);
      const s = t > 0.9 ? (1 - t) / 0.1 : Math.min(1, t / 0.06);
      m.scale.setScalar(0.075 * s + 0.0001);
      m.material.color.copy(ca).lerp(cb, t);
      m.material.emissive.copy(m.material.color).multiplyScalar(0.35);
    });
    if (won.current) { won.current.rotation.y = time * 1.6; won.current.position.y = -1.78 + Math.sin(time * 2) * 0.06; }
  });
  return (
    <group position={[0, 0.2, 0]} rotation={[0.2, 0, 0]}>
      <mesh geometry={lathe}>
        <meshPhysicalMaterial color={p.a} transparent opacity={0.14} roughness={0.08} metalness={0.3} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh geometry={lathe}><meshBasicMaterial color={p.a} wireframe transparent opacity={0.07} /></mesh>
      {[1.4, 0.75, 0.1, -0.55, -1.2].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[funnelR(y), i === 0 ? 0.024 : 0.013, 12, 120]} />
          <meshBasicMaterial color={i % 2 ? p.b : p.a} transparent opacity={0.9} />
        </mesh>
      ))}
      {Array.from({ length: N }).map((_, i) => (
        <mesh key={i} ref={(el) => (leads.current[i] = el)}>
          <sphereGeometry args={[1, 18, 18]} />
          <meshStandardMaterial roughness={0.25} metalness={0.3} />
        </mesh>
      ))}
      <group ref={won} position={[0, -1.78, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.08, 56]} />
          <meshStandardMaterial color={p.b} metalness={0.95} roughness={0.18} emissive={p.b} emissiveIntensity={0.25} />
        </mesh>
        <mesh><torusGeometry args={[0.27, 0.02, 10, 56]} /><meshStandardMaterial color="#fff3df" metalness={1} roughness={0.2} /></mesh>
      </group>
    </group>
  );
}

/* ---------- 1 · Inventory — smart warehouse ---------- */
function InventoryScene({ p }) {
  const slots = useMemo(() => {
    const s = [];
    for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) s.push([(col - 1) * 0.82, -0.98 + row * 0.8, 0]);
    return s;
  }, []);
  const crates = useRef([]);
  const lowMat = useRef();
  const scanner = useRef();
  const colors = [p.a, "#e9dccf", p.c, "#e9dccf", p.a, p.b, p.c, "#e9dccf", p.a];
  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const local = time % 8;
    crates.current.forEach((m, i) => {
      if (!m) return;
      const t = clamp((local - i * 0.3) / 0.75, 0, 1);
      const out = clamp((local - 7.2) / 0.6, 0, 1);
      const [x, y, z] = slots[i];
      m.position.set(x, y + (1 - easeOutBounce(t)) * 2.6, z);
      m.scale.setScalar(Math.max(0.001, (t > 0 ? 1 : 0) * (1 - out)));
    });
    if (lowMat.current) lowMat.current.emissiveIntensity = 0.4 + Math.sin(time * 5) * 0.35;
    if (scanner.current) scanner.current.position.y = Math.sin(time * 0.9) * 1.05;
  });
  return (
    <group rotation={[0.22, -0.55, 0]} position={[0, 0.05, 0]}>
      <gridHelper args={[7, 14, p.a, "#3b2d4a"]} position={[0, -1.32, 0]} />
      {[-0.98, -0.18, 0.62].map((y, r) => (
        <mesh key={r} position={[0, y - 0.31, 0]}>
          <boxGeometry args={[2.7, 0.05, 0.86]} />
          <meshStandardMaterial color="#3a2b45" metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
      {[-1.36, 1.36].map((x) => [-0.4, 0.4].map((z) => (
        <mesh key={`${x}${z}`} position={[x, -0.1, z]}>
          <boxGeometry args={[0.06, 2.5, 0.06]} />
          <meshStandardMaterial color={p.c} metalness={0.8} roughness={0.3} />
        </mesh>
      )))}
      {slots.map((_, i) => (
        <group key={i} ref={(el) => (crates.current[i] = el)}>
          <RoundedBox args={[0.64, 0.54, 0.64]} radius={0.06} smoothness={3}>
            {i === 5
              ? <meshStandardMaterial ref={lowMat} color={p.b} emissive={p.b} emissiveIntensity={0.5} roughness={0.4} />
              : <meshStandardMaterial color={colors[i]} roughness={0.45} metalness={0.1} />}
          </RoundedBox>
          <mesh position={[0, 0, 0.325]}><planeGeometry args={[0.3, 0.12]} /><meshBasicMaterial color="#1b1424" transparent opacity={0.55} /></mesh>
        </group>
      ))}
      <mesh ref={scanner} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.75, 0.012, 8, 120]} />
        <meshBasicMaterial color={p.a} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

/* ---------- 2 · Marketing — broadcast engine ---------- */
function MarketingScene({ p }) {
  const rings = useRef([]);
  const parts = useRef([]);
  const horn = useRef();
  const N = 44;
  const seeds = useMemo(() => Array.from({ length: N }, (_, i) => ({ th: (i * 2.399) % (Math.PI * 2), sp: 0.6 + ((i * 37) % 10) / 12, off: (i * 0.618) % 1, spread: 0.2 + ((i * 13) % 10) / 18 })), []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    rings.current.forEach((m, i) => {
      if (!m) return;
      const k = (t * 0.32 + i / 4) % 1;
      m.scale.setScalar(0.5 + k * 2.4);
      m.position.x = 0.15 + k * 1.5;
      m.material.opacity = (1 - k) * 0.85;
    });
    parts.current.forEach((m, i) => {
      if (!m) return;
      const s = seeds[i];
      const k = (t * 0.22 * s.sp + s.off) % 1;
      const d = 0.3 + k * 3;
      m.position.set(0.1 + d, Math.sin(s.th) * s.spread * d, Math.cos(s.th) * s.spread * d);
      m.scale.setScalar(0.06 * (1 - k) + 0.004);
      m.rotation.set(t * 2 + i, t + i, 0);
    });
    if (horn.current) { horn.current.rotation.z = Math.sin(t * 1.2) * 0.06; horn.current.scale.setScalar(1 + Math.max(0, Math.sin(t * 2.4)) * 0.03); }
  });
  return (
    <group rotation={[0.15, -0.55, 0]} position={[-0.55, 0, 0]}>
      <group ref={horn}>
        <mesh position={[-0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.72, 1.3, 64, 1, true]} />
          <meshPhysicalMaterial color={p.c} metalness={0.5} roughness={0.22} clearcoat={1} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.3, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.72, 0.05, 16, 72]} />
          <meshStandardMaterial color={p.b} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-1.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.36, 32]} />
          <meshStandardMaterial color={p.b} metalness={0.8} roughness={0.25} />
        </mesh>
        <RoundedBox args={[0.18, 0.6, 0.2]} radius={0.06} position={[-0.75, -0.42, 0]} rotation={[0, 0, -0.25]}>
          <meshStandardMaterial color="#2b2036" roughness={0.5} />
        </RoundedBox>
      </group>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} ref={(el) => (rings.current[i] = el)} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.6, 0.012, 8, 96]} />
          <meshBasicMaterial color={i % 2 ? p.b : p.a} transparent opacity={0.8} />
        </mesh>
      ))}
      {seeds.map((_, i) => (
        <mesh key={i} ref={(el) => (parts.current[i] = el)}>
          {i % 3 === 0 ? <octahedronGeometry args={[1, 0]} /> : i % 3 === 1 ? <sphereGeometry args={[1, 12, 12]} /> : <boxGeometry args={[1.2, 1.2, 1.2]} />}
          <meshStandardMaterial color={i % 2 ? p.a : p.b} emissive={i % 2 ? p.a : p.b} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- 3 · Human Resources — team constellation ---------- */
function Person({ color, scale = 1, head = "#f3d9c4" }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.44, 0]}><sphereGeometry args={[0.19, 32, 32]} /><meshStandardMaterial color={head} roughness={0.5} /></mesh>
      <mesh><capsuleGeometry args={[0.2, 0.28, 8, 20]} /><meshPhysicalMaterial color={color} roughness={0.3} metalness={0.15} clearcoat={0.6} /></mesh>
    </group>
  );
}
function HRScene({ p }) {
  const ring = useRef();
  const people = useRef([]);
  const pulses = useRef([]);
  const team = [p.a, p.b, "#5ee6d6", "#ff9fc4", "#6ee7a8", "#ffb27a", "#bf9bff"];
  const heads = ["#f3d9c4", "#d9a982", "#f6e1cf", "#b88462", "#ecc8a8", "#8d5f45", "#f3d9c4"];
  const R = 1.6;
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ring.current) ring.current.rotation.y = t * 0.22;
    people.current.forEach((m, i) => { if (m) m.position.y = Math.sin(t * 1.6 + i) * 0.09; });
    pulses.current.forEach((m, i) => {
      if (!m) return;
      const a = (i / team.length) * Math.PI * 2;
      const k = (t * 0.45 + i / team.length) % 1;
      m.position.set(Math.cos(a) * R * (1 - k), 0.12, Math.sin(a) * R * (1 - k));
      m.scale.setScalar(0.05 * Math.sin(k * Math.PI) + 0.001);
    });
  });
  return (
    <group position={[0, -0.25, 0]} rotation={[0.32, 0, 0]}>
      <mesh position={[0, -0.6, 0]}><cylinderGeometry args={[0.55, 0.62, 0.12, 48]} /><meshStandardMaterial color={p.c} metalness={0.6} roughness={0.3} /></mesh>
      <Person color={p.c} scale={1.3} head="#ffe1c8" />
      <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[R - 0.015, R + 0.015, 120]} />
        <meshBasicMaterial color={p.a} transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>
      <group ref={ring}>
        {team.map((c, i) => {
          const a = (i / team.length) * Math.PI * 2;
          const x = Math.cos(a) * R, z = Math.sin(a) * R;
          return (
            <group key={i}>
              <group position={[x, 0, z]}>
                <group ref={(el) => (people.current[i] = el)}><Person color={c} scale={0.72} head={heads[i]} /></group>
              </group>
              <Line points={[[x, 0.1, z], [0, 0.12, 0]]} color={c} lineWidth={1.2} transparent opacity={0.45} />
              <mesh ref={(el) => (pulses.current[i] = el)}><sphereGeometry args={[1, 12, 12]} /><meshBasicMaterial color={c} /></mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

/* ---------- 4 · Finance — growth vault ---------- */
function FinanceScene({ p }) {
  const heights = [0.55, 0.85, 0.7, 1.15, 1.0, 1.5, 1.95];
  const bars = useRef([]);
  const coin = useRef();
  const cols = useMemo(() => heights.map((_, i) => new THREE.Color(p.c).lerp(new THREE.Color(p.a), i / (heights.length - 1))), [p]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const cyc = (t % 7) / 7;
    bars.current.forEach((m, i) => {
      if (!m) return;
      const k = easeOutCubic(clamp(cyc * 4 - i * 0.22, 0, 1));
      const fade = cyc > 0.9 ? 1 - ((cyc - 0.9) / 0.1) * 0.85 : 1;
      const h = Math.max(0.04, heights[i] * k * fade);
      m.scale.y = h;
      m.position.y = -1.15 + h / 2;
    });
    if (coin.current) { coin.current.rotation.y = t * 2.2; coin.current.position.y = 0.55 + Math.sin(t * 1.8) * 0.12; }
  });
  return (
    <group rotation={[0.2, -0.4, 0]} position={[-0.15, 0.1, 0]}>
      <gridHelper args={[6, 12, p.a, "#33283f"]} position={[0, -1.16, 0]} />
      {heights.map((_, i) => (
        <mesh key={i} ref={(el) => (bars.current[i] = el)} position={[-1.55 + i * 0.4, -1, 0]}>
          <boxGeometry args={[0.28, 1, 0.28]} />
          <meshPhysicalMaterial color={cols[i]} roughness={0.2} metalness={0.25} clearcoat={1} emissive={cols[i]} emissiveIntensity={0.12} />
        </mesh>
      ))}
      <Line points={heights.map((h, i) => [-1.55 + i * 0.4, -1.15 + h + 0.18, 0])} color={p.b} lineWidth={1.6} dashed dashSize={0.08} gapSize={0.05} />
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[1.55 + (i % 2) * 0.02, -1.11 + i * 0.075, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.07, 48]} />
          <meshStandardMaterial color={p.b} metalness={0.95} roughness={0.22} />
        </mesh>
      ))}
      <group ref={coin} position={[1.55, 0.55, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.07, 56]} />
          <meshStandardMaterial color={p.b} metalness={1} roughness={0.15} emissive={p.b} emissiveIntensity={0.2} />
        </mesh>
        <mesh><torusGeometry args={[0.28, 0.022, 10, 56]} /><meshStandardMaterial color="#fff2d6" metalness={1} roughness={0.2} /></mesh>
      </group>
    </group>
  );
}

/* ---------- 5 · Logistics — route globe ---------- */
function latLon(lat, lon, r) {
  const phi = ((90 - lat) * Math.PI) / 180, th = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}
function LogisticsScene({ p }) {
  const R = 1.25;
  const routes = useMemo(() => {
    const pairs = [[[12.9, 77.6], [25.2, 55.3]], [[19.0, 72.8], [1.35, 103.8]], [[12.9, 74.8], [51.5, -0.1]], [[28.6, 77.2], [35.7, 139.7]], [[-33.9, 151.2], [12.9, 77.6]]];
    return pairs.map(([a, b]) => {
      const s = latLon(a[0], a[1], R), e = latLon(b[0], b[1], R);
      const mid = s.clone().add(e).normalize().multiplyScalar(R + s.distanceTo(e) * 0.45);
      const curve = new THREE.QuadraticBezierCurve3(s, mid, e);
      return { curve, geo: new THREE.TubeGeometry(curve, 64, 0.009, 8, false), s, e };
    });
  }, []);
  const globe = useRef();
  const pkgs = useRef([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (globe.current) globe.current.rotation.y = Math.PI + 0.25 + Math.sin(t * 0.18) * 0.55;
    pkgs.current.forEach((m, i) => {
      if (!m) return;
      const k = (t * 0.16 + i * 0.23) % 1;
      const pos = routes[i].curve.getPoint(k);
      m.position.copy(pos);
      m.lookAt(routes[i].curve.getPoint(Math.min(1, k + 0.01)));
      m.scale.setScalar(Math.sin(k * Math.PI) * 0.9 + 0.1);
    });
  });
  return (
    <group rotation={[0.35, 0, 0.12]}>
      <group ref={globe}>
        <mesh><sphereGeometry args={[R, 64, 64]} /><meshPhysicalMaterial color="#20162e" roughness={0.6} metalness={0.3} clearcoat={0.4} emissive={p.c} emissiveIntensity={0.08} /></mesh>
        <mesh><icosahedronGeometry args={[R * 1.006, 4]} /><meshBasicMaterial color={p.a} wireframe transparent opacity={0.13} /></mesh>
        {routes.map((r, i) => (
          <group key={i}>
            <mesh geometry={r.geo}><meshBasicMaterial color={i % 2 ? p.b : p.a} transparent opacity={0.9} /></mesh>
            {[r.s, r.e].map((v, j) => <mesh key={j} position={v}><sphereGeometry args={[0.035, 12, 12]} /><meshBasicMaterial color={p.b} /></mesh>)}
            <mesh ref={(el) => (pkgs.current[i] = el)}>
              <boxGeometry args={[0.09, 0.07, 0.13]} />
              <meshStandardMaterial color={p.a} emissive={p.a} emissiveIntensity={0.6} />
            </mesh>
          </group>
        ))}
      </group>
      <mesh rotation={[Math.PI / 2.3, 0, 0]}><torusGeometry args={[1.75, 0.008, 8, 160]} /><meshBasicMaterial color={p.b} transparent opacity={0.55} /></mesh>
    </group>
  );
}

/* ---------- 6 · Documents — living library ---------- */
function Sheet({ accent, header }) {
  return (
    <group>
      <RoundedBox args={[1.25, 1.65, 0.025]} radius={0.02} smoothness={2}>
        <meshStandardMaterial color="#f8f2ea" roughness={0.7} />
      </RoundedBox>
      <mesh position={[-0.2, 0.62, 0.016]}><boxGeometry args={[0.6, 0.1, 0.005]} /><meshBasicMaterial color={header} /></mesh>
      {[0.36, 0.22, 0.08, -0.06, -0.2, -0.34].map((y, i) => (
        <mesh key={i} position={[i % 3 === 2 ? -0.13 : 0, y, 0.016]}><boxGeometry args={[i % 3 === 2 ? 0.7 : 0.95, 0.035, 0.004]} /><meshBasicMaterial color="#cdc2d6" /></mesh>
      ))}
      <mesh position={[0.32, -0.6, 0.016]}><circleGeometry args={[0.1, 24]} /><meshBasicMaterial color={accent} /></mesh>
    </group>
  );
}
function DocumentsScene({ p }) {
  const N = 5;
  const sheets = useRef([]);
  const flyer = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const fan = (Math.sin(t * 0.8) + 1) / 2;
    sheets.current.forEach((m, i) => {
      if (!m) return;
      const k = i - (N - 1) / 2;
      m.rotation.z = -k * 0.17 * fan;
      m.position.set(k * 0.34 * fan, -Math.abs(k) * 0.07 * fan - 0.1, i * 0.04);
    });
    if (flyer.current) {
      const c = (t % 4.5) / 4.5;
      flyer.current.position.set(0.9 * c, -0.1 + c * 1.6, 0.4 + c * 0.6);
      flyer.current.rotation.set(-0.3 * c, c * Math.PI * 2, 0.4 * c);
      flyer.current.scale.setScalar(Math.max(0.001, 0.7 * (1 - c)));
    }
  });
  return (
    <group rotation={[0.12, -0.35, 0]} position={[0, 0.05, 0]}>
      <RoundedBox args={[2.1, 1.75, 0.08]} radius={0.06} position={[0, -0.2, -0.32]}>
        <meshPhysicalMaterial color={p.c} roughness={0.35} metalness={0.2} clearcoat={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.8, 0.22, 0.08]} radius={0.05} position={[-0.6, 0.72, -0.32]}>
        <meshPhysicalMaterial color={p.c} roughness={0.35} metalness={0.2} clearcoat={0.8} />
      </RoundedBox>
      {Array.from({ length: N }).map((_, i) => (
        <group key={i} ref={(el) => (sheets.current[i] = el)}>
          <Sheet accent={i % 2 ? p.a : p.b} header={i % 2 ? p.b : p.a} />
        </group>
      ))}
      <group ref={flyer}><Sheet accent={p.b} header={p.a} /></group>
    </group>
  );
}

/* ---------- 7 · Compliance — trust shield ---------- */
function ComplianceScene({ p }) {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 1.05);
    s.bezierCurveTo(0.35, 0.86, 0.68, 0.86, 0.85, 0.8);
    s.lineTo(0.85, 0.1);
    s.bezierCurveTo(0.85, -0.5, 0.4, -0.86, 0, -1.12);
    s.bezierCurveTo(-0.4, -0.86, -0.85, -0.5, -0.85, 0.1);
    s.lineTo(-0.85, 0.8);
    s.bezierCurveTo(-0.68, 0.86, -0.35, 0.86, 0, 1.05);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 6, curveSegments: 40 });
    g.center();
    return g;
  }, []);
  const check = useMemo(() => {
    const path = new THREE.CurvePath();
    path.add(new THREE.LineCurve3(new THREE.Vector3(-0.32, 0.02, 0), new THREE.Vector3(-0.08, -0.24, 0)));
    path.add(new THREE.LineCurve3(new THREE.Vector3(-0.08, -0.24, 0), new THREE.Vector3(0.38, 0.32, 0)));
    return new THREE.TubeGeometry(path, 40, 0.065, 12, false);
  }, []);
  const shield = useRef(), g1 = useRef(), g2 = useRef(), scan = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (shield.current) { shield.current.rotation.y = Math.sin(t * 0.7) * 0.4; shield.current.position.y = Math.sin(t * 1.3) * 0.06; }
    if (g1.current) { g1.current.rotation.x = t * 0.6; g1.current.rotation.y = t * 0.3; }
    if (g2.current) { g2.current.rotation.y = -t * 0.5; g2.current.rotation.z = t * 0.25; }
    if (scan.current) { const k = (Math.sin(t * 1.4) + 1) / 2; scan.current.position.y = -1 + k * 2; scan.current.material.opacity = 0.25 + Math.sin(k * Math.PI) * 0.45; }
  });
  return (
    <group>
      <group ref={shield}>
        <mesh geometry={geo}><meshPhysicalMaterial color={p.c} metalness={0.55} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} /></mesh>
        <mesh geometry={geo} scale={[0.8, 0.8, 0.6]} position={[0, 0.02, 0.12]}><meshPhysicalMaterial color="#251a35" metalness={0.4} roughness={0.35} /></mesh>
        <mesh geometry={check} position={[0, 0.05, 0.24]}><meshStandardMaterial color={p.b} emissive={p.b} emissiveIntensity={0.7} /></mesh>
        <mesh ref={scan} position={[0, 0, 0.3]}><planeGeometry args={[2, 0.05]} /><meshBasicMaterial color={p.a} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      </group>
      <group ref={g1}>
        <mesh><torusGeometry args={[1.5, 0.014, 8, 160]} /><meshBasicMaterial color={p.a} transparent opacity={0.75} /></mesh>
        <mesh position={[1.5, 0, 0]}><sphereGeometry args={[0.06, 16, 16]} /><meshBasicMaterial color={p.b} /></mesh>
      </group>
      <group ref={g2}>
        <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.72, 0.01, 8, 160]} /><meshBasicMaterial color={p.b} transparent opacity={0.6} /></mesh>
        <mesh position={[0, 0, 1.72]}><sphereGeometry args={[0.05, 16, 16]} /><meshBasicMaterial color={p.a} /></mesh>
      </group>
    </group>
  );
}

const SCENES = [CRMScene, InventoryScene, MarketingScene, HRScene, FinanceScene, LogisticsScene, DocumentsScene, ComplianceScene];

export default function ModuleScene({ index = 0, paused = false, className = "", sparkles = true, distance = 6 }) {
  const p = modulePalette[index] || modulePalette[0];
  const Scene = SCENES[index] || CRMScene;
  return (
    <div className={className} data-scene-ready="true">
      <Canvas camera={{ position: [0, 0.35, distance], fov: 38 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} frameloop={paused ? "never" : "always"}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} />
        <pointLight position={[-3, 1, 3]} intensity={18} color={p.a} />
        <pointLight position={[3, -2, 2]} intensity={12} color={p.b} />
        <Environment resolution={64}>
          <Lightformer intensity={2} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
          <Lightformer intensity={1.3} color={p.a} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
          <Lightformer intensity={1.3} color={p.b} position={[5, 0, 1]} rotation-y={-Math.PI / 2} scale={[20, 1, 1]} />
        </Environment>
        {sparkles && <Sparkles count={36} scale={[7, 4, 3]} size={2.2} speed={0.3} color={p.a} opacity={0.6} />}
        <Rig>
          <Appear key={index}><Scene p={p} /></Appear>
        </Rig>
      </Canvas>
    </div>
  );
}
