// @ts-nocheck
import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, Torus } from '@react-three/drei'

function Core() {
  const ref = useRef()

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.1
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.08 + state.pointer.y * 0.035
    ref.current.rotation.z = state.pointer.x * 0.035
  })

  return <group ref={ref}>
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.28}>
      <mesh>
        <dodecahedronGeometry args={[0.88, 1]}/>
        <meshPhysicalMaterial color="#278caa" emissive="#073c57" emissiveIntensity={1.1} roughness={0.2} metalness={0.42} clearcoat={1} clearcoatRoughness={0.12}/>
      </mesh>
      <mesh scale={1.035}>
        <dodecahedronGeometry args={[0.88, 1]}/>
        <meshBasicMaterial color="#a5fff0" wireframe transparent opacity={0.16}/>
      </mesh>
      <mesh>
        <SphereCore/>
      </mesh>
      <Torus args={[1.23, 0.018, 12, 160]} rotation={[1.12, 0.12, 0.3]}>
        <meshBasicMaterial color="#72f0db" transparent opacity={0.8}/>
      </Torus>
      <Torus args={[1.44, 0.012, 10, 160]} rotation={[0.34, 1.05, 0.5]}>
        <meshBasicMaterial color="#a88dff" transparent opacity={0.7}/>
      </Torus>
      <Torus args={[1.62, 0.008, 8, 160]} rotation={[1.3, 0.62, 0.05]}>
        <meshBasicMaterial color="#ffad83" transparent opacity={0.52}/>
      </Torus>
      <SphereDot position={[1.25, 0.18, 0.24]} color="#dcfff8" size={0.055}/>
      <SphereDot position={[-0.9, 0.97, -0.15]} color="#b49cff" size={0.045}/>
    </Float>
  </group>
}

function SphereCore() {
  return <>
    <sphereGeometry args={[0.33, 40, 40]}/>
    <meshPhysicalMaterial color="#a5fff0" emissive="#41cbb8" emissiveIntensity={1.35} roughness={0.1} metalness={0.28} clearcoat={1}/>
  </>
}

function SphereDot({ position, color, size }) {
  return <mesh position={position}>
    <sphereGeometry args={[size, 20, 20]}/>
    <meshBasicMaterial color={color}/>
  </mesh>
}

function Scene() {
  return <>
    <ambientLight intensity={0.45}/>
    <pointLight position={[3, 3, 4]} intensity={32} color="#69f0dc"/>
    <pointLight position={[-3, -2, 2]} intensity={24} color="#806dff"/>
    <pointLight position={[0, -3, -2]} intensity={14} color="#ff9d78"/>
    <Stars radius={36} depth={22} count={420} factor={1.8} saturation={0.25} fade speed={0.3}/>
    <Core/>
  </>
}

export default function OrbitalScene() {
  return <div className="orbital-canvas">
    <Canvas camera={{ position: [0, 0, 5.8], fov: 42 }} dpr={[1, 1.5]}>
      <Scene/>
    </Canvas>
  </div>
}
