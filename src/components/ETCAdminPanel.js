"use client"

import { useState, useEffect } from "react"
import FormStage from "./FormStage" // Import FormStage
import "./stage-review-styles.css"

const ETCAdminPanel = ({ user, selectedCompany, onLogout, onCompanySelect, onProjectSelect, onBackToMain }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [departments, setDepartments] = useState([])
  const [Companys, setCompanys] = useState([])
  const [companies, setCompanies] = useState([])
  const [submittedForms, setSubmittedForms] = useState([])

  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [selectedMainCompany, setSelectedMainCompany] = useState(null)

  const [newCompany, setNewCompany] = useState({ name: "", description: "" })
  const [showCreateCompanyForm, setShowCreateCompanyForm] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [reviewMode, setReviewMode] = useState(false)
  const [selectedProjectForReview, setSelectedProjectForReview] = useState(null)
  const [currentStageReview, setCurrentStageReview] = useState(1)
  const [showSubmitterReview, setShowSubmitterReview] = useState(false)

  // State for showing and managing FormStage
  const [showFormStage, setShowFormStage] = useState(false)
  const [formStageProject, setFormStageProject] = useState(null)
  const [formStageStage, setFormStageStage] = useState(1)

  // Modal states for replacing alerts and prompts
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("info") // info, success, error, warning

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState("")
  const [confirmAction, setConfirmAction] = useState(null)

  const [showInputModal, setShowInputModal] = useState(false)
  const [inputModalTitle, setInputModalTitle] = useState("")
  const [inputModalPlaceholder, setInputModalPlaceholder] = useState("")
  const [inputModalValue, setInputModalValue] = useState("")
  const [inputModalAction, setInputModalAction] = useState(null)

  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [rejectionStage, setRejectionStage] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")

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

  const defaultCompanys = [
    {
      id: 101,
      name: "Smart City Infrastructure",
      description: "Urban development Company for smart city implementation",
      status: "active",
      createdAt: "2024-01-15",
      departmentId: 1,
    },
    {
      id: 102,
      name: "Railway Electrification",
      description: "Company for electrifying railway lines",
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

  // Helper functions for modals
  const showNotification = (message, type = "info") => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotificationModal(true)
  }

  const showConfirmDialog = (message, action) => {
    setConfirmMessage(message)
    setConfirmAction(() => action)
    setShowConfirmModal(true)
  }

  const showInputDialog = (title, placeholder, action) => {
    setInputModalTitle(title)
    setInputModalPlaceholder(placeholder)
    setInputModalValue("")
    setInputModalAction(() => action)
    setShowInputModal(true)
  }

  // Load data from localStorage on component mount
  useEffect(() => {
    setDepartments(defaultDepartments)

    const savedCompanys = localStorage.getItem("etc_Companys")
    const savedCompanies = localStorage.getItem("etc_companies")
    const savedSubmittedForms = localStorage.getItem("etc_submitted_forms")

    if (savedCompanys) {
      setCompanys(JSON.parse(savedCompanys))
    } else {
      setCompanys(defaultCompanys)
      localStorage.setItem("etc_Companys", JSON.stringify(defaultCompanys))
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
    localStorage.setItem("etc_Companys", JSON.stringify(Companys))
  }, [Companys])

  useEffect(() => {
    localStorage.setItem("etc_companies", JSON.stringify(companies))
  }, [companies])

  useEffect(() => {
    localStorage.setItem("etc_submitted_forms", JSON.stringify(submittedForms))
  }, [submittedForms])

  const handleCreateCompany = () => {
    if (newCompany.name && newCompany.description && selectedDepartment) {
      const CompanyId = Math.max(...Companys.map((p) => p.id), 0) + 1

      const Company = {
        id: CompanyId,
        name: newCompany.name,
        description: newCompany.description,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        departmentId: selectedDepartment.id,
      }

      setCompanys([...Companys, Company])
      setNewCompany({ name: "", description: "" })
      setShowCreateCompanyForm(false)
      showNotification(`Company "${Company.name}" created successfully in ${selectedDepartment.name}!`, "success")
    }
  }

  const handleAddProject = (CompanyId) => {
    showInputDialog("Create New Project", "Enter Project name...", (ProjectName) => {
      if (ProjectName.trim()) {
        const newProject = {
          id: Math.max(...companies.map((c) => c.id), 0) + 1,
          name: ProjectName,
          CompanyId: CompanyId,
          stage: 1,
          formsCompleted: 0,
          totalForms: getStageFormCount(1),
          status: "in-progress",
          lastActivity: new Date().toISOString().split("T")[0],
          stageApprovals: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false },
          submittedStages: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false },
        }
        setCompanies((prev) => [...prev, newProject])
        showNotification(`Project "${ProjectName}" added to this Company!`, "success")
      }
    })
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

  const handleReviewStage = (Project, stage) => {
    const stageForms = submittedForms.filter((form) => form.ProjectId === Project.id && form.stage === stage)

    if (stageForms.length === 0) {
      showNotification(`No forms submitted for Stage ${stage} yet.`, "warning")
      return
    }

    setSelectedProjectForReview(Project)
    setCurrentStageReview(stage)
    setReviewMode(true)
  }

  const handleApproveStage = (stage) => {
    if (!selectedProjectForReview) {
      showNotification("No Project selected for review.", "error")
      return
    }

    console.log(`Approving stage ${stage} for Project ${selectedProjectForReview.name}`)

    // Update submitted forms status
    setSubmittedForms((forms) =>
      forms.map((form) =>
        form.ProjectId === selectedProjectForReview.id && form.stage === stage
          ? { ...form, status: "approved", reviewedAt: new Date().toISOString().split("T")[0] }
          : form,
      ),
    )

    // Update Project status and unlock next stage
    setCompanies((companies) =>
      companies.map((Project) =>
        Project.id === selectedProjectForReview.id
          ? {
              ...Project,
              stageApprovals: { ...Project.stageApprovals, [stage]: true },
              submittedStages: { ...Project.submittedStages, [stage]: true },
              status: stage === 6 ? "completed" : "in-progress",
              stage: stage === 6 ? 6 : stage + 1, // Move to next stage
              formsCompleted: 0, // Reset forms for next stage
              totalForms: stage === 6 ? getStageFormCount(6) : getStageFormCount(stage + 1), // Update total forms for next stage
              lastActivity: new Date().toISOString().split("T")[0],
            }
          : Project,
      ),
    )

    showNotification(
      `Stage ${stage} approved for ${selectedProjectForReview.name}! ${stage === 6 ? "Project completed all stages." : `Stage ${stage + 1} is now available.`}`,
      "success",
    )
    setReviewMode(false)
    setSelectedProjectForReview(null)
    setCurrentStageReview(1)
  }

  const handleRejectStage = (stage) => {
    if (!selectedProjectForReview) {
      showNotification("No Project selected for review.", "error")
      return
    }

    setRejectionStage(stage)
    setRejectionReason("")
    setShowRejectionModal(true)
  }

  const confirmRejectStage = () => {
    if (!rejectionReason.trim()) {
      showNotification("Please provide a reason for rejecting this stage.", "warning")
      return
    }

    console.log(`Rejecting stage ${rejectionStage} for Project ${selectedProjectForReview.name}`)

    // Update submitted forms status
    setSubmittedForms((forms) =>
      forms.map((form) =>
        form.ProjectId === selectedProjectForReview.id && form.stage === rejectionStage
          ? {
              ...form,
              status: "rejected",
              rejectionReason,
              reviewedAt: new Date().toISOString().split("T")[0],
            }
          : form,
      ),
    )

    // Reset Project stage submission status
    setCompanies((companies) =>
      companies.map((Project) =>
        Project.id === selectedProjectForReview.id
          ? {
              ...Project,
              status: "in-progress",
              submittedStages: { ...Project.submittedStages, [rejectionStage]: false },
              stageApprovals: { ...Project.stageApprovals, [rejectionStage]: false },
              formsCompleted: 0, // Reset forms completed for this stage
              totalForms: getStageFormCount(rejectionStage), // Reset total forms for current stage
              lastActivity: new Date().toISOString().split("T")[0],
            }
          : Project,
      ),
    )

    showNotification(
      `Stage ${rejectionStage} rejected for ${selectedProjectForReview.name}. Project needs to resubmit forms.`,
      "warning",
    )
    setShowRejectionModal(false)
    setRejectionStage(null)
    setRejectionReason("")
    setReviewMode(false)
    setSelectedProjectForReview(null)
    setCurrentStageReview(1)
  }

  const handleViewSubmittedForms = (Project) => {
    const ProjectForms = submittedForms.filter((form) => form.ProjectId === Project.id)
    if (ProjectForms.length === 0) {
      showNotification("No forms submitted yet.", "info")
      return
    }

    setSelectedProjectForReview(Project)
    setShowSubmitterReview(true)
  }

  const handleBackFromReview = () => {
    setReviewMode(false)
    setShowSubmitterReview(false)
    setSelectedProjectForReview(null)
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

  const getStageStatus = (Project, stage) => {
    if (Project.stageApprovals[stage]) return "approved"
    if (Project.submittedStages[stage]) return "pending-approval"
    if (stage === 1 || Project.stageApprovals[stage - 1]) return "available"
    return "locked"
  }

  const getDepartmentCompanys = (departmentId) => {
    return Companys.filter((Company) => Company.departmentId === departmentId)
  }

  const getCompanyCompanies = (CompanyId) => {
    return companies.filter((Project) => Project.CompanyId === CompanyId)
  }

  const filteredCompanys = selectedDepartment
    ? getDepartmentCompanys(selectedDepartment.id).filter((Company) =>
        Company.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const currentStageForms = reviewMode
    ? submittedForms.filter(
        (form) => form.ProjectId === selectedProjectForReview.id && form.stage === currentStageReview,
      )
    : []

  const allProjectForms = showSubmitterReview
    ? submittedForms.filter((form) => form.ProjectId === selectedProjectForReview.id)
    : []

  const handleLogoutAndClearData = () => {
    localStorage.removeItem("etc_Companys")
    localStorage.removeItem("etc_companies")
    localStorage.removeItem("etc_submitted_forms")

    setCompanys([])
    setCompanies([])
    setSubmittedForms([])
    setSelectedDepartment(null)
    setSelectedMainCompany(null)
    setSelectedProjectForReview(null)
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
      ProjectId: formStageProject.id,
      stage: stage,
      formName: `Stage ${stage} Forms`,
      submittedAt: new Date().toISOString().split("T")[0],
      status: "pending-review",
      data: submittedData,
    }

    setSubmittedForms((prev) => [...prev, newFormEntry])

    // Update Project to show forms submitted and pending approval
    setCompanies((prev) =>
      prev.map((Project) =>
        Project.id === formStageProject.id
          ? {
              ...Project,
              status: "pending-approval",
              submittedStages: { ...Project.submittedStages, [stage]: true },
              formsCompleted: getStageFormCount(stage),
              lastActivity: new Date().toISOString().split("T")[0],
            }
          : Project,
      ),
    )

    showNotification(`Forms for Stage ${stage} submitted successfully! Waiting for ETC Admin approval.`, "success")
    setShowFormStage(false)
    setFormStageProject(null)
    setFormStageStage(1)
  }

  // Function to go back from FormStage
  const handleBackFromFormStage = () => {
    setShowFormStage(false)
    setFormStageProject(null)
    setFormStageStage(1)
  }

  const handleStageSubmit = (Project) => {
    const nextStage = Project.stage
    const canSubmit = nextStage === 1 || Project.stageApprovals[nextStage - 1]

    if (canSubmit && !Project.submittedStages[nextStage]) {
      setFormStageProject(Project)
      setFormStageStage(nextStage)
      setShowFormStage(true)
    } else if (Project.submittedStages[nextStage]) {
      showNotification(`Stage ${nextStage} forms already submitted!`, "warning")
    } else {
      showNotification(`Stage ${nextStage - 1} must be approved first!`, "warning")
    }
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
                  ? `Submit Forms - ${formStageProject?.name} (Stage ${formStageStage})`
                  : reviewMode
                    ? `Review Stage ${currentStageReview} - ${selectedProjectForReview?.name}`
                    : showSubmitterReview
                      ? `Submitted Forms - ${selectedProjectForReview?.name}`
                      : selectedMainCompany
                        ? `${selectedMainCompany.name} - Companies`
                        : selectedDepartment
                          ? `${selectedDepartment.name} - Companys`
                          : "ETC Admin Panel"}
              </h1>
              <p>
                {showFormStage
                  ? "Fill out and submit the required forms for this stage."
                  : reviewMode
                    ? "Review and approve/reject stage forms"
                    : showSubmitterReview
                      ? "View all submitted forms by Project"
                      : selectedMainCompany
                        ? "Manage companies and their workflows"
                        : selectedDepartment
                          ? "Manage Companys in department"
                          : "Manage departments, Companys and companies"}
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
        {showFormStage && formStageProject ? (
          <FormStage
            stage={formStageStage}
            onFormSubmit={handleFormStageSubmit}
            onBack={handleBackFromFormStage}
            ProjectData={formStageProject}
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
                  <strong>Project:</strong> {selectedProjectForReview?.name}
                </p>
                <p>
                  <strong>Total Forms:</strong> {currentStageForms.length}
                </p>
                <p>
                  <strong>Status:</strong> {getStageStatus(selectedProjectForReview, currentStageReview)}
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
                <p>Review all forms submitted by {selectedProjectForReview?.name}</p>
              </div>
              <button onClick={handleBackFromReview} className="back-btn">
                ← Back to Companies
              </button>
            </div>

            <div className="submitter-review-summary">
              <div className="review-stats">
                <div className="stat-card">
                  <h4>Total Forms</h4>
                  <div className="stat-number">{allProjectForms.length}</div>
                </div>
                <div className="stat-card">
                  <h4>Approved</h4>
                  <div className="stat-number">{allProjectForms.filter((f) => f.status === "approved").length}</div>
                </div>
                <div className="stat-card">
                  <h4>Pending</h4>
                  <div className="stat-number">
                    {allProjectForms.filter((f) => f.status === "pending-review").length}
                  </div>
                </div>
                <div className="stat-card">
                  <h4>Rejected</h4>
                  <div className="stat-number">{allProjectForms.filter((f) => f.status === "rejected").length}</div>
                </div>
              </div>
            </div>

            <div className="stages-review-container">
              {[1, 2, 3, 4, 5, 6].map((stage) => {
                const stageForms = allProjectForms.filter((form) => form.stage === stage)
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
                <p>Select a category to manage Companys and companies</p>
              </div>
            </div>

            <div className="departments-grid">
              {departments.map((department) => {
                const departmentCompanys = getDepartmentCompanys(department.id)
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
                      <span>📁 {departmentCompanys.length} Companys</span>
                      <span>
                        🏢{" "}
                        {departmentCompanys.reduce((acc, proj) => {
                          return acc + getCompanyCompanies(proj.id).length
                        }, 0)}{" "}
                        companies
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : !selectedMainCompany ? (
          <>
            <div className="section-header">
              <div>
                <h2>Companys in {selectedDepartment.name}</h2>
                <p>Create and manage Companys for this category</p>
              </div>
              <div className="section-actions">
                <button onClick={() => setShowCreateCompanyForm(true)} className="create-btn">
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
                placeholder="🔍 Search Companys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {showCreateCompanyForm && (
              <div className="modal-overlay" onClick={() => setShowCreateCompanyForm(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <img src="/logo.png" alt="Vishvas Power" className="logo-small" />
                    <h3>Create New Company in {selectedDepartment.name}</h3>
                  </div>
                  <p>Companies will be added to this Company after creation</p>
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      placeholder="Enter Company name"
                      value={newCompany.name}
                      onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Enter Company description"
                      value={newCompany.description}
                      onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="modal-actions">
                    <button
                      onClick={handleCreateCompany}
                      className="submit-btn"
                      disabled={!newCompany.name || !newCompany.description}
                    >
                      Create Project
                    </button>
                    <button onClick={() => setShowCreateCompanyForm(false)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="Companys-grid">
              {filteredCompanys.map((Company) => {
                const CompanyCompanies = getCompanyCompanies(Company.id)

                return (
                  <div key={Company.id} className="Company-card">
                    <div className="Company-header">
                      <div className="Company-icon" style={{ backgroundColor: selectedDepartment.color }}>
                        📁
                      </div>
                      <span className={`status-badge ${getStatusColor(Company.status)}`}>{Company.status}</span>
                    </div>
                    <h3>{Company.name}</h3>
                    <p>{Company.description}</p>
                    <div className="Company-footer">
                      <span>🏢 {CompanyCompanies.length} companies</span>
                      <span>📅 {Company.createdAt}</span>
                    </div>
                    <div
                      className="Company-actions"
                      style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "flex-end" }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedMainCompany(Company)
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
                <h2>Companies in {selectedMainCompany.name}</h2>
                <p>Manage companies and their workflows</p>
              </div>
              <div className="section-actions">
                <button onClick={() => handleAddProject(selectedMainCompany.id)} className="create-btn">
                  ➕ Create Project
                </button>
                <button onClick={() => setSelectedMainCompany(null)} className="back-btn">
                  ← Back to Companys
                </button>
              </div>
            </div>

            <div className="companies-grid">
              {getCompanyCompanies(selectedMainCompany.id).length === 0 ? (
                <p className="no-data-message">
                  No companies found for this Company. Click "Create Company" to create one.
                </p>
              ) : (
                getCompanyCompanies(selectedMainCompany.id).map((Project) => (
                  <div key={Project.id} className="Project-card">
                    <div className="Project-header">
                      <div className="Project-icon" style={{ backgroundColor: "#1E3A8A" }}>
                        🏢
                      </div>
                      <span className={`status-badge ${getStatusColor(Project.status)}`}>
                        {Project.status === "pending-approval" && "⏳"}
                        {Project.status === "in-progress" && "🔄"}
                        {Project.status === "completed" && "✅"}
                        {Project.status}
                      </span>
                    </div>
                    <h3>{Project.name}</h3>
                    <p>
                      Stage {Project.stage} • {Project.formsCompleted}/{Project.totalForms} forms completed
                    </p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${(Project.formsCompleted / Project.totalForms) * 100}%` }}
                      ></div>
                    </div>
                    <div className="Project-footer">
                      <span>📊 {Math.round((Project.formsCompleted / Project.totalForms) * 100)}% complete</span>
                      <span>📅 {Project.lastActivity}</span>
                    </div>

                    <div className="stage-management">
                      <h4>Stage Management:</h4>
                      <div className="stages-row">
                        {[1, 2, 3, 4, 5, 6].map((stage) => {
                          const stageStatus = getStageStatus(Project, stage)
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
                                    handleReviewStage(Project, stage)
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

                    <div className="Project-actions" style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewSubmittedForms(Project)
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
                          handleStageSubmit(Project)
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
                        📝 Submit Stage {Project.stage}
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

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="modal-overlay" onClick={() => setShowNotificationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {notificationType === "success" && <span style={{ fontSize: "1.5rem" }}>✅</span>}
                {notificationType === "error" && <span style={{ fontSize: "1.5rem" }}>❌</span>}
                {notificationType === "warning" && <span style={{ fontSize: "1.5rem" }}>⚠️</span>}
                {notificationType === "info" && <span style={{ fontSize: "1.5rem" }}>ℹ️</span>}
                <h3>
                  {notificationType === "success" && "Success"}
                  {notificationType === "error" && "Error"}
                  {notificationType === "warning" && "Warning"}
                  {notificationType === "info" && "Information"}
                </h3>
              </div>
            </div>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.6", margin: "20px 0" }}>{notificationMessage}</p>
            <div className="modal-actions">
              <button onClick={() => setShowNotificationModal(false)} className="submit-btn">
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.5rem" }}>❓</span>
                <h3>Confirmation</h3>
              </div>
            </div>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.6", margin: "20px 0" }}>{confirmMessage}</p>
            <div className="modal-actions">
              <button
                onClick={() => {
                  if (confirmAction) confirmAction()
                  setShowConfirmModal(false)
                  setConfirmAction(null)
                }}
                className="submit-btn"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false)
                  setConfirmAction(null)
                }}
                className="cancel-btn"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Modal */}
      {showInputModal && (
        <div className="modal-overlay" onClick={() => setShowInputModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.5rem" }}>✏️</span>
                <h3>{inputModalTitle}</h3>
              </div>
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder={inputModalPlaceholder}
                value={inputModalValue}
                onChange={(e) => setInputModalValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && inputModalValue.trim()) {
                    if (inputModalAction) inputModalAction(inputModalValue.trim())
                    setShowInputModal(false)
                    setInputModalAction(null)
                    setInputModalValue("")
                  }
                }}
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={() => {
                  if (inputModalValue.trim() && inputModalAction) {
                    inputModalAction(inputModalValue.trim())
                  }
                  setShowInputModal(false)
                  setInputModalAction(null)
                  setInputModalValue("")
                }}
                className="submit-btn"
                disabled={!inputModalValue.trim()}
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setShowInputModal(false)
                  setInputModalAction(null)
                  setInputModalValue("")
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="modal-overlay" onClick={() => setShowRejectionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.5rem" }}>❌</span>
                <h3>Reject Stage {rejectionStage}</h3>
              </div>
            </div>
            <p style={{ fontSize: "1rem", color: "#666", marginBottom: "20px" }}>
              Please provide a detailed reason for rejecting this stage. This will help the submitter understand what
              needs to be corrected.
            </p>
            <div className="form-group">
              <label>Rejection Reason *</label>
              <textarea
                placeholder="Enter detailed reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows="4"
                style={{ minHeight: "120px" }}
                required
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={confirmRejectStage}
                className="reject-stage-btn"
                disabled={!rejectionReason.trim()}
                style={{
                  background: rejectionReason.trim() ? "linear-gradient(135deg, #f44336, #d32f2f)" : "#ccc",
                  cursor: rejectionReason.trim() ? "pointer" : "not-allowed",
                }}
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => {
                  setShowRejectionModal(false)
                  setRejectionStage(null)
                  setRejectionReason("")
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ETCAdminPanel
