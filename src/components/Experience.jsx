"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Environment, Stars, useGLTF, PerspectiveCamera } from "@react-three/drei"
import { useLocation, useNavigate } from "react-router-dom"
import { gsap } from "gsap"
import * as THREE from "three"
import { useControls } from "leva"
import MouseTrail from "./MouseTrail"
import NavigationDots from "./NavigationDots"

// Preload all models
useGLTF.preload("/models/workspace.glb")
useGLTF.preload("/models/avatar.glb")

export default function Experience({ children }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const cameraRef = useRef()
  const groupRef = useRef()

  // Debug controls (hidden in production)
  const { ambientIntensity, directionalIntensity } = useControls("Lighting", {
    ambientIntensity: { value: 0.5, min: 0, max: 2, step: 0.1 },
    directionalIntensity: { value: 1, min: 0, max: 2, step: 0.1 },
  })

  // Handle camera transitions
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  // Navigation function
  const navigateTo = (path) => {
    if (pathname !== path) {
      // Get current camera position
      const currentPos = new THREE.Vector3()
      cameraRef.current.getWorldPosition(currentPos)

      // Define target positions for each route
      const positions = {
        "/": [0, 0, 10],
        "/projects": [15, 0, 0],
        "/about": [-15, 0, 0],
        "/contact": [0, 10, 0],
      }

      // Animate camera to new position
      gsap.to(cameraRef.current.position, {
        x: positions[path][0],
        y: positions[path][1],
        z: positions[path][2],
        duration: 2,
        ease: "power3.inOut",
        onComplete: () => navigate(path),
      })
    }
  }

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 10]} fov={50} />

      {/* Environment and lighting */}
      <color attach="background" args={["#090b10"]} />
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={directionalIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* Background elements */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Environment map for reflections */}
      <Environment preset="night" />

      {/* Main content group with subtle animation */}
      <group ref={groupRef}>{children}</group>

      {/* Mouse trail effect */}
      <MouseTrail />

      {/* Navigation UI */}
      <NavigationDots currentPath={pathname} navigateTo={navigateTo} />
    </>
  )
}
