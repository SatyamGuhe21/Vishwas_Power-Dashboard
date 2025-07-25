"use client"

import { useState, useEffect } from "react"
import FormStage from "./FormStage" // Import FormStage

const ETCAdminPanel = ({ user, selectedProject, onLogout, onProjectSelect, onCompanySelect, onBackToMain }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [departments, setDepartments] = useState([])
  const [projects, setProjects] = useState([])
  const [subProjects, setSubProjects] = useState([])
  const [companies, setCompanies] = useState([])
  const [submittedForms, setSubmittedForms] = useState([])

  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [selectedMainProject, setSelectedMainProject] = useState(null)
  const [selectedSubProject, setSelectedSubProject] = useState(null)

  const [newProject, setNewProject] = useState({ name: "", description: "" })
  const [newSubProject, setNewSubProject] = useState({ name: "", description: "" })
  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false)
  const [showCreateSubProjectForm, setShowCreateSubProjectForm] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [reviewMode, setReviewMode] = useState(false)
  const [selectedCompanyForReview, setSelectedCompanyForReview] = useState(null)
  const [currentStageReview, setCurrentStageReview] = useState(1)
  const [showSubmitterReview, setShowSubmitterReview] = useState(false)

  // State for showing and managing FormStage
  const [showFormStage, setShowFormStage] = useState(false)
  const [formStageCompany, setFormStageCompany] = useState(null)
  const [formStageStage, setFormStageStage] = useState(1)

  // Default data for initialization
  const defaultDepartments = [
    {
      id: 1,
      name: "Auto Transformer",
      description: "Auto transformer department for power distribution systems",
      icon: "⚡",
      color: "#C41E3A",
    },
    {
      id: 2,
      name: "Traction Transformer",
      description: "Traction transformer department for railway systems",
      icon: "🚊",
      color: "#1E3A8A",
    },
    {
      id: 3,
      name: "V Connected 63 MVA Transformer",
      description: "V Connected 63 MVA transformer department for high voltage systems",
      icon: "🔌",
      color: "#047857",
    },
  ]

  const defaultProjects = [
    {
      id: 101,
      name: "Smart City Infrastructure",
      description: "Urban development project for smart city implementation",
      status: "active",
      createdAt: "2024-01-15",
      departmentId: 1,
    },
    {
      id: 102,
      name: "Railway Electrification",
      description: "Project for electrifying railway lines",
      status: "active",
      createdAt: "2024-02-01",
      departmentId: 2,
    },
    {
      id: 103,
      name: "Grid Modernization",
      description: "Modernizing the power grid for efficiency",
      status: "active",
      createdAt: "2024-02-15",
      departmentId: 3,
    },
  ]

  const defaultSubProjects = [
    {
      id: 1001,
      name: "Phase 1 - Downtown",
      description: "Initial phase covering downtown area",
      status: "active",
      createdAt: "2024-03-01",
      projectId: 101,
    },
    {
      id: 1002,
      name: "Phase 2 - Industrial Zone",
      description: "Second phase covering industrial zone",
      status: "active",
      createdAt: "2024-03-15",
      projectId: 101,
    },
    {
      id: 2001,
      name: "North Line Upgrade",
      description: "Upgrade of the northern railway line",
      status: "active",
      createdAt: "2024-04-01",
      projectId: 102,
    },
    {
      id: 3001,
      name: "Substation A Expansion",
      description: "Expansion of Substation A capacity",
      status: "active",
      createdAt: "2024-05-01",
      projectId: 103,
    },
  ]

  // Removed defaultCompanies to prevent automatic creation
  const defaultCompanies = []

  const mockSubmittedForms = []

  // Load data from localStorage on component mount
  useEffect(() => {
    setDepartments(defaultDepartments)

    const savedProjects = localStorage.getItem("etc_projects")
    const savedSubProjects = localStorage.getItem("etc_sub_projects")
    const savedCompanies = localStorage.getItem("etc_companies")
    const savedSubmittedForms = localStorage.getItem("etc_submitted_forms")

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      setProjects(defaultProjects)
      localStorage.setItem("etc_projects", JSON.stringify(defaultProjects))
    }

    if (savedSubProjects) {
      setSubProjects(JSON.parse(savedSubProjects))
    } else {
      setSubProjects(defaultSubProjects)
      localStorage.setItem("etc_sub_projects", JSON.stringify(defaultSubProjects))
    }

    if (savedCompanies) {
      setCompanies(JSON.parse(savedCompanies))
    } else {
      setCompanies(defaultCompanies)
      localStorage.setItem("etc_companies", JSON.stringify(defaultCompanies))
    }

    if (savedSubmittedForms) {
      setSubmittedForms(JSON.parse(savedSubmittedForms))
    } else {
      setSubmittedForms(mockSubmittedForms)
      localStorage.setItem("etc_submitted_forms", JSON.stringify(mockSubmittedForms))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("etc_projects", JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem("etc_sub_projects", JSON.stringify(subProjects))
  }, [subProjects])

  useEffect(() => {
    localStorage.setItem("etc_companies", JSON.stringify(companies))
  }, [companies])

  useEffect(() => {
    localStorage.setItem("etc_submitted_forms", JSON.stringify(submittedForms))
  }, [submittedForms])

  const handleCreateProject = () => {
    if (newProject.name && newProject.description && selectedDepartment) {
      const projectId = Math.max(...projects.map((p) => p.id), 0) + 1

      const project = {
        id: projectId,
        name: newProject.name,
        description: newProject.description,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        departmentId: selectedDepartment.id,
      }

      setProjects([...projects, project])
      setNewProject({ name: "", description: "" })
      setShowCreateProjectForm(false)
      alert(`Main Project "${project.name}" created successfully in ${selectedDepartment.name}!`)
    }
  }

  const handleCreateSubProject = () => {
    if (newSubProject.name && newSubProject.description && selectedMainProject) {
      const subProjectId = Math.max(...subProjects.map((sp) => sp.id), 0) + 1

      const subProject = {
        id: subProjectId,
        name: newSubProject.name,
        description: newSubProject.description,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        projectId: selectedMainProject.id,
      }

      setSubProjects([...subProjects, subProject])

      // Removed automatic company creation as per user's request
      setNewSubProject({ name: "", description: "" })
      setShowCreateSubProjectForm(false)
      alert(`Sub-project "${subProject.name}" created successfully under "${selectedMainProject.name}"!`)
    }
  }

  const handleAddCompany = (subProjectId) => {
    const companyName = prompt("Enter company name:")
    if (companyName) {
      const newCompany = {
        id: Math.max(...companies.map((c) => c.id), 0) + 1,
        name: companyName,
        subProjectId: subProjectId,
        stage: 1,
        formsCompleted: 0,
        totalForms: 4, // Assuming Stage 1 has 4 forms
        status: "in-progress",
        lastActivity: new Date().toISOString().split("T")[0],
        stageApprovals: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false },
        submittedStages: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false },
      }
      setCompanies((prev) => [...prev, newCompany])
      alert(`Company "${companyName}" added to this sub-project!`)
    }
  }

  const handleReviewStage = (company, stage) => {
    const stageForms = submittedForms.filter((form) => form.companyId === company.id && form.stage === stage)

    if (stageForms.length === 0) {
      alert(`No forms submitted for Stage ${stage} yet.`)
      return
    }

    setSelectedCompanyForReview(company)
    setCurrentStageReview(stage)
    setReviewMode(true)
  }

  const handleApproveStage = (stage) => {
    setSubmittedForms((forms) =>
      forms.map((form) =>
        form.companyId === selectedCompanyForReview.id && form.stage === stage
          ? { ...form, status: "approved", reviewedAt: new Date().toISOString().split("T")[0] }
          : form,
      ),
    )

    setCompanies((companies) =>
      companies.map((company) =>
        company.id === selectedCompanyForReview.id
          ? {
              ...company,
              stageApprovals: { ...company.stageApprovals, [stage]: true },
              status: stage === 6 ? "completed" : "in-progress",
              stage: stage === 6 ? 6 : stage + 1,
            }
          : company,
      ),
    )

    alert(
      `Stage ${stage} approved! ${stage === 6 ? "Company completed all stages." : `Stage ${stage + 1} is now available.`}`,
    )
    setReviewMode(false)
  }

  const handleRejectStage = (stage) => {
    const rejectionReason = prompt("Please provide a reason for rejecting this stage:")
    if (!rejectionReason) return

    setSubmittedForms((forms) =>
      forms.map((form) =>
        form.companyId === selectedCompanyForReview.id && form.stage === stage
          ? {
              ...form,
              status: "rejected",
              rejectionReason,
              reviewedAt: new Date().toISOString().split("T")[0],
            }
          : form,
      ),
    )

    setCompanies((companies) =>
      companies.map((company) =>
        company.id === selectedCompanyForReview.id
          ? {
              ...company,
              status: "in-progress",
              submittedStages: { ...company.submittedStages, [stage]: false },
            }
          : company,
      ),
    )

    alert(`Stage ${stage} rejected. Company needs to resubmit forms.`)
    setReviewMode(false)
  }

  const handleViewSubmittedForms = (company) => {
    const companyForms = submittedForms.filter((form) => form.companyId === company.id)
    if (companyForms.length === 0) {
      alert("No forms submitted yet.")
      return
    }

    setSelectedCompanyForReview(company)
    setShowSubmitterReview(true)
  }

  const handleBackFromReview = () => {
    setReviewMode(false)
    setShowSubmitterReview(false)
    setSelectedCompanyForReview(null)
    setCurrentStageReview(1)
  }

  const getStatusColor = (status) => {
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

  const getStageStatus = (company, stage) => {
    if (company.stageApprovals[stage]) return "approved"
    if (company.submittedStages[stage]) return "pending-approval"
    if (stage === 1 || company.stageApprovals[stage - 1]) return "available"
    return "locked"
  }

  const getDepartmentProjects = (departmentId) => {
    return projects.filter((project) => project.departmentId === departmentId)
  }

  const getProjectSubProjects = (projectId) => {
    return subProjects.filter((subProject) => subProject.projectId === projectId)
  }

  const getSubProjectCompanies = (subProjectId) => {
    return companies.filter((company) => company.subProjectId === subProjectId)
  }

  const filteredProjects = selectedDepartment
    ? getDepartmentProjects(selectedDepartment.id).filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const filteredSubProjects = selectedMainProject
    ? getProjectSubProjects(selectedMainProject.id).filter((subProject) =>
        subProject.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const currentStageForms = reviewMode
    ? submittedForms.filter(
        (form) => form.companyId === selectedCompanyForReview.id && form.stage === currentStageReview,
      )
    : []

  const allCompanyForms = showSubmitterReview
    ? submittedForms.filter((form) => form.companyId === selectedCompanyForReview.id)
    : []

  const handleLogoutAndClearData = () => {
    localStorage.removeItem("etc_projects")
    localStorage.removeItem("etc_sub_projects")
    localStorage.removeItem("etc_companies")
    localStorage.removeItem("etc_submitted_forms")

    setProjects([])
    setSubProjects([])
    setCompanies([])
    setSubmittedForms([])
    setSelectedDepartment(null)
    setSelectedMainProject(null)
    setSelectedSubProject(null)
    setSelectedCompanyForReview(null)
    setReviewMode(false)
    setShowSubmitterReview(false)
    setShowFormStage(false) // Reset form stage visibility

    onLogout()
  }

  // Function to handle form submission from FormStage
  const handleFormStageSubmit = (stage, submittedData) => {
    const newFormEntry = {
      id: Math.max(...submittedForms.map((f) => f.id), 0) + 1,
      companyId: formStageCompany.id,
      stage: stage,
      formName: `Stage ${stage} Forms`, // A generic name for the collection of forms in a stage
      submittedAt: new Date().toISOString().split("T")[0],
      status: "pending-review",
      data: submittedData, // This will contain all form data including signatures
    }

    setSubmittedForms((prev) => [...prev, newFormEntry])

    setCompanies((prev) =>
      prev.map((company) =>
        company.id === formStageCompany.id
          ? {
              ...company,
              status: "pending-approval",
              submittedStages: { ...company.submittedStages, [stage]: true },
              formsCompleted: company.formsCompleted + 1, // Increment forms completed
              lastActivity: new Date().toISOString().split("T")[0],
            }
          : company,
      ),
    )

    alert(`Forms for Stage ${stage} submitted successfully!`)
    setShowFormStage(false) // Hide FormStage after submission
    setFormStageCompany(null)
    setFormStageStage(1)
  }

  // Function to go back from FormStage
  const handleBackFromFormStage = () => {
    setShowFormStage(false)
    setFormStageCompany(null)
    setFormStageStage(1)
  }

  return (
    <div className="dashboard-container">
      <header className="etc-header">
        <div className="header-content">
          <div className="header-left">
            {user?.role === "main-admin" && (
              <button onClick={onBackToMain} className="back-btn">
                ← Back
              </button>
            )}
            <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>

            <img src="/placeholder.svg?height=40&width=120&text=Vishvas+Power" alt="Vishvas Power" className="logo" />
            <div className="header-title">
              <h1>
                {showFormStage
                  ? `Submit Forms - ${formStageCompany?.name} (Stage ${formStageStage})`
                  : reviewMode
                    ? `Review Stage ${currentStageReview} - ${selectedCompanyForReview?.name}`
                    : showSubmitterReview
                      ? `Submitted Forms - ${selectedCompanyForReview?.name}`
                      : selectedSubProject
                        ? `${selectedSubProject.name} - Companies`
                        : selectedMainProject
                          ? `${selectedMainProject.name} - Sub-Projects`
                          : selectedDepartment
                            ? `${selectedDepartment.name} - Projects`
                            : "ETC Admin Panel"}
              </h1>
              <p>
                {showFormStage
                  ? "Fill out and submit the required forms for this stage."
                  : reviewMode
                    ? "Review and approve/reject stage forms"
                    : showSubmitterReview
                      ? "View all submitted forms by company"
                      : selectedSubProject
                        ? "Manage companies and their workflows"
                        : selectedMainProject
                          ? "Manage sub-projects under this project"
                          : selectedDepartment
                            ? "Manage projects in department"
                            : "Manage departments, projects and companies"}
              </p>
            </div>
          </div>

          <div className="header-right desktop-only">
            <span className="user-badge">ETC Admin</span>
            <button onClick={handleLogoutAndClearData} className="logout-btn">
              🚪 Logout
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                <div className="mobile-menu-header">
                  <img src="/placeholder.svg?height=32&width=32&text=VP" alt="Vishvas Power" className="logo-small" />
                  <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
                    ×
                  </button>
                </div>
                <div className="mobile-menu-content">
                  <div className="mobile-user-info">
                    <span className="user-badge">ETC Admin</span>
                  </div>
                  <button onClick={handleLogoutAndClearData} className="mobile-logout-btn">
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="etc-main">
        {showFormStage && formStageCompany ? (
          <FormStage
            stage={formStageStage}
            onFormSubmit={handleFormStageSubmit}
            onBack={handleBackFromFormStage}
            companyData={formStageCompany}
          />
        ) : reviewMode ? (
          <>
            <div className="section-header">
              <div>
                <h2>Stage {currentStageReview} Forms Review</h2>
                <p>Review all forms submitted for Stage {currentStageReview}</p>
              </div>
              <button onClick={handleBackFromReview} className="back-btn">
                ← Back to Companies
              </button>
            </div>

            <div className="stage-review-summary">
              <div className="stage-info-card">
                <h3>Stage {currentStageReview} Information</h3>
                <p>
                  <strong>Company:</strong> {selectedCompanyForReview?.name}
                </p>
                <p>
                  <strong>Total Forms:</strong> {currentStageForms.length}
                </p>
                <p>
                  <strong>Status:</strong> {getStageStatus(selectedCompanyForReview, currentStageReview)}
                </p>
              </div>
            </div>

            <div className="forms-review-grid">
              {currentStageForms.map((form) => (
                <div key={form.id} className={`form-review-card ${form.status}`}>
                  <div className="form-review-header">
                    <h3>{form.formName}</h3>
                    <span
                      className={`status-badge ${
                        form.status === "approved"
                          ? "status-completed"
                          : form.status === "rejected"
                            ? "status-pending"
                            : "status-progress"
                      }`}
                    >
                      {form.status === "approved" && "✅ Approved"}
                      {form.status === "rejected" && "❌ Rejected"}
                      {form.status === "pending-review" && "⏳ Pending Review"}
                    </span>
                  </div>

                  <div className="form-review-details">
                    <p>
                      <strong>Submitted:</strong> {form.submittedAt}
                    </p>
                    {form.reviewedAt && (
                      <p>
                        <strong>Reviewed:</strong> {form.reviewedAt}
                      </p>
                    )}
                    {form.rejectionReason && (
                      <div className="rejection-reason">
                        <strong>Rejection Reason:</strong>
                        <p>{form.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  <div className="form-data-preview">
                    <h4>Form Data:</h4>
                    <div className="data-grid">
                      {Object.entries(form.data).map(([key, value]) => (
                        <div key={key} className="data-item">
                          <span className="data-label">
                            {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                          </span>
                          {typeof value === "string" && value.startsWith("data:image/") ? (
                            <img
                              src={value || "/placeholder.svg"}
                              alt={`${key} signature`}
                              style={{ maxWidth: "100px", border: "1px solid #ccc" }}
                            />
                          ) : (
                            <span className="data-value">{String(value)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="stage-approval-actions">
              <button
                onClick={() => handleApproveStage(currentStageReview)}
                className="approve-stage-btn"
                disabled={currentStageForms.some((form) => form.status === "pending-review")}
              >
                ✅ Approve Stage {currentStageReview}
              </button>
              <button onClick={() => handleRejectStage(currentStageReview)} className="reject-stage-btn">
                ❌ Reject Stage {currentStageReview}
              </button>
            </div>
          </>
        ) : showSubmitterReview ? (
          <>
            <div className="section-header">
              <div>
                <h2>All Submitted Forms</h2>
                <p>Review all forms submitted by {selectedCompanyForReview?.name}</p>
              </div>
              <button onClick={handleBackFromReview} className="back-btn">
                ← Back to Companies
              </button>
            </div>

            <div className="submitter-review-summary">
              <div className="review-stats">
                <div className="stat-card">
                  <h4>Total Forms</h4>
                  <div className="stat-number">{allCompanyForms.length}</div>
                </div>
                <div className="stat-card">
                  <h4>Approved</h4>
                  <div className="stat-number">{allCompanyForms.filter((f) => f.status === "approved").length}</div>
                </div>
                <div className="stat-card">
                  <h4>Pending</h4>
                  <div className="stat-number">
                    {allCompanyForms.filter((f) => f.status === "pending-review").length}
                  </div>
                </div>
                <div className="stat-card">
                  <h4>Rejected</h4>
                  <div className="stat-number">{allCompanyForms.filter((f) => f.status === "rejected").length}</div>
                </div>
              </div>
            </div>

            <div className="stages-review-container">
              {[1, 2, 3, 4, 5, 6].map((stage) => {
                const stageForms = allCompanyForms.filter((form) => form.stage === stage)
                if (stageForms.length === 0) return null

                return (
                  <div key={stage} className="stage-forms-section">
                    <h3>Stage {stage} Forms</h3>
                    <div className="forms-review-grid">
                      {stageForms.map((form) => (
                        <div key={form.id} className={`form-review-card ${form.status}`}>
                          <div className="form-review-header">
                            <h4>{form.formName}</h4>
                            <span
                              className={`status-badge ${
                                form.status === "approved"
                                  ? "status-completed"
                                  : form.status === "rejected"
                                    ? "status-pending"
                                    : "status-progress"
                              }`}
                            >
                              {form.status === "approved" && "✅ Approved"}
                              {form.status === "rejected" && "❌ Rejected"}
                              {form.status === "pending-review" && "⏳ Pending Review"}
                            </span>
                          </div>

                          <div className="form-review-details">
                            <p>
                              <strong>Submitted:</strong> {form.submittedAt}
                            </p>
                            {form.reviewedAt && (
                              <p>
                                <strong>Reviewed:</strong> {form.reviewedAt}
                              </p>
                            )}
                            {form.rejectionReason && (
                              <div className="rejection-reason">
                                <strong>Rejection Reason:</strong>
                                <p>{form.rejectionReason}</p>
                              </div>
                            )}
                          </div>

                          <div className="form-data-preview">
                            <h5>Form Data:</h5>
                            <div className="data-grid">
                              {Object.entries(form.data).map(([key, value]) => (
                                <div key={key} className="data-item">
                                  <span className="data-label">
                                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                                  </span>
                                  {typeof value === "string" && value.startsWith("data:image/") ? (
                                    <img
                                      src={value || "/placeholder.svg"}
                                      alt={`${key} signature`}
                                      style={{ maxWidth: "100px", border: "1px solid #ccc" }}
                                    />
                                  ) : (
                                    <span className="data-value">{String(value)}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : !selectedDepartment ? (
          <>
            <div className="section-header">
              <div>
                <h2>Transformer Categories</h2>
                <p>Select a category to manage projects and sub-projects</p>
              </div>
            </div>

            <div className="departments-grid">
              {departments.map((department) => {
                const departmentProjects = getDepartmentProjects(department.id)
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
                      <span className="status-badge status-progress">Active</span>
                    </div>
                    <h3>{department.name}</h3>
                    <p>{department.description}</p>
                    <div className="department-footer">
                      <span>📁 {departmentProjects.length} projects</span>
                      <span>
                        🏢{" "}
                        {departmentProjects.reduce((acc, proj) => {
                          const subProjs = getProjectSubProjects(proj.id)
                          return (
                            acc +
                            subProjs.reduce((subAcc, subProj) => subAcc + getSubProjectCompanies(subProj.id).length, 0)
                          )
                        }, 0)}{" "}
                        companies
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : !selectedMainProject ? (
          <>
            <div className="section-header">
              <div>
                <h2>Projects in {selectedDepartment.name}</h2>
                <p>Create and manage projects for this category</p>
              </div>
              <div className="section-actions">
                <button onClick={() => setShowCreateProjectForm(true)} className="create-btn">
                  ➕ Create Project
                </button>
                <button onClick={() => setSelectedDepartment(null)} className="back-btn">
                  ← Back to Categories
                </button>
              </div>
            </div>

            <div className="search-bar">
              <input
                type="text"
                placeholder="🔍 Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {showCreateProjectForm && (
              <div className="modal-overlay" onClick={() => setShowCreateProjectForm(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <img src="/placeholder.svg?height=32&width=32&text=VP" alt="Vishvas Power" className="logo-small" />
                    <h3>Create New Project in {selectedDepartment.name}</h3>
                  </div>
                  <p>Sub-projects and companies will be added later</p>
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      placeholder="Enter project name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Enter project description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="modal-actions">
                    <button
                      onClick={handleCreateProject}
                      className="submit-btn"
                      disabled={!newProject.name || !newProject.description}
                    >
                      Create Project
                    </button>
                    <button onClick={() => setShowCreateProjectForm(false)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <div key={project.id} className="project-card" onClick={() => setSelectedMainProject(project)}>
                  <div className="project-header">
                    <div className="project-icon" style={{ backgroundColor: selectedDepartment.color }}>
                      📁
                    </div>
                    <span className={`status-badge ${getStatusColor(project.status)}`}>{project.status}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className="project-footer">
                    <span>📂 {getProjectSubProjects(project.id).length} sub-projects</span>
                    <span>📅 {project.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : !selectedSubProject ? (
          <>
            <div className="section-header">
              <div>
                <h2>Sub-Projects in {selectedMainProject.name}</h2>
                <p>Create and manage sub-projects for this main project</p>
              </div>
              <div className="section-actions">
                <button onClick={() => setShowCreateSubProjectForm(true)} className="create-btn">
                  ➕ Create Sub-Project
                </button>
                <button onClick={() => setSelectedMainProject(null)} className="back-btn">
                  ← Back to Projects
                </button>
              </div>
            </div>

            <div className="search-bar">
              <input
                type="text"
                placeholder="🔍 Search sub-projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {showCreateSubProjectForm && (
              <div className="modal-overlay" onClick={() => setShowCreateSubProjectForm(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <img src="/placeholder.svg?height=32&width=32&text=VP" alt="Vishvas Power" className="logo-small" />
                    <h3>Create New Sub-Project under {selectedMainProject.name}</h3>
                  </div>
                  <p>You can add companies to this sub-project after creation.</p>
                  <div className="form-group">
                    <label>Sub-Project Name</label>
                    <input
                      type="text"
                      placeholder="Enter sub-project name"
                      value={newSubProject.name}
                      onChange={(e) => setNewSubProject({ ...newSubProject, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Enter sub-project description"
                      value={newSubProject.description}
                      onChange={(e) => setNewSubProject({ ...newSubProject, description: e.target.value })}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="modal-actions">
                    <button
                      onClick={handleCreateSubProject}
                      className="submit-btn"
                      disabled={!newSubProject.name || !newSubProject.description}
                    >
                      Create Sub-Project
                    </button>
                    <button onClick={() => setShowCreateSubProjectForm(false)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="projects-grid">
              {filteredSubProjects.map((subProject) => {
                const subProjectCompanies = getSubProjectCompanies(subProject.id)
                const firstCompany = subProjectCompanies.length > 0 ? subProjectCompanies[0] : null

                return (
                  <div key={subProject.id} className="project-card">
                    <div className="project-header">
                      <div className="project-icon" style={{ backgroundColor: selectedDepartment.color }}>
                        📦
                      </div>
                      <span className={`status-badge ${getStatusColor(subProject.status)}`}>{subProject.status}</span>
                    </div>
                    <h3>{subProject.name}</h3>
                    <p>{subProject.description}</p>
                    <div className="project-footer">
                      <span>🏢 {subProjectCompanies.length} companies</span>
                      <span>📅 {subProject.createdAt}</span>
                    </div>
                    <div
                      className="sub-project-actions"
                      style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "flex-end" }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation() // Prevent card click
                          if (firstCompany) {
                            setSelectedSubProject(subProject) // Navigate to company list
                            handleViewSubmittedForms(firstCompany)
                          } else {
                            alert("No companies in this sub-project to view forms for. Please add a company first.")
                          }
                        }}
                        className="view-forms-btn"
                        style={{
                          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        📋 View Forms
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation() // Prevent card click
                          if (firstCompany) {
                            setSelectedSubProject(subProject) // Navigate to company list
                            handleViewSubmittedForms(firstCompany) // Changed to show forms
                          } else {
                            alert("No companies in this sub-project to view details for. Please add a company first.")
                          }
                        }}
                        className="view-btn"
                        style={{
                          background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        👁️ View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation() // Prevent card click
                          if (firstCompany) {
                            setSelectedSubProject(subProject) // Navigate to company list
                            const nextStage = firstCompany.stage
                            const canSubmit = nextStage === 1 || firstCompany.stageApprovals[nextStage - 1]
                            if (canSubmit && !firstCompany.submittedStages[nextStage]) {
                              setFormStageCompany(firstCompany)
                              setFormStageStage(nextStage)
                              setShowFormStage(true)
                            } else if (firstCompany.submittedStages[nextStage]) {
                              alert(`Stage ${nextStage} forms already submitted for ${firstCompany.name}!`)
                            } else {
                              alert(`Stage ${nextStage - 1} must be approved first for ${firstCompany.name}!`)
                            }
                          } else {
                            alert("No companies in this sub-project to submit forms for. Please add a company first.")
                          }
                        }}
                        className="submit-test-btn"
                        style={{
                          background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        📝 Submit Stage {firstCompany?.stage || 1}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <>
            <div className="section-header">
              <div>
                <h2>Companies in {selectedSubProject.name}</h2>
                <p>Manage companies and their workflows</p>
              </div>
              <div className="section-actions">
                <button onClick={() => handleAddCompany(selectedSubProject.id)} className="create-btn">
                  ➕ Add Company
                </button>
                <button onClick={() => setSelectedSubProject(null)} className="back-btn">
                  ← Back to Sub-Projects
                </button>
              </div>
            </div>

            <div className="companies-grid">
              {getSubProjectCompanies(selectedSubProject.id).length === 0 ? (
                <p className="no-data-message">
                  No companies found for this sub-project. Click "Add Company" to create one.
                </p>
              ) : (
                getSubProjectCompanies(selectedSubProject.id).map((company) => (
                  <div key={company.id} className="company-card">
                    <div className="company-header">
                      <div className="company-icon" style={{ backgroundColor: "#1E3A8A" }}>
                        🏢
                      </div>
                      <span className={`status-badge ${getStatusColor(company.status)}`}>
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
                      ></div>
                    </div>
                    <div className="company-footer">
                      <span>📊 {Math.round((company.formsCompleted / company.totalForms) * 100)}% complete</span>
                      <span>📅 {company.lastActivity}</span>
                    </div>

                    <div className="stage-management">
                      <h4>Stage Management:</h4>
                      <div className="stages-row">
                        {[1, 2, 3, 4, 5, 6].map((stage) => {
                          const stageStatus = getStageStatus(company, stage)
                          return (
                            <div key={stage} className={`stage-item ${stageStatus}`}>
                              <div className="stage-number">{stage}</div>
                              <div className="stage-status-text">
                                {stageStatus === "approved" && "✅ Approved"}
                                {stageStatus === "pending-approval" && "⏳ Pending"}
                                {stageStatus === "available" && "📝 Available"}
                                {stageStatus === "locked" && "🔒 Locked"}
                              </div>
                              {stageStatus === "pending-approval" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleReviewStage(company, stage)
                                  }}
                                  className="review-stage-btn"
                                >
                                  Review
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="company-actions" style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewSubmittedForms(company)
                        }}
                        className="view-forms-btn"
                        style={{
                          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        📋 View Forms
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewSubmittedForms(company) // Changed to show forms
                        }}
                        className="view-btn"
                        style={{
                          background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        👁️ View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const nextStage = company.stage
                          const canSubmit = nextStage === 1 || company.stageApprovals[nextStage - 1]
                          if (canSubmit && !company.submittedStages[nextStage]) {
                            setFormStageCompany(company)
                            setFormStageStage(nextStage)
                            setShowFormStage(true)
                          } else if (company.submittedStages[nextStage]) {
                            alert(`Stage ${nextStage} forms already submitted!`)
                          } else {
                            alert(`Stage ${nextStage - 1} must be approved first!`)
                          }
                        }}
                        className="submit-test-btn"
                        style={{
                          background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                          color: "white",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        📝 Submit Stage {company.stage}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        <div className="dashboard-footer">
          <div className="footer-logo">
            <img src="/placeholder.svg?height=40&width=120&text=Vishvas+Power" alt="Vishvas Power" className="logo" />
            <p>Powered by Vishvas Power</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ETCAdminPanel
