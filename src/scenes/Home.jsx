"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, useGLTF, MeshDistortMaterial, Float } from "@react-three/drei"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()
  const sphereRef = useRef()
  const workspaceRef = useRef()

  // Load workspace model
  const { scene: workspaceModel } = useGLTF("/models/workspace.glb")

  // Hover states for navigation screens
  const [hoveredScreen, setHoveredScreen] = useState(null)

  // Animate sphere and workspace
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.1
      sphereRef.current.rotation.z = state.clock.elapsedTime * 0.05
    }

    if (workspaceRef.current) {
      workspaceRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  // Handle navigation
  const handleScreenClick = (path) => {
    navigate(path)
  }

  return (
    <group position={[0, 0, 0]}>
      {/* Workspace environment */}
      <group ref={workspaceRef} scale={[0.8, 0.8, 0.8]} position={[0, -2, 0]}>
        <primitive object={workspaceModel.clone()} />
      </group>

      {/* Floating name sphere */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={sphereRef} position={[0, 1, 0]}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <MeshDistortMaterial
            color="#00ffff"
            attach="material"
            distort={0.3}
            speed={1.5}
            roughness={0}
            metalness={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>

        <Text
          position={[0, 1, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Orbitron-Bold.ttf"
        >
          Jatin Sharma
        </Text>
      </Float>

      {/* Floating navigation screens */}
      <NavigationScreen
        position={[4, 0, 0]}
        rotation={[0, -Math.PI / 4, 0]}
        label="Projects"
        path="/projects"
        isHovered={hoveredScreen === "projects"}
        onHover={() => setHoveredScreen("projects")}
        onUnhover={() => setHoveredScreen(null)}
        onClick={() => handleScreenClick("/projects")}
      />

      <NavigationScreen
        position={[-4, 0, 0]}
        rotation={[0, Math.PI / 4, 0]}
        label="About Me"
        path="/about"
        isHovered={hoveredScreen === "about"}
        onHover={() => setHoveredScreen("about")}
        onUnhover={() => setHoveredScreen(null)}
        onClick={() => handleScreenClick("/about")}
      />

      <NavigationScreen
        position={[0, 3, 0]}
        rotation={[-Math.PI / 8, 0, 0]}
        label="Contact"
        path="/contact"
        isHovered={hoveredScreen === "contact"}
        onHover={() => setHoveredScreen("contact")}
        onUnhover={() => setHoveredScreen(null)}
        onClick={() => handleScreenClick("/contact")}
      />

      {/* Neural grid background */}
      <NeuralGrid />
    </group>
  )
}

function NavigationScreen({ position, rotation, label, isHovered, onHover, onUnhover, onClick }) {
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={position} rotation={rotation}>
        <mesh onPointerOver={onHover} onPointerOut={onUnhover} onClick={onClick}>
          <planeGeometry args={[2, 1.2]} />
          <meshStandardMaterial
            color={isHovered ? "#00ffff" : "#004a4a"}
            emissive={isHovered ? "#00ffff" : "#004a4a"}
            emissiveIntensity={isHovered ? 0.5 : 0.2}
            roughness={0.3}
            metalness={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>

        <Text
          position={[0, 0, 0.01]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Orbitron-Regular.ttf"
        >
          {label}
        </Text>
      </group>
    </Float>
  )
}

function NeuralGrid() {
  const pointsRef = useRef()
  const linesRef = useRef()

  // Create neural grid points
  const pointCount = 100
  const points = new Float32Array(pointCount * 3)
  const colors = new Float32Array(pointCount * 3)

  for (let i = 0; i < pointCount; i++) {
    const i3 = i * 3
    points[i3] = (Math.random() - 0.5) * 30
    points[i3 + 1] = (Math.random() - 0.5) * 30
    points[i3 + 2] = (Math.random() - 0.5) * 30

    colors[i3] = 0
    colors[i3 + 1] = 0.8 + Math.random() * 0.2
    colors[i3 + 2] = 0.8 + Math.random() * 0.2
  }

  // Animate neural grid
  useFrame((state) => {
    if (pointsRef.current && linesRef.current) {
      const time = state.clock.elapsedTime

      // Update points position
      const positions = pointsRef.current.geometry.attributes.position.array

      for (let i = 0; i < pointCount; i++) {
        const i3 = i * 3
        positions[i3 + 1] += Math.sin(time * 0.2 + i * 0.1) * 0.01
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
      linesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={pointCount} array={points} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={pointCount} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.1} vertexColors transparent opacity={0.6} sizeAttenuation />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={pointCount} array={points} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={pointCount} array={colors} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.2} linewidth={1} />
      </lineSegments>
    </group>
  )
}
