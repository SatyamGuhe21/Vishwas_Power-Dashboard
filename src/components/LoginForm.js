"use client"

import { useState, useEffect } from "react"

const LoginForm = ({ onLogin, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    roleAndDept: "",
  })
  const [error, setError] = useState("")
  const [departments, setDepartments] = useState([])
  const [adminOptions, setAdminOptions] = useState([])

  useEffect(() => {
    const savedDepartments = JSON.parse(localStorage.getItem("departments") || "[]")
    setDepartments(savedDepartments)

    const options = [
      { value: "main-admin", label: "🛡️ Main Admin" },
      { value: "etc-admin", label: "🏢 ETC Admin" },
      { value: "company-admin", label: "👥 Company Admin" },
      { value: "site-engineer", label: "🔧 Site Engineer" },
    ]

    savedDepartments.forEach((dept) => {
      options.push({ value: `dept-${dept}`, label: `🏛️ ${dept} Department Admin` })
    })

    setAdminOptions(options)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    let role, department
    if (formData.roleAndDept.startsWith("dept-")) {
      role = "department-admin"
      department = formData.roleAndDept.substring(5)
    } else {
      role = formData.roleAndDept
      department = ""
    }

    // Check for registered users first
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const user = registeredUsers.find(
      (u) =>
        u.email === formData.email &&
        u.password === formData.password &&
        (u.role === role || (u.role === "department-admin" && u.department === department)),
    )

    if (user) {
      console.log("User found in registered users:", user)
      onLogin(user)
    } else {
      // Allow login with any credentials for demo purposes
      if (formData.email && formData.password && formData.roleAndDept) {
        const demoUser = {
          id: Date.now(),
          email: formData.email,
          role,
          department,
          name: formData.email.split("@")[0],
        }
        console.log("Demo login for user:", demoUser)
        onLogin(demoUser)
      } else {
        setError("Please fill in all required fields")
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            <div className="logo-large">⚡</div>
          </div>
          <h1>Admin Portal</h1>
          <p>Sign in to access your dashboard</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>
              Admin Type <span className="required">*</span>
            </label>
            <select
              value={formData.roleAndDept}
              onChange={(e) => setFormData({ ...formData, roleAndDept: e.target.value })}
              required
            >
              <option value="">Select admin type</option>
              {adminOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              placeholder="admin@vishvaspower.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Password <span className="required">*</span>
            </label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-btn primary"
            disabled={!formData.email || !formData.password || !formData.roleAndDept}
          >
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button type="button" className="link-btn" onClick={onSwitchToRegister}>
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
