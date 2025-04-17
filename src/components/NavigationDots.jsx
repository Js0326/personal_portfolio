"use client"

export default function NavigationDots({ currentPath, navigateTo }) {
  const routes = [
    { path: "/", label: "Home" },
    { path: "/projects", label: "Projects" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ]

  return (
    <div className="interface">
      <div className="nav-dots">
        {routes.map((route) => (
          <div
            key={route.path}
            className={`nav-dot ${currentPath === route.path ? "active" : ""}`}
            onClick={() => navigateTo(route.path)}
            title={route.label}
          />
        ))}
      </div>
      <div className="scroll-indicator">Scroll to Navigate</div>
    </div>
  )
}
