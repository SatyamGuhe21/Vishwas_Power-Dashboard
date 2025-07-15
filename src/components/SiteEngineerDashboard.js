"use client"

import { useState, useEffect } from "react"

const SiteEngineerDashboard = ({ user, selectedProject, onLogout, onProjectSelect, onCompanySelect }) => {
  const [projects, setProjects] = useState([])
  const [companies, setCompanies] = useState([])
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Initialize departments
    const defaultDepartments = [
      {
        id: 1,
        name: "Auto transformer",
        description: "Auto transformer department for power distribution systems",
        icon: "⚡",
        color: "#C41E3A",
      },
      {
        id: 2,
        name: "Traction transformer",
        description: "Traction transformer department for railway systems",
        icon: "🚊",
        color: "#1E3A8A",
      },
      {
        id: 3,
        name: "V Connected 63 MVA transformer",
        description: "V Connected 63 MVA transformer department for high voltage systems",
        icon: "🔌",
        color: "#047857",
      },
    ]
    setDepartments(defaultDepartments)

    // Load projects and companies
    const savedProjects = localStorage.getItem("etc_projects")
    const savedCompanies = localStorage.getItem("etc_companies")

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      const defaultProjects = [
        {
          id: 1,
          name: "Smart City Infrastructure",
          description: "Urban development project for smart city implementation",
          status: "active",
          companies: 3,
          createdAt: "2024-01-15",
          departmentId: 1,
        },
        {
          id: 2,
          name: "Green Energy Initiative",
          description: "Renewable energy project for sustainable development",
          status: "active",
          companies: 3,
          createdAt: "2024-02-01",
          departmentId: 2,
        },
        {
          id: 3,
          name: "High Voltage Distribution",
          description: "High voltage power distribution project",
          status: "active",
          companies: 3,
          createdAt: "2024-02-15",
          departmentId: 3,
        },
      ]
      setProjects(defaultProjects)
      localStorage.setItem("etc_projects", JSON.stringify(defaultProjects))
    }

    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies))
    } else {
      const defaultCompanies = [
        {
          id: 1,
          name: "TCS (Tata Consultancy Services)",
          projectId: 1,
          stage: 1,
          formsCompleted: 3,
          totalForms: 19,
          status: "in-progress",
          lastActivity: "2024-06-01",
          stageApprovals: { 1: false, 2: false, 3: false, 4: false, 5: false },
          submittedStages: { 1: false, 2: false, 3: false, 4: false, 5: false },
        },
        {
          id: 2,
          name: "IBM Corporation",
          projectId: 1,
          stage: 1,
          formsCompleted: 1,
          totalForms: 19,
          status: "in-progress",
          lastActivity: "2024-06-02",
          stageApprovals: { 1: false, 2: false, 3: false, 4: false, 5: false },
          submittedStages: { 1: false, 2: false, 3: false, 4: false, 5: false },
        },
        {
          id: 3,
          name: "HCL Technologies",
          projectId: 1,
          stage: 1,
          formsCompleted: 5,
          totalForms: 19,
          status: "in-progress",
          lastActivity: "2024-06-01",
          stageApprovals: { 1: false, 2: false, 3: false, 4: false, 5: false },
          submittedStages: { 1: false, 2: false, 3: false, 4: false, 5: false },
        },
      ]
      setCompanies(defaultCompanies)
      localStorage.setItem("etc_companies", JSON.stringify(defaultCompanies))
    }
  }, [])

  const filteredProjects = selectedDepartment
    ? projects.filter(
        (project) =>
          project.departmentId === selectedDepartment.id &&
          project.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const projectCompanies = selectedProject
    ? companies.filter((company) => company.projectId === selectedProject.id)
    : []

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "status-completed"
      case "in-progress":
        return "status-progress"
      case "pending-approval":
        return "status-pending"
      default:
        return "status-default"
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            {selectedProject && (
              <button onClick={() => onProjectSelect(null)} className="back-btn">
                ← Back
              </button>
            )}
            {selectedDepartment && !selectedProject && (
              <button onClick={() => setSelectedDepartment(null)} className="back-btn">
                ← Back
              </button>
            )}
            <div className="logo">⚡</div>
            <div className="header-title">
              <h1>
                {selectedProject
                  ? `${selectedProject.name} - Companies`
                  : selectedDepartment
                    ? `${selectedDepartment.name} - Projects`
                    : "Site Engineer Dashboard"}
              </h1>
              <p>
                {selectedProject
                  ? "Select a company to work on forms"
                  : selectedDepartment
                    ? "Select a project to view companies"
                    : "Select a department to view projects"}
              </p>
            </div>
          </div>
          <div className="header-right">
            <span className="user-badge">Site Engineer</span>
            <button onClick={onLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {!selectedDepartment ? (
          // Department Selection
          <>
            <div className="section-header">
              <h2>Transformer Departments</h2>
              <p>Select a department to view available projects</p>
            </div>

            <div className="departments-grid">
              {departments.map((department) => {
                const departmentProjects = projects.filter((p) => p.departmentId === department.id)
                return (
                  <div
                    key={department.id}
                    className="department-card"
                    onClick={() => setSelectedDepartment(department)}
                  >
                    <div className="department-header">
                      <div className="department-icon" style={{ backgroundColor: department.color }}>
                        {department.icon}
                      </div>
                      <span className="status-badge status-completed">Active</span>
                    </div>
                    <h3>{department.name}</h3>
                    <p>{department.description}</p>
                    <div className="department-footer">
                      <span>📁 {departmentProjects.length} projects</span>
                      <span>🏢 {departmentProjects.length * 3} companies</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : !selectedProject ? (
          // Projects View
          <>
            <div className="section-header">
              <div>
                <h2>Projects in {selectedDepartment.name}</h2>
                <p>Select a project to view companies and forms</p>
              </div>
            </div>

            <div className="search-container">
              <input
                type="text"
                placeholder="🔍 Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <div key={project.id} className="project-card" onClick={() => onProjectSelect(project)}>
                  <div className="project-header">
                    <div className="project-icon" style={{ backgroundColor: selectedDepartment.color }}>
                      📁
                    </div>
                    <span className={`status-badge ${getStatusClass(project.status)}`}>{project.status}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className="project-footer">
                    <span>🏢 {project.companies} companies</span>
                    <span>📅 {project.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Companies View
          <>
            <div className="section-header">
              <h2>Companies in {selectedProject.name}</h2>
              <p>Select a company to work on their forms</p>
            </div>

            <div className="companies-grid">
              {projectCompanies.map((company) => (
                <div key={company.id} className="company-card" onClick={() => onCompanySelect(company)}>
                  <div className="company-header">
                    <div className="company-icon">🏢</div>
                    <span className={`status-badge ${getStatusClass(company.status)}`}>
                      {company.status === "pending-approval" && "⏳"}
                      {company.status === "in-progress" && "🔄"}
                      {company.status === "completed" && "✅"}
                      {company.status}
                    </span>
                  </div>
                  <h3>{company.name}</h3>
                  <p>
                    Stage {company.stage} • {company.formsCompleted}/{company.totalForms} forms completed
                  </p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(company.formsCompleted / company.totalForms) * 100}%` }}
                    />
                  </div>
                  <div className="company-footer">
                    <span>📊 {Math.round((company.formsCompleted / company.totalForms) * 100)}% complete</span>
                    <span>📅 {company.lastActivity}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default SiteEngineerDashboard
