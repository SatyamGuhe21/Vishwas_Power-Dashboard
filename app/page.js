"use client"

import { useState, useEffect } from "react"
import LoginForm from "@/components/LoginForm"
import RegisterForm from "@/components/RegisterForm"
import SiteEngineerDashboard from "@/components/SiteEngineerDashboard"
import ETCAdminPanel from "@/components/ETCAdminPanel"
import CompanyWorkflow from "@/components/CompanyWorkflow"
import { DataPersistenceManager } from "@/lib/DataPersistenceManager"
import { PersistenceIndicator } from "@/components/PersistenceIndicator"

export default function Home() {
  const [currentView, setCurrentView] = useState("login")
  const [user, setUser] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)

  useEffect(() => {
    // Initialize session and default data
    DataPersistenceManager.initializeSession()

    // Initialize default departments if not exists
    const departments = localStorage.getItem("departments")
    if (!departments) {
      const defaultDepartments = ["Auto transformer", "Traction transformer", "V Connected 63 MVA transformer"]
      localStorage.setItem("departments", JSON.stringify(defaultDepartments))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    if (userData.role === "etc-admin") {
      setCurrentView("etc-admin")
    } else if (userData.role === "main-admin") {
      setCurrentView("etc-admin") // Main admin can access ETC admin panel
    } else {
      setCurrentView("dashboard")
    }
  }

  const handleRegister = (userData) => {
    // Save user to localStorage
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    registeredUsers.push(userData)
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

    alert("Registration successful! Please login with your credentials.")
    setCurrentView("login")
  }

  const handleLogout = () => {
    setUser(null)
    setSelectedProject(null)
    setSelectedCompany(null)
    setCurrentView("login")
  }

  const handleProjectSelect = (project) => {
    setSelectedProject(project)
  }

  const handleCompanySelect = (company) => {
    setSelectedCompany(company)
    setCurrentView("workflow")
  }

  const handleBackFromWorkflow = () => {
    setSelectedCompany(null)
    if (user?.role === "etc-admin" || user?.role === "main-admin") {
      setCurrentView("etc-admin")
    } else {
      setCurrentView("dashboard")
    }
  }

  const handleNavigateToAdmin = (adminType) => {
    if (adminType === "etc" || adminType === "main") {
      setCurrentView("etc-admin")
      setSelectedCompany(null)
    }
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "login":
        return <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setCurrentView("register")} />

      case "register":
        return <RegisterForm onRegister={handleRegister} onSwitchToLogin={() => setCurrentView("login")} />

      case "dashboard":
        return (
          <SiteEngineerDashboard
            user={user}
            selectedProject={selectedProject}
            onLogout={handleLogout}
            onProjectSelect={handleProjectSelect}
            onCompanySelect={handleCompanySelect}
          />
        )

      case "etc-admin":
        return (
          <ETCAdminPanel
            user={user}
            selectedProject={selectedProject}
            onLogout={handleLogout}
            onProjectSelect={handleProjectSelect}
            onCompanySelect={handleCompanySelect}
            onBackToMain={() => setCurrentView("dashboard")}
          />
        )

      case "workflow":
        return (
          <CompanyWorkflow
            company={selectedCompany}
            project={selectedProject}
            user={user}
            onBack={handleBackFromWorkflow}
            onLogout={handleLogout}
            onNavigateToAdmin={handleNavigateToAdmin}
          />
        )

      default:
        return <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setCurrentView("register")} />
    }
  }

  return (
    <div className="app-container">
      {renderCurrentView()}
      <PersistenceIndicator />
    </div>
  )
}
