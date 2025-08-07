'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Merriweather } from 'next/font/google'
import Features from './src/components/features-4'
import HCSShowcase from './src/components/hedera/HCSShowcase'
import SmartContractShowcase from './src/components/hedera/SmartContractShowcase'
import HFSShowcase from './src/components/hedera/HFSShowcase'
import HashScanShowcase from './src/components/hedera/HashScanShowcase'

const merriweather = Merriweather({ 
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather'
})

function SpinningLogo() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.5, 0.5, 0.5]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[-0.5, -0.5, -0.5]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#999999" />
      </mesh>
    </group>
  )
}


function AnimatedBox({ initialPosition }: { initialPosition: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(...initialPosition))
  const currentPosition = useRef(new THREE.Vector3(...initialPosition))

  const getAdjacentIntersection = (current: THREE.Vector3) => {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]
    const randomDirection = directions[Math.floor(Math.random() * directions.length)]
    return new THREE.Vector3(
      current.x + randomDirection[0] * 3,
      0.5,
      current.z + randomDirection[1] * 3
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newPosition = getAdjacentIntersection(currentPosition.current)
      newPosition.x = Math.max(-15, Math.min(15, newPosition.x))
      newPosition.z = Math.max(-15, Math.min(15, newPosition.z))
      setTargetPosition(newPosition)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useFrame(() => {
    if (meshRef.current) {
      currentPosition.current.lerp(targetPosition, 0.1)
      meshRef.current.position.copy(currentPosition.current)
    }
  })

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ffffff" opacity={0.9} transparent />
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial attach="material" color="#000000" linewidth={2} />
      </lineSegments>
    </mesh>
  )
}

function Scene() {
  const initialPositions: [number, number, number][] = [
    [-9, 0.5, -9],
    [-3, 0.5, -3],
    [0, 0.5, 0],
    [3, 0.5, 3],
    [9, 0.5, 9],
    [-6, 0.5, 6],
    [6, 0.5, -6],
    [-12, 0.5, 0],
    [12, 0.5, 0],
    [0, 0.5, 12],
  ]

  return (
    <>
      <OrbitControls 
        enableZoom={false}
        enablePan={false} 
        enableRotate={false}
        autoRotate={true}
        autoRotateSpeed={1.0}
        target={[0, 0, 0]}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Grid
        renderOrder={-1}
        position={[0, 0, 0]}
        infiniteGrid
        cellSize={1}
        cellThickness={0.5}
        sectionSize={3}
        sectionThickness={1}
        sectionColor="rgb(127, 127, 127)"
        fadeDistance={50}
      />
      {initialPositions.map((position, index) => (
        <AnimatedBox key={index} initialPosition={position} />
      ))}
    </>
  )
}

export default function Component() {
  return (
    <div className={`w-full bg-black text-white ${merriweather.className}`}>
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        <header className="absolute top-0 left-0 right-0 z-10 p-4">
          <nav className="flex justify-between items-center max-w-6xl mx-auto">
            <div className="flex items-center">
              <div className="w-20 h-20">
                <Canvas camera={{ position: [0, 0, 5] }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <SpinningLogo />
                </Canvas>
              </div>
              <span className="text-2xl font-bold">Negravis</span>
            </div>
            <ul className="flex space-x-6">
              <li><a href="/" className="hover:text-gray-300 cursor-pointer">Home</a></li>
              <li><a href="/api-docs" className="hover:text-gray-300 cursor-pointer">API Docs</a></li>
              <li><a href="/hashscan" className="hover:text-gray-300 cursor-pointer">Analytics</a></li>
              <li><a href="/dapp" className="hover:text-gray-300 cursor-pointer">Oracle</a></li>
              <li><a href="https://github.com/Drehalas/Negravis" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 cursor-pointer">GitHub</a></li>
            </ul>
          </nav>
        </header>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
          <div className="mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text text-sm font-semibold tracking-wider uppercase">
              Production-Ready Hedera Infrastructure
            </span>
          </div>
          <h1 className="text-6xl font-bold mb-8 max-w-4xl mx-auto bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
            Enterprise-Grade Oracle Infrastructure Built on Hedera
          </h1>
          <h2 className="text-xl mb-6 text-gray-300 max-w-3xl mx-auto">
            The only Oracle platform with complete Hedera service integration - HCS immutable logging, HFS document storage, Smart Contracts & Mirror Node analytics
          </h2>
          <div className="flex flex-wrap gap-4 justify-center mb-10 text-sm">
            <div className="flex items-center bg-green-900/30 border border-green-500/50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Sub-3s Finality</span>
            </div>
            <div className="flex items-center bg-blue-900/30 border border-blue-500/50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>99.99% Uptime</span>
            </div>
            <div className="flex items-center bg-purple-900/30 border border-purple-500/50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span>10x Lower Costs</span>
            </div>
            <div className="flex items-center bg-orange-900/30 border border-orange-500/50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
              <span>GDPR/HIPAA Ready</span>
            </div>
          </div>
          <div className="flex gap-4 items-center justify-center">
            <a href="/dapp" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-md hover:from-blue-700 hover:to-purple-700 transition duration-300 inline-block shadow-lg">
              Launch Oracle Assistant
            </a>
            <a href="/api-docs" className="border border-white/30 text-white font-semibold py-3 px-6 rounded-md hover:bg-white/10 transition duration-300 inline-block">
              View API Documentation
            </a>
          </div>
        </div>
        <Canvas shadows camera={{ position: [30, 30, 30], fov: 50 }} className="absolute inset-0">
          <Scene />
        </Canvas>
      </div>
      
      {/* Hedera Services Showcase */}
      <HCSShowcase />
      <SmartContractShowcase />
      <HFSShowcase />
      <HashScanShowcase />
      
      {/* Features Section */}
      <div id="features">
        <Features />
      </div>
    </div>
  )
}
