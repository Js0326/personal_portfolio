"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

export default function MouseTrail() {
  const { viewport, mouse } = useThree()
  const points = useRef([])
  const trailMaterial = useRef()

  // Create trail points
  const count = 20
  const dummy = useMemo(() => new THREE.Vector3(), [])

  // Initialize points
  useMemo(() => {
    points.current = Array.from({ length: count }, () => new THREE.Vector3())
  }, [count])

  // Update trail on each frame
  useFrame(() => {
    // Convert mouse coordinates to world space
    const x = (mouse.x * viewport.width) / 2
    const y = (mouse.y * viewport.height) / 2

    // Shift all points down the array
    for (let i = points.current.length - 1; i >= 1; i--) {
      points.current[i].copy(points.current[i - 1])
    }

    // Set the first point to current mouse position
    points.current[0].set(x, y, 0)

    // Update the trail material
    if (trailMaterial.current) {
      trailMaterial.current.uniforms.points.value = points.current
    }
  })

  return (
    <mesh>
      <planeGeometry args={[0.1, 0.1, 1, count - 1]} />
      <shaderMaterial
        ref={trailMaterial}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          points: { value: points.current },
          color: { value: new THREE.Color(0x00ffff) },
        }}
        vertexShader={`
          uniform vec3 points[${count}];
          varying float vOpacity;
          
          void main() {
            // Get point index from geometry
            float pointIndex = position.y * ${count - 1}.0;
            int index = int(pointIndex);
            
            // Position based on trail points
            vec3 pos = points[index];
            
            // Fade opacity based on position in trail
            vOpacity = 1.0 - pointIndex / ${count}.0;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 5.0 * vOpacity;
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          varying float vOpacity;
          
          void main() {
            gl_FragColor = vec4(color, vOpacity * 0.5);
          }
        `}
      />
    </mesh>
  )
}
