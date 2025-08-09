'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { Inter } from 'next/font/google'
import Features from './src/components/features-4'
import HCSShowcase from './src/components/hedera/HCSShowcase'
import SmartContractShowcase from './src/components/hedera/SmartContractShowcase'
import HFSShowcase from './src/components/hedera/HFSShowcase'
import HashScanShowcase from './src/components/hedera/HashScanShowcase'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter'
})

// Minimal 3D scene for fast loading
function MinimalScene() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2
      meshRef.current.rotation.x += delta * 0.1
    }
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 3, 3]} intensity={0.4} />
      
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[3, 1]} />
        <meshStandardMaterial 
          color="#2563eb"
          wireframe={true}
          transparent={true}
          opacity={0.15}
        />
      </mesh>
    </>
  )
}

export default function Component() {
  return (
    <div className={`w-full bg-black text-white ${inter.className}`}>
      {/* Simplified Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Lightweight 3D Background */}
        <div className="absolute inset-0 z-0">
          <Canvas 
            camera={{ position: [8, 8, 8], fov: 45 }} 
            className="w-full h-full"
            style={{ background: 'linear-gradient(135deg, #000000 0%, #0f172a 50%, #000000 100%)' }}
          >
            <MinimalScene />
          </Canvas>
        </div>
        
        {/* Hero Content - Centered and Simplified */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center px-6 max-w-4xl mx-auto">
            
            {/* Simple Brand Badge */}
            <div className="mb-6">
              <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full border border-blue-500/30">
                Production-Ready Hedera Infrastructure
              </span>
            </div>
            
            {/* Smaller, Cleaner Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">
                Enterprise Oracle Platform
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Built on Hedera
              </span>
            </h1>
            
            {/* Simplified Subtitle */}
            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-3xl mx-auto">
              Complete Hedera integration with HCS logging, HFS storage, Smart Contracts and Mirror Node analytics
            </p>
            
            {/* Simple Status Indicators */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <div className="flex items-center bg-gray-900/50 border border-gray-700 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-200">Sub-3s Finality</span>
              </div>
              <div className="flex items-center bg-gray-900/50 border border-gray-700 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-200">99.99% Uptime</span>
              </div>
              <div className="flex items-center bg-gray-900/50 border border-gray-700 px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-200">Low Cost</span>
              </div>
            </div>
            
            {/* Clean CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a 
                href="/oracle-center" 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Launch Oracle Assistant
              </a>
              <a 
                href="/api-explorer" 
                className="w-full sm:w-auto border border-gray-600 hover:border-gray-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
              >
                View API Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Clean Section Spacer */}
      <div className="py-16 bg-gradient-to-b from-black to-gray-950"></div>
      
      {/* Hedera Services */}
      <div className="space-y-16">
        <HCSShowcase />
        <SmartContractShowcase />
        <HFSShowcase />
        <HashScanShowcase />
      </div>
      
      {/* Features Section */}
      <div className="pt-16">
        <div id="features">
          <Features />
        </div>
      </div>
      
      {/* Footer Spacer */}
      <div className="py-16 bg-black"></div>
    </div>
  )
}