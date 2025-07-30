"use client"

import { useState, useEffect } from "react"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"
import ETCAdminPanel from "./ETCAdminPanel"
import SiteEngineerDashboard from "./SiteEngineerDashboard"

const MainApp = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (user) => {
    console.log("User logged in:", user)
    setCurrentUser(user)
    localStorage.setItem("currentUser", JSON.stringify(user))
  }

  const handleRegister = (newUser) => {
    console.log("New user registered:", newUser)

    // Save to registered users
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    registeredUsers.push(newUser)
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

    // Auto login after registration
    handleLogin(newUser)
    setShowRegister(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setSelectedProject(null)
    localStorage.removeItem("currentUser")
  }

  const handleProjectSelect = (project) => {
    setSelectedProject(project)
  }

  const handleCompanySelect = (company) => {
    console.log("Company selected:", company)
    // This can be used for additional company-specific actions
  }

  const handleBackToMain = () => {
    setSelectedProject(null)
  }

  if (!currentUser) {
    return showRegister ? (
      <RegisterForm onRegister={handleRegister} onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />
    )
  }

  // Route to appropriate dashboard based on user role
  switch (currentUser.role) {
    case "etc-admin":
    case "main-admin":
      return (
        <ETCAdminPanel
          user={currentUser}
          selectedProject={selectedProject}
          onLogout={handleLogout}
          onProjectSelect={handleProjectSelect}
          onCompanySelect={handleCompanySelect}
          onBackToMain={handleBackToMain}
        />
      )
    case "site-engineer":
      return (
        <SiteEngineerDashboard
          user={currentUser}
          selectedProject={selectedProject}
          onLogout={handleLogout}
          onProjectSelect={handleProjectSelect}
          onCompanySelect={handleCompanySelect}
        />
      )
    default:
      return (
        <div className="dashboard-container">
          <div className="error-message">
            <h2>Access Denied</h2>
            <p>Your role "{currentUser.role}" is not supported yet.</p>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      )
  }
}

export default MainApp
