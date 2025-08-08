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
    <div className={`w-full bg-black text-white ${merriweather.className} scroll-smooth`}>
      {/* Hero Section */}
      <div className="relative w-full min-h-screen overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-6 md:mb-8">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text text-xs sm:text-sm font-semibold tracking-wider uppercase">
                Production-Ready Hedera Infrastructure
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 max-w-5xl mx-auto bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text leading-tight">
              Enterprise-Grade Oracle Infrastructure Built on Hedera
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl mb-8 md:mb-10 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              The only Oracle platform with complete Hedera service integration - HCS immutable logging, HFS document storage, Smart Contracts & Mirror Node analytics
            </h2>
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center mb-10 md:mb-12 text-sm">
              <div className="flex items-center bg-green-900/30 border border-green-500/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span>Sub-3s Finality</span>
              </div>
              <div className="flex items-center bg-blue-900/30 border border-blue-500/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                <span>99.99% Uptime</span>
              </div>
              <div className="flex items-center bg-purple-900/30 border border-purple-500/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                <span>10x Lower Costs</span>
              </div>
              <div className="flex items-center bg-orange-900/30 border border-orange-500/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                <span>GDPR/HIPAA Ready</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a href="/oracle-center" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 inline-block shadow-xl hover:shadow-2xl transform hover:scale-105">
                Launch Oracle Assistant
              </a>
              <a href="/api-docs" className="w-full sm:w-auto border border-white/30 text-white font-semibold py-4 px-6 rounded-lg hover:bg-white/10 transition-all duration-300 inline-block backdrop-blur-sm">
                View API Documentation
              </a>
            </div>
          </div>
        </div>
        <Canvas shadows camera={{ position: [30, 30, 30], fov: 50 }} className="absolute inset-0">
          <Scene />
        </Canvas>
      </div>
      
      {/* Spacer for visual breathing room */}
      <div className="py-12 md:py-16 bg-gradient-to-b from-black to-gray-900"></div>
      
      {/* Hedera Services Showcase */}
      <div className="space-y-16 md:space-y-24 lg:space-y-32">
        <HCSShowcase />
        <SmartContractShowcase />
        <HFSShowcase />
        <HashScanShowcase />
      </div>
      
      {/* Features Section with improved spacing */}
      <div className="pt-16 md:pt-24 lg:pt-32">
        <div id="features">
          <Features />
        </div>
      </div>
      
      {/* Footer spacer */}
      <div className="py-12 md:py-16 bg-black"></div>
    </div>
  )
}
