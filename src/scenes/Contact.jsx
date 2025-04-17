"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Html, Float } from "@react-three/drei"
import { gsap } from "gsap"

export default function Contact() {
  const terminalRef = useRef()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const paperPlaneRef = useRef()

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Animate paper plane
    if (paperPlaneRef.current) {
      gsap.to(paperPlaneRef.current.position, {
        x: 10,
        y: 5,
        z: -10,
        duration: 2,
        ease: "power2.out",
        onComplete: () => {
          setIsSubmitting(false)
          setIsSubmitted(true)
          setFormData({ name: "", email: "", message: "" })

          // Reset after a few seconds
          setTimeout(() => {
            setIsSubmitted(false)
            if (paperPlaneRef.current) {
              paperPlaneRef.current.position.set(0, 0, 0)
            }
          }, 3000)
        },
      })
    }
  }

  // Animate terminal
  useFrame((state) => {
    if (terminalRef.current) {
      terminalRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    }
  })

  return (
    <group position={[0, 10, 0]}>
      <Text
        position={[0, 3, 0]}
        fontSize={0.8}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Orbitron-Bold.ttf"
      >
        Contact
      </Text>

      {/* Terminal */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group ref={terminalRef} position={[0, 0, 0]}>
          <mesh>
            <boxGeometry args={[6, 4, 0.2]} />
            <meshStandardMaterial
              color="#000000"
              emissive="#004a4a"
              emissiveIntensity={0.2}
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>

          <Html position={[0, 0, 0.2]} transform>
            <div
              style={{
                width: "500px",
                transform: "translateX(-50%)",
                pointerEvents: "auto",
              }}
            >
              {!isSubmitted ? (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <h2
                    style={{
                      color: "#00ffff",
                      marginBottom: "20px",
                      fontFamily: "Orbitron, sans-serif",
                      textAlign: "center",
                    }}
                  >
                    Let's Connect
                  </h2>

                  <div style={{ marginBottom: "15px" }}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <textarea
                      name="message"
                      placeholder="Message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </div>

                  <div className="social-links">
                    <a
                      href="https://www.linkedin.com/in/jatin-sharma-b31a51320/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                    <a
                      href="https://github.com/Js0326"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    </a>
                    <a href="mailto:jatinsharma0326@gmail.com" className="social-link">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </a>
                  </div>
                </form>
              ) : (
                <div
                  style={{
                    width: "100%",
                    padding: "30px",
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "1px solid rgba(0, 255, 255, 0.3)",
                    borderRadius: "10px",
                    textAlign: "center",
                    color: "#00ffff",
                    fontFamily: "Orbitron, sans-serif",
                  }}
                >
                  <h2 style={{ marginBottom: "15px" }}>Message Sent!</h2>
                  <p style={{ fontFamily: "Roboto Mono, monospace" }}>
                    Thanks for reaching out. I'll get back to you soon.
                  </p>
                </div>
              )}
            </div>
          </Html>
        </group>
      </Float>

      {/* Paper plane animation */}
      {isSubmitting && (
        <mesh ref={paperPlaneRef} position={[0, 0, 0]}>
          <coneGeometry args={[0.2, 0.5, 4]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      )}

      {/* Contact info */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Roboto-Regular.ttf"
      >
        jatinsharma0326@gmail.com | +91-8092638283
      </Text>
    </group>
  )
}
