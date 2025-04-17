"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, useGLTF, Html, Float } from "@react-three/drei"
import * as THREE from "three"

export default function About() {
  const [activeSection, setActiveSection] = useState(null)

  // Load avatar model
  const { scene: avatarModel } = useGLTF("/models/avatar.glb")

  // About me data
  const aboutData = {
    journey: {
      title: "Developer Journey",
      content:
        "Started coding at 16, pursued B.Tech in Computer Science and Engineering. Passionate about creating innovative solutions that combine technology and creativity.",
    },
    skills: {
      title: "Tech Skills",
      content: "React, Three.js, Flask, TensorFlow, PyTorch, UI/UX Design, AI/ML, Swin Transformer",
    },
    aiml: {
      title: "AI/ML Passion",
      content:
        "Fascinated by the potential of AI to solve complex problems. Worked on sentiment analysis, cancer cell detection, and cognitive fatigue detection projects.",
    },
    hobbies: {
      title: "Hobbies",
      content: "Sketching, painting, exploring new technologies, and contributing to open-source projects.",
    },
  }

  return (
    <group position={[-15, 0, 0]}>
      <Text
        position={[0, 3, 0]}
        fontSize={0.8}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Orbitron-Bold.ttf"
      >
        About Me
      </Text>

      {/* 3D Avatar */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group position={[0, 0, 0]} scale={[1, 1, 1]}>
          <primitive object={avatarModel.clone()} />
        </group>
      </Float>

      {/* Floating Dev Desk */}
      <FloatingDesk position={[0, -2, 0]} />

      {/* Clickable Holograms */}
      <HologramButton
        position={[-3, 1, 0]}
        label="Journey"
        isActive={activeSection === "journey"}
        onClick={() => setActiveSection(activeSection === "journey" ? null : "journey")}
        data={aboutData.journey}
      />

      <HologramButton
        position={[-1, 1, 0]}
        label="Skills"
        isActive={activeSection === "skills"}
        onClick={() => setActiveSection(activeSection === "skills" ? null : "skills")}
        data={aboutData.skills}
      />

      <HologramButton
        position={[1, 1, 0]}
        label="AI/ML"
        isActive={activeSection === "aiml"}
        onClick={() => setActiveSection(activeSection === "aiml" ? null : "aiml")}
        data={aboutData.aiml}
      />

      <HologramButton
        position={[3, 1, 0]}
        label="Hobbies"
        isActive={activeSection === "hobbies"}
        onClick={() => setActiveSection(activeSection === "hobbies" ? null : "hobbies")}
        data={aboutData.hobbies}
      />

      {/* Neural Network Visualization for AI/ML section */}
      {activeSection === "aiml" && <NeuralNetwork position={[0, -1, 2]} />}

      {/* Floating sketch frames for Hobbies section */}
      {activeSection === "hobbies" && <SketchFrames position={[0, -1, 2]} />}
    </group>
  )
}

function FloatingDesk({ position }) {
  const deskRef = useRef()

  // Animate desk
  useFrame((state) => {
    if (deskRef.current) {
      deskRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
      deskRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={deskRef} position={position}>
      <mesh>
        <boxGeometry args={[4, 0.1, 2]} />
        <meshStandardMaterial
          color="#004a4a"
          emissive="#004a4a"
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Desk items */}
      <mesh position={[-1, 0.1, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.5]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      <mesh position={[1, 0.1, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.3, 16]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  )
}

function HologramButton({ position, label, isActive, onClick, data }) {
  const buttonRef = useRef()
  const [isHovered, setIsHovered] = useState(false)

  // Animate button
  useFrame((state) => {
    if (buttonRef.current) {
      // Pulse effect
      const scale = isActive || isHovered ? 1.1 : 1
      buttonRef.current.scale.x = THREE.MathUtils.lerp(buttonRef.current.scale.x, scale, 0.1)
      buttonRef.current.scale.y = THREE.MathUtils.lerp(buttonRef.current.scale.y, scale, 0.1)
      buttonRef.current.scale.z = THREE.MathUtils.lerp(buttonRef.current.scale.z, scale, 0.1)

      // Rotation for active state
      if (isActive) {
        buttonRef.current.rotation.y += 0.01
      } else {
        buttonRef.current.rotation.y = THREE.MathUtils.lerp(buttonRef.current.rotation.y, 0, 0.1)
      }
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={buttonRef}
        onClick={onClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={isActive ? "#00ffff" : "#004a4a"}
          emissive={isActive ? "#00ffff" : "#004a4a"}
          emissiveIntensity={isActive ? 0.5 : 0.2}
          roughness={0.3}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      <Text
        position={[0, -0.8, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Orbitron-Regular.ttf"
      >
        {label}
      </Text>

      {isActive && (
        <Html position={[0, 2, 0]} transform>
          <div
            style={{
              width: "300px",
              padding: "20px",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              border: "1px solid #00ffff",
              borderRadius: "10px",
              color: "white",
              fontFamily: "Roboto Mono, monospace",
              transform: "translateX(-50%)",
              boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
            }}
          >
            <h3
              style={{
                color: "#00ffff",
                marginBottom: "10px",
                fontFamily: "Orbitron, sans-serif",
              }}
            >
              {data.title}
            </h3>
            <p>{data.content}</p>
          </div>
        </Html>
      )}
    </group>
  )
}

function NeuralNetwork({ position }) {
  const networkRef = useRef()

  // Create neural network nodes and connections
  const nodeCount = 20
  const nodes = []
  const connections = []

  for (let i = 0; i < nodeCount; i++) {
    const x = (Math.random() - 0.5) * 4
    const y = (Math.random() - 0.5) * 4
    const z = (Math.random() - 0.5) * 2
    nodes.push({ position: [x, y, z] })

    // Create random connections
    for (let j = 0; j < 2; j++) {
      const targetIndex = Math.floor(Math.random() * nodeCount)
      if (targetIndex !== i) {
        connections.push({
          start: i,
          end: targetIndex,
        })
      }
    }
  }

  // Animate neural network
  useFrame((state) => {
    if (networkRef.current) {
      networkRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={networkRef} position={position}>
      {nodes.map((node, index) => (
        <mesh key={`node-${index}`} position={node.position}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {connections.map((connection, index) => {
        const start = nodes[connection.start].position
        const end = nodes[connection.end].position

        // Calculate midpoint and direction
        const midX = (start[0] + end[0]) / 2
        const midY = (start[1] + end[1]) / 2
        const midZ = (start[2] + end[2]) / 2

        // Calculate length and orientation
        const direction = new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2])
        const length = direction.length()

        return (
          <mesh
            key={`connection-${index}`}
            position={[midX, midY, midZ]}
            scale={[0.02, 0.02, length]}
            lookAt={new THREE.Vector3(end[0], end[1], end[2])}
          >
            <cylinderGeometry args={[1, 1, 1, 8]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
          </mesh>
        )
      })}
    </group>
  )
}

function SketchFrames({ position }) {
  const framesRef = useRef()

  // Animate frames
  useFrame((state) => {
    if (framesRef.current) {
      framesRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={framesRef} position={position}>
      {[-1.5, 0, 1.5].map((x, index) => (
        <Float key={index} speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh position={[x, 0, 0]}>
            <planeGeometry args={[1.2, 1.6]} />
            <meshStandardMaterial color="white" roughness={0.3} metalness={0.2} />
          </mesh>

          <mesh position={[x, 0, 0.01]}>
            <planeGeometry args={[1, 1.4]} />
            <meshBasicMaterial color={`hsl(${index * 60}, 70%, 60%)`} />
          </mesh>

          <Text
            position={[x, -0.9, 0.02]}
            fontSize={0.1}
            color="black"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Roboto-Regular.ttf"
          >
            {["Sketch", "Painting", "Design"][index]}
          </Text>
        </Float>
      ))}
    </group>
  )
}
