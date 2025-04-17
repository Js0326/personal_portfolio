"use client"

import { useState, useEffect } from "react"

export default function BootSequence({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [messages, setMessages] = useState([])

  const bootMessages = [
    "Initializing AI Core...",
    "Loading neural networks...",
    "Establishing quantum connections...",
    "Calibrating holographic displays...",
    "Syncing project database...",
    "Optimizing 3D rendering engine...",
    "Activating interactive elements...",
    "Preparing developer environment...",
    "Launching Interactive 3D Developer Lab...",
  ]

  useEffect(() => {
    let currentIndex = 0
    const messageInterval = setInterval(() => {
      if (currentIndex < bootMessages.length) {
        setMessages((prev) => [...prev, bootMessages[currentIndex]])
        currentIndex++
        setProgress((currentIndex / bootMessages.length) * 100)
      } else {
        clearInterval(messageInterval)
        setTimeout(onComplete, 1000)
      }
    }, 400)

    return () => clearInterval(messageInterval)
  }, [onComplete])

  return (
    <div className="loading-screen">
      <div className="boot-sequence">
        {messages.map((message, index) => (
          <p key={index} style={{ animationDelay: `${index * 0.4}s` }}>
            &gt; {message}
          </p>
        ))}
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
