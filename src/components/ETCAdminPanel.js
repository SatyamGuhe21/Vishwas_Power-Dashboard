"use client"

import { useState, useEffect } from "react"
import FormStage from "./FormStage" // Import FormStage
import "./stage-review-styles.css"

const ETCAdminPanel = ({ user, selectedProject, onLogout, onProjectSelect, onCompanySelect, onBackToMain }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [departments, setDepartments] = useState([])
  const [projects, setProjects] = useState([])
  const [companies, setCompanies] = useState([])
  const [submittedForms, setSubmittedForms] = useState([])

  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [selectedMainProject, setSelectedMainProject] = useState(null)

  const [newProject, setNewProject] = useState({ name: "", description: "" })
  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false)

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

  const defaultCompanies = []
  const mockSubmittedForms = []

  // Load data from localStorage on component mount
  useEffect(() => {
    setDepartments(defaultDepartments)

    const savedProjects = localStorage.getItem("etc_projects")
    const savedCompanies = localStorage.getItem("etc_companies")
    const savedSubmittedForms = localStorage.getItem("etc_submitted_forms")

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      setProjects(defaultProjects)
      localStorage.setItem("etc_projects", JSON.stringify(defaultProjects))
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
      alert(`Project "${project.name}" created successfully in ${selectedDepartment.name}!`)
    }
  }

  const handleAddCompany = (projectId) => {
    const companyName = prompt("Enter company name:")
    if (companyName) {
      const newCompany = {
        id: Math.max(...companies.map((c) => c.id), 0) + 1,
        name: companyName,
        projectId: projectId,
        stage: 1,
        formsCompleted: 0,
        totalForms: getStageFormCount(1),
        status: "in-progress",
        lastActivity: new Date().toISOString().split("T")[0],
        stageApprovals: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false },
        submittedStages: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false },
      }
      setCompanies((prev) => [...prev, newCompany])
      alert(`Company "${companyName}" added to this project!`)
    }
  }

  // Helper function to get form count for each stage
  const getStageFormCount = (stage) => {
    const stageForms = {
      1: 4, // Stage 1 has 4 forms
      2: 1, // Stage 2 has 1 form
      3: 7, // Stage 3 has 7 forms
      4: 6, // Stage 4 has 6 forms
      5: 1, // Stage 5 has 1 form
      6: 1, // Stage 6 has 1 form
    }
    return stageForms[stage] || 1
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
    if (!selectedCompanyForReview) {
      alert("No company selected for review.")
      return
    }

    console.log(`Approving stage ${stage} for company ${selectedCompanyForReview.name}`)

    // Update submitted forms status
    setSubmittedForms((forms) =>
      forms.map((form) =>
        form.companyId === selectedCompanyForReview.id && form.stage === stage
          ? { ...form, status: "approved", reviewedAt: new Date().toISOString().split("T")[0] }
          : form,
      ),
    )

    // Update company status and unlock next stage
    setCompanies((companies) =>
      companies.map((company) =>
        company.id === selectedCompanyForReview.id
          ? {
              ...company,
              stageApprovals: { ...company.stageApprovals, [stage]: true },
              submittedStages: { ...company.submittedStages, [stage]: true },
              status: stage === 6 ? "completed" : "in-progress",
              stage: stage === 6 ? 6 : stage + 1, // Move to next stage
              formsCompleted: 0, // Reset forms for next stage
              totalForms: stage === 6 ? getStageFormCount(6) : getStageFormCount(stage + 1), // Update total forms for next stage
              lastActivity: new Date().toISOString().split("T")[0],
            }
          : company,
      ),
    )

    alert(
      `Stage ${stage} approved for ${selectedCompanyForReview.name}! ${stage === 6 ? "Company completed all stages." : `Stage ${stage + 1} is now available.`}`,
    )
    setReviewMode(false)
    setSelectedCompanyForReview(null)
    setCurrentStageReview(1)
  }

  const handleRejectStage = (stage) => {
    if (!selectedCompanyForReview) {
      alert("No company selected for review.")
      return
    }

    const rejectionReason = prompt("Please provide a reason for rejecting this stage:")
    if (!rejectionReason) return

    console.log(`Rejecting stage ${stage} for company ${selectedCompanyForReview.name}`)

    // Update submitted forms status
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

    // Reset company stage submission status
    setCompanies((companies) =>
      companies.map((company) =>
        company.id === selectedCompanyForReview.id
          ? {
              ...company,
              status: "in-progress",
              submittedStages: { ...company.submittedStages, [stage]: false },
              stageApprovals: { ...company.stageApprovals, [stage]: false },
              formsCompleted: 0, // Reset forms completed for this stage
              totalForms: getStageFormCount(stage), // Reset total forms for current stage
              lastActivity: new Date().toISOString().split("T")[0],
            }
          : company,
      ),
    )

    alert(`Stage ${stage} rejected for ${selectedCompanyForReview.name}. Company needs to resubmit forms.`)
    setReviewMode(false)
    setSelectedCompanyForReview(null)
    setCurrentStageReview(1)
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

  const getProjectCompanies = (projectId) => {
    return companies.filter((company) => company.projectId === projectId)
  }

  const filteredProjects = selectedDepartment
    ? getDepartmentProjects(selectedDepartment.id).filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
    localStorage.removeItem("etc_companies")
    localStorage.removeItem("etc_submitted_forms")

    setProjects([])
    setCompanies([])
    setSubmittedForms([])
    setSelectedDepartment(null)
    setSelectedMainProject(null)
    setSelectedCompanyForReview(null)
    setReviewMode(false)
    setShowSubmitterReview(false)
    setShowFormStage(false)

    onLogout()
  }

  // Function to handle form submission from FormStage
  const handleFormStageSubmit = (stage, submittedData) => {
    console.log(`Submitting forms for stage ${stage}:`, submittedData)

    const newFormEntry = {
      id: Math.max(...submittedForms.map((f) => f.id), 0) + 1,
      companyId: formStageCompany.id,
      stage: stage,
      formName: `Stage ${stage} Forms`,
      submittedAt: new Date().toISOString().split("T")[0],
      status: "pending-review",
      data: submittedData,
    }

    setSubmittedForms((prev) => [...prev, newFormEntry])

    // Update company to show forms submitted and pending approval
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === formStageCompany.id
          ? {
              ...company,
              status: "pending-approval",
              submittedStages: { ...company.submittedStages, [stage]: true },
              formsCompleted: getStageFormCount(stage),
              lastActivity: new Date().toISOString().split("T")[0],
            }
          : company,
      ),
    )

    alert(`Forms for Stage ${stage} submitted successfully! Waiting for ETC Admin approval.`)
    setShowFormStage(false)
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

            <img src="/logo.png" alt="Vishvas Power" className="logo" />
            <div className="header-title">
              <h1>
                {showFormStage
                  ? `Submit Forms - ${formStageCompany?.name} (Stage ${formStageStage})`
                  : reviewMode
                    ? `Review Stage ${currentStageReview} - ${selectedCompanyForReview?.name}`
                    : showSubmitterReview
                      ? `Submitted Forms - ${selectedCompanyForReview?.name}`
                      : selectedMainProject
                        ? `${selectedMainProject.name} - Companies`
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
                      : selectedMainProject
                        ? "Manage companies and their workflows"
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
                  <img src="/logo.png" alt="Vishvas Power" className="logo-small" />
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
                disabled={currentStageForms.length === 0}
              >
                ✅ Approve Stage {currentStageReview}
              </button>
              <button
                onClick={() => handleRejectStage(currentStageReview)}
                className="reject-stage-btn"
                disabled={currentStageForms.length === 0}
              >
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
                <p>Select a category to manage projects and companies</p>
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
                          return acc + getProjectCompanies(proj.id).length
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
                  ➕ Create Company
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
                    <img src="/logo.png" alt="Vishvas Power" className="logo-small" />
                    <h3>Create New Project in {selectedDepartment.name}</h3>
                  </div>
                  <p>Companies will be added to this project after creation</p>
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
                      Create Company
                    </button>
                    <button onClick={() => setShowCreateProjectForm(false)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="projects-grid">
              {filteredProjects.map((project) => {
                const projectCompanies = getProjectCompanies(project.id)

                return (
                  <div key={project.id} className="project-card">
                    <div className="project-header">
                      <div className="project-icon" style={{ backgroundColor: selectedDepartment.color }}>
                        📁
                      </div>
                      <span className={`status-badge ${getStatusColor(project.status)}`}>{project.status}</span>
                    </div>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <div className="project-footer">
                      <span>🏢 {projectCompanies.length} companies</span>
                      <span>📅 {project.createdAt}</span>
                    </div>
                    <div
                      className="project-actions"
                      style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "flex-end" }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedMainProject(project)
                        }}
                        className="view-btn"
                        style={{
                          background: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
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
                        👁️ View Companies
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
                <h2>Companies in {selectedMainProject.name}</h2>
                <p>Manage companies and their workflows</p>
              </div>
              <div className="section-actions">
                <button onClick={() => handleAddCompany(selectedMainProject.id)} className="create-btn">
                  ➕ Create Project
                </button>
                <button onClick={() => setSelectedMainProject(null)} className="back-btn">
                  ← Back to Projects
                </button>
              </div>
            </div>

            <div className="companies-grid">
              {getProjectCompanies(selectedMainProject.id).length === 0 ? (
                <p className="no-data-message">
                  No companies found for this project. Click "Create Project" to create one.
                </p>
              ) : (
                getProjectCompanies(selectedMainProject.id).map((company) => (
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
            <img src="/logo.png" alt="Vishvas Power" className="logo" />
            <p>Powered by Vishvas Power</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ETCAdminPanel
