"use client"

import { Suspense, useState, useEffect, lazy } from "react"
import { Canvas } from "@react-three/fiber"
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Loader, PerformanceMonitor } from "@react-three/drei"
import { Leva } from "leva"

// Lazy load scenes for better performance
const Home = lazy(() => import("./scenes/Home"))
const Projects = lazy(() => import("./scenes/Projects"))
const About = lazy(() => import("./scenes/About"))
const Contact = lazy(() => import("./scenes/Contact"))
const Experience = lazy(() => import("./components/Experience"))

// Boot sequence component
const BootSequence = lazy(() => import("./components/BootSequence"))

export default function App() {
  const [dpr, setDpr] = useState(1.5)
  const [isBooting, setIsBooting] = useState(true)

  useEffect(() => {
    // Simulate boot sequence
    const timer = setTimeout(() => {
      setIsBooting(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Leva hidden />
      <Router>
        {isBooting ? (
          <Suspense fallback={null}>
            <BootSequence onComplete={() => setIsBooting(false)} />
          </Suspense>
        ) : (
          <>
            <Canvas
              gl={{ antialias: false }}
              camera={{ position: [0, 0, 10], fov: 50 }}
              dpr={dpr}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "radial-gradient(ellipse at center, #0c0e13 0%, #090b10 100%)",
              }}
            >
              <PerformanceMonitor
                onDecline={() => setDpr(1)}
                onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))}
              >
                <Suspense fallback={null}>
                  <Experience>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </Experience>
                </Suspense>
              </PerformanceMonitor>
            </Canvas>
            <Loader
              containerStyles={{
                background: "radial-gradient(ellipse at center, #0c0e13 0%, #090b10 100%)",
                color: "#00ffff",
              }}
              barStyles={{
                height: "5px",
                background: "#00ffff",
              }}
              dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`}
            />
          </>
        )}
      </Router>
    </>
  )
}
