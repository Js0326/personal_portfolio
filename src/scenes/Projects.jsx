"use client"

import { useState, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Float, useTexture } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

// Project data
const projects = [
  {
    id: 1,
    title: "Sentilyze",
    description: "Sentiment analysis tool using AI to analyze text emotions",
    techStack: ["Flask", "React", "TensorFlow"],
    github: "https://github.com/Js0326/sentilyze",
    demo: "https://sentilyze-demo.vercel.app",
  },
  {
    id: 2,
    title: "Cancer Cell Detection",
    description: "AI-powered cancer cell detection using Swin Transformer",
    techStack: ["Python", "PyTorch", "Swin Transformer"],
    github: "https://github.com/Js0326/cancer-detection",
    demo: "#",
  },
  {
    id: 3,
    title: "Cognitive Fatigue Detection",
    description: "Real-time cognitive fatigue detection system for drivers",
    techStack: ["OpenCV", "TensorFlow", "React Native"],
    github: "https://github.com/Js0326/cognitive-fatigue",
    demo: "#",
  },
  {
    id: 4,
    title: "Interactive 3D Portfolio",
    description: "This immersive 3D portfolio website built with React Three Fiber",
    techStack: ["React", "Three.js", "GSAP"],
    github: "https://github.com/Js0326/jatin-3d-portfolio",
    demo: "https://js0326.github.io/jatin-3d-portfolio",
  },
]

export default function Projects() {
  const [activeProject, setActiveProject] = useState(null)
  const [hoveredProject, setHoveredProject] = useState(null)

  return (
    <group position={[15, 0, 0]}>
      <Text
        position={[0, 3, 0]}
        fontSize={0.8}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Orbitron-Bold.ttf"
      >
        Projects
      </Text>

      <ProjectGallery
        projects={projects}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
        hoveredProject={hoveredProject}
        setHoveredProject={setHoveredProject}
      />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
      </EffectComposer>
    </group>
  )
}

function ProjectGallery({ projects, activeProject, setActiveProject, hoveredProject, setHoveredProject }) {
  const groupRef = useRef()

  // Animate gallery
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        activeProject ? -activeProject * 3 : 0,
        0.05,
      )
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {projects.map((project, index) => (
        <ProjectTile
          key={project.id}
          project={project}
          position={[index * 3, 0, 0]}
          isActive={activeProject === index}
          isHovered={hoveredProject === index}
          onClick={() => setActiveProject(activeProject === index ? null : index)}
          onHover={() => setHoveredProject(index)}
          onUnhover={() => setHoveredProject(null)}
        />
      ))}
    </group>
  )
}

function ProjectTile({ project, position, isActive, isHovered, onClick, onHover, onUnhover }) {
  const meshRef = useRef()

  // Load texture
  const texture = useTexture(`/placeholder.svg?height=512&width=512`)

  // Animate tile
  useFrame((state) => {
    if (meshRef.current) {
      // Hover animation
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, isHovered || isActive ? 1.1 : 1, 0.1)
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, isHovered || isActive ? 1.1 : 1, 0.1)

      // Rotation animation
      if (isActive) {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, Math.PI * 2, 0.05)
      } else {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.05)
      }
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={position}>
        <mesh ref={meshRef} onClick={onClick} onPointerOver={onHover} onPointerOut={onUnhover}>
          <boxGeometry args={[2, 3, 0.2]} />
          <meshStandardMaterial
            map={texture}
            color={isHovered ? "#00ffff" : "white"}
            emissive={isHovered ? "#00ffff" : "#004a4a"}
            emissiveIntensity={isHovered ? 0.5 : 0.2}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        <Text
          position={[0, -1.8, 0.15]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Orbitron-Regular.ttf"
          maxWidth={1.8}
        >
          {project.title}
        </Text>

        {isActive && (
          <group position={[0, 0, 0.2]}>
            <mesh>
              <planeGeometry args={[2, 3]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.8} />
            </mesh>

            <Text
              position={[0, 0.8, 0.1]}
              fontSize={0.2}
              color="#00ffff"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Orbitron-Bold.ttf"
              maxWidth={1.8}
            >
              {project.title}
            </Text>

            <Text
              position={[0, 0.3, 0.1]}
              fontSize={0.12}
              color="white"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Roboto-Regular.ttf"
              maxWidth={1.8}
            >
              {project.description}
            </Text>

            <Text
              position={[0, -0.2, 0.1]}
              fontSize={0.1}
              color="#00ffff"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Roboto-Regular.ttf"
              maxWidth={1.8}
            >
              {project.techStack.join(" • ")}
            </Text>

            <group position={[0, -0.8, 0.1]}>
              <mesh
                position={[-0.5, 0, 0]}
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(project.github, "_blank")
                }}
              >
                <planeGeometry args={[0.8, 0.3]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
              </mesh>

              <Text
                position={[-0.5, 0, 0.01]}
                fontSize={0.1}
                color="white"
                anchorX="center"
                anchorY="middle"
                font="/fonts/Roboto-Regular.ttf"
              >
                GitHub
              </Text>

              <mesh
                position={[0.5, 0, 0]}
                onClick={(e) => {
                  e.stopPropagation()
                  if (project.demo !== "#") {
                    window.open(project.demo, "_blank")
                  }
                }}
              >
                <planeGeometry args={[0.8, 0.3]} />
                <meshBasicMaterial color={project.demo !== "#" ? "#00ffff" : "#555555"} transparent opacity={0.3} />
              </mesh>

              <Text
                position={[0.5, 0, 0.01]}
                fontSize={0.1}
                color={project.demo !== "#" ? "white" : "#aaaaaa"}
                anchorX="center"
                anchorY="middle"
                font="/fonts/Roboto-Regular.ttf"
              >
                Demo
              </Text>
            </group>
          </group>
        )}
      </group>
    </Float>
  )
}
