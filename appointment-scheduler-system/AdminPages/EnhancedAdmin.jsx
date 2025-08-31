"use client"

import { useState, useEffect } from "react"
import {
  BarChart3,
  Building2,
  TrendingUp,
  Bell,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Upload,
  Calendar,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Menu,
  X,
  MoreHorizontal,
} from "lucide-react"

const EnhancedLineChart = () => {
  return (
    <div>
      {/* Placeholder for EnhancedLineChart */}
      <p>Enhanced Line Chart Component</p>
    </div>
  )
}

const EnhancedAdmin = () => {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [notificationCount, setNotificationCount] = useState(3)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [companies, setCompanies] = useState([])
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true)
  const [companiesError, setCompaniesError] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true)
  const [recentActivities, setRecentActivities] = useState([])

  const fetchCompanies = async () => {
    try {
      setIsLoadingCompanies(true)
      setCompaniesError(null)

      const response = await fetch("http://localhost:5000/api/companies")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setCompanies(result.data)
        updateRecentActivities("company", result.data[result.data.length - 1]?.name)
      } else {
        throw new Error(result.message || "Failed to fetch companies")
      }
    } catch (error) {
      console.error("Error fetching companies:", error)
      setCompaniesError(error.message)
      setCompanies([])
    } finally {
      setIsLoadingCompanies(false)
    }
  }

  const fetchAppointments = async () => {
    try {
      setIsLoadingAppointments(true)
      const response = await fetch("http://localhost:5000/api/appointments")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setAppointments(result.data)
        // Update recent activities for appointments
        if (result.data.length > 0) {
          updateRecentActivities("appointment", result.data[result.data.length - 1])
        }
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
      setAppointments([])
    } finally {
      setIsLoadingAppointments(false)
    }
  }

  const updateRecentActivities = (type, data) => {
    const now = new Date()
    let newActivity = {}

    if (type === "company" && data) {
      newActivity = {
        title: "New company registered",
        description: `${data} joined the platform`,
        time: "Just now",
        icon: Building2,
        color: "bg-chart-1",
        timestamp: now,
      }
    } else if (type === "appointment" && data) {
      newActivity = {
        title: "New appointment scheduled",
        description: `Appointment #${data.id} has been booked`,
        time: "Just now",
        icon: Calendar,
        color: "bg-chart-2",
        timestamp: now,
      }
    }

    if (Object.keys(newActivity).length > 0) {
      setRecentActivities((prev) => [newActivity, ...prev.slice(0, 3)])
    }
  }

  useEffect(() => {
    fetchCompanies()
    fetchAppointments()
    setRecentActivities([
      {
        title: "System initialized",
        description: "Admin dashboard loaded successfully",
        time: "1 minute ago",
        icon: CheckCircle,
        color: "bg-chart-4",
        timestamp: new Date(Date.now() - 60000),
      },
    ])
  }, [])

  const getCompanyAppointmentCount = async (companyId) => {
    try {
      const response = await fetch(`/api/appointments/countByCompany/${companyId}`)
      const data = await response.json()
      return data.success ? data.data.total_appointees : 0
    } catch (error) {
      console.error("Error fetching appointment count:", error)
      return 0
    }
  }

  const handleNavigation = (page) => {
    setCurrentPage(page)
    setSidebarOpen(false)
  }

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <ModernDashboardView
            companies={companies}
            isLoading={isLoadingCompanies}
            appointments={appointments}
            isLoadingAppointments={isLoadingAppointments}
            recentActivities={recentActivities}
            getCompanyAppointmentCount={getCompanyAppointmentCount}
          />
        )
      case "addCompany":
        return <ModernAddCompanyForm onCompanyAdded={fetchCompanies} />
      case "viewCompanies":
        return (
          <ModernViewCompaniesList
            companies={companies}
            isLoading={isLoadingCompanies}
            error={companiesError}
            getCompanyAppointmentCount={getCompanyAppointmentCount}
          />
        )
      case "template":
        return <ModernTemplateForm />
      default:
        return (
          <ModernDashboardView
            companies={companies}
            isLoading={isLoadingCompanies}
            appointments={appointments}
            isLoadingAppointments={isLoadingAppointments}
            recentActivities={recentActivities}
            getCompanyAppointmentCount={getCompanyAppointmentCount}
          />
        )
    }
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "addCompany", label: "Add Company", icon: Plus },
    { id: "viewCompanies", label: "Companies", icon: Building2 },
    { id: "template", label: "Templates", icon: Edit },
  ]

  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col
      `}
      >
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-sidebar-foreground">Kati Admin</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                  hover-lift group relative overflow-hidden
                  ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                      : "text-sidebar-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-sidebar-primary-foreground" : ""}`}
                />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl" />
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-muted">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@kati.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {currentPage === "dashboard" && "Dashboard Overview"}
                  {currentPage === "addCompany" && "Add New Company"}
                  {currentPage === "viewCompanies" && "Company Management"}
                  {currentPage === "template" && "Template Designer"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentPage === "dashboard" && "Monitor your business performance"}
                  {currentPage === "addCompany" && "Register a new company in the system"}
                  {currentPage === "viewCompanies" && "View and manage registered companies"}
                  {currentPage === "template" && "Create and customize company templates"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button className="p-2 rounded-lg hover:bg-muted transition-colors relative">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce-subtle">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Profile */}
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center hover-lift cursor-pointer">
                <span className="text-sm font-bold text-white">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="animate-fade-in">{renderContent()}</div>
        </div>
      </main>
    </div>
  )
}

const ModernDashboardView = ({
  companies = [],
  isLoading = false,
  appointments = [],
  isLoadingAppointments = false,
  recentActivities = [],
  getCompanyAppointmentCount = () => 0,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")
  const [companyAppointmentCounts, setCompanyAppointmentCounts] = useState({})

  useEffect(() => {
    const fetchAppointmentCounts = async () => {
      const counts = {}
      for (const company of companies) {
        try {
          const response = await fetch(`/api/appointments/countByCompany/${company.id}`)
          const data = await response.json()
          counts[company.id] = data.success ? data.data.total_appointees : 0
        } catch (error) {
          console.error(`Error fetching count for company ${company.id}:`, error)
          counts[company.id] = 0
        }
      }
      setCompanyAppointmentCounts(counts)
    }

    if (companies.length > 0) {
      fetchAppointmentCounts()
    }
  }, [companies])

  const stats = [
    {
      title: "Total Companies",
      value: isLoading ? "..." : companies.length.toString(),
      change: "+12%",
      trend: "up",
      icon: Building2,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Appointments",
      value: isLoadingAppointments ? "..." : appointments.length.toString(),
      change: "+8%",
      trend: "up",
      icon: Calendar,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Active Companies",
      value: isLoading ? "..." : companies.filter((c) => c.status === "Active").length.toString(),
      change: "+5%",
      trend: "up",
      icon: Activity,
      color: "from-purple-500 to-purple-600",
    },
  ]

  const topCompaniesData = companies
    .map((company) => ({
      company: company.name,
      count: companyAppointmentCounts[company.id] || 0,
      status: company.status === "Active" ? "High" : "Medium",
      growth: `+${Math.floor(Math.random() * 25) + 5}%`,
      avatar: company.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2),
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-card rounded-lg p-3 border border-border hover-lift cursor-pointer group animate-slide-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div
                  className={`flex items-center space-x-1 text-xs font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <TrendingUp className={`w-3 h-3 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity - Updated with real data */}
        <div className="bg-card rounded-lg p-4 border border-border hover-lift">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
              <p className="text-xs text-muted-foreground">Live system updates</p>
            </div>
            <button className="p-1 hover:bg-muted rounded-lg transition-colors">
              <Filter className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
          <div className="space-y-2">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activity.color}`}>
                    <activity.icon className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Activity className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border border-border hover-lift">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">Top Companies</h3>
              <p className="text-xs text-muted-foreground">By appointment count</p>
            </div>
            <button className="p-1 hover:bg-muted rounded-lg transition-colors">
              <MoreHorizontal className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
          <div className="space-y-2">
            {topCompaniesData.length > 0 ? (
              topCompaniesData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{item.avatar}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{item.company}</p>
                      <p className="text-xs text-muted-foreground">{item.status} activity</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-foreground">{item.count}</p>
                    <p className="text-xs text-green-600">{item.growth}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No appointment data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {appointments.length > 0 && (
        <div className="bg-card rounded-lg p-4 border border-border hover-lift">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">Recent Appointments</h3>
              <p className="text-xs text-muted-foreground">Latest company bookings</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {appointments.slice(0, 8).map((appointment, index) => (
              <div
                key={appointment.id || index}
                className="p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors text-center"
              >
                <p className="text-xs font-medium text-foreground truncate">
                  {appointment.company_name || "Unknown Company"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {appointment.appointment_date
                    ? new Date(appointment.appointment_date).toLocaleDateString()
                    : "No date"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const ModernAddCompanyForm = ({ onCompanyAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    password: "",
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Company name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.password) newErrors.password = "Password is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:5000/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Server error: ${response.status}`)
      }

      const result = await response.json()

      setSuccessMessage(result.message || "Company added successfully!")
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "",
        password: "",
      })

      if (onCompanyAdded) {
        onCompanyAdded()
      }
    } catch (error) {
      console.error("Error adding company:", error)
      setErrors({ submit: error.message })
    } finally {
      setIsSubmitting(false)

      setTimeout(() => {
        setSuccessMessage("")
        setErrors({})
      }, 5000)
    }
  }

  // Update the test connection function to test the actual API endpoint
  const testServerConnection = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/companies", {
        method: "OPTIONS", // Test with OPTIONS to check CORS
      })
      console.log("OPTIONS test response status:", response.status)

      if (response.status === 204 || response.status === 200) {
        console.log("CORS preflight is working!")
        setErrors({ submit: "CORS preflight is working! You can now submit the form." })
      } else {
        setErrors({ submit: `CORS preflight test failed with status: ${response.status}` })
      }
    } catch (error) {
      console.error("CORS test failed:", error)
      setErrors({ submit: "CORS preflight failed. Please check your backend CORS configuration." })
    }
  }
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-2xl border border-border overflow-hidden hover-lift">
        {successMessage && (
          <div className="bg-chart-1/10 border-l-4 border-chart-1 p-4 m-6 rounded-lg animate-slide-in-up">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-chart-1 mr-3" />
              <p className="text-chart-1 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 m-6 rounded-lg animate-slide-in-up">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-destructive mr-3" />
              <p className="text-destructive font-medium">{errors.submit}</p>
            </div>
            <div className="mt-3">
              <button
                onClick={testServerConnection}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                Test Server Connection
              </button>
            </div>
            <p className="text-sm text-destructive mt-2">
              Expected JSON structure:
              <br />
              <code className="text-xs bg-muted p-1 rounded">
                {"{"}
                "name": "Company Name", "email": "email@example.com", "phone": "123-456-7890", "category": "Category",
                "password": "password123"
                {"}"}
              </code>
            </p>
          </div>
        )}

        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Add New Company</h3>
            <p className="text-muted-foreground">Fill in the details below to register a new company in the system.</p>
            <p className="text-sm text-muted-foreground mt-2">API Endpoint: /api/companies</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-foreground border-b border-border pb-2">Basic Information</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-foreground">
                    Company Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-input border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                      errors.name ? "border-destructive" : "border-border"
                    }`}
                    placeholder="Enter company name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-input border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                      errors.email ? "border-destructive" : "border-border"
                    }`}
                    placeholder="company@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-input border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                      errors.phone ? "border-destructive" : "border-border"
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="block text-sm font-medium text-foreground">
                    Category <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-input border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                      errors.category ? "border-destructive" : "border-border"
                    }`}
                  >
                    <option value="">Select a category</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Retail">Retail</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.category && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-input border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                      errors.password ? "border-destructive" : "border-border"
                    }`}
                    placeholder="Enter password (min. 6 characters)"
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-border">
              <button
                type="button"
                className="px-6 py-3 border border-border text-foreground bg-background hover:bg-muted rounded-xl font-medium transition-colors"
                onClick={() => {
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    category: "",
                    password: "",
                  })
                  setErrors({})
                }}
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Adding Company...
                  </>
                ) : (
                  "Add Company"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const ModernTemplateForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    color: "#8b5cf6",
    logo: null,
    theme: "modern",
    layout: "standard",
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [logoPreview, setLogoPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const colorPresets = [
    { name: "Purple", value: "#8b5cf6" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Pink", value: "#ec4899" },
    { name: "Orange", value: "#f59e0b" },
    { name: "Red", value: "#ef4444" },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, logo: file })

      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Template submitted:", formData)
    setSuccessMessage("Template saved successfully!")
    setFormData({
      companyName: "",
      description: "",
      color: "#8b5cf6",
      logo: null,
      theme: "modern",
      layout: "standard",
    })
    setLogoPreview(null)
    setIsSubmitting(false)

    setTimeout(() => {
      setSuccessMessage("")
    }, 5000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border p-8 hover-lift">
            {successMessage && (
              <div className="bg-chart-1/10 border-l-4 border-chart-1 p-4 mb-6 rounded-lg animate-slide-in-up">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-chart-1 mr-3" />
                  <p className="text-chart-1 font-medium">{successMessage}</p>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Template Designer</h3>
              <p className="text-muted-foreground">
                Create and customize company templates with advanced styling options.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Settings */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-foreground border-b border-border pb-2">Basic Settings</h4>

                <div className="space-y-2">
                  <label htmlFor="companyName" className="block text-sm font-medium text-foreground">
                    Company Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="Enter company name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-foreground">
                    Description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                    placeholder="Brief description of the company"
                  />
                </div>
              </div>

              {/* Design Customization */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Design Customization
                </h4>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-foreground">Brand Color</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="w-12 h-12 rounded-xl border-2 border-border cursor-pointer"
                    />
                    <div className="flex flex-wrap gap-2">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setFormData({ ...formData, color: preset.value })}
                          className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                            formData.color === preset.value ? "border-foreground" : "border-border"
                          }`}
                          style={{ backgroundColor: preset.value }}
                          title={preset.name}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground font-mono">{formData.color}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="theme" className="block text-sm font-medium text-foreground">
                      Theme Style
                    </label>
                    <select
                      name="theme"
                      id="theme"
                      value={formData.theme}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    >
                      <option value="modern">Modern</option>
                      <option value="classic">Classic</option>
                      <option value="minimal">Minimal</option>
                      <option value="bold">Bold</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="layout" className="block text-sm font-medium text-foreground">
                      Layout Type
                    </label>
                    <select
                      name="layout"
                      id="layout"
                      value={formData.layout}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    >
                      <option value="standard">Standard</option>
                      <option value="compact">Compact</option>
                      <option value="expanded">Expanded</option>
                      <option value="sidebar">Sidebar</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-foreground border-b border-border pb-2">Company Logo</h4>

                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-primary font-medium hover:text-primary/80">Upload a file</span>
                    <span className="text-muted-foreground"> or drag and drop</span>
                    <input type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF up to 10MB</p>
                </div>

                {logoPreview && (
                  <div className="flex justify-center">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground text-center">Logo Preview</p>
                      <div className="w-24 h-24 rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center">
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-border">
                <button
                  type="button"
                  className="px-6 py-3 border border-border text-foreground bg-background hover:bg-muted rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Saving Template...
                    </>
                  ) : (
                    "Save Template"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6 hover-lift sticky top-8">
            <h4 className="text-lg font-semibold text-foreground mb-4">Live Preview</h4>
            <div className="space-y-4">
              <div
                className="p-4 rounded-xl border-2 transition-all"
                style={{
                  borderColor: formData.color,
                  backgroundColor: `${formData.color}10`,
                }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  {logoPreview ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: formData.color }}
                    >
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div>
                    <h5 className="font-semibold text-foreground">{formData.companyName || "Company Name"}</h5>
                    <p className="text-xs text-muted-foreground">
                      {formData.theme} • {formData.layout}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formData.description || "Company description will appear here..."}
                </p>
                <div className="mt-3 flex space-x-2">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: formData.color }}
                  >
                    Primary
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    Secondary
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  <strong>Theme:</strong> {formData.theme}
                </p>
                <p>
                  <strong>Layout:</strong> {formData.layout}
                </p>
                <p>
                  <strong>Color:</strong> {formData.color}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ModernViewCompaniesList = ({
  companies = [],
  isLoading = false,
  error = null,
  getCompanyAppointmentCount = () => 0,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [companyAppointmentCounts, setCompanyAppointmentCounts] = useState({})

  useEffect(() => {
    const fetchAppointmentCounts = async () => {
      const counts = {}
      for (const company of companies) {
        try {
          const response = await fetch(`/api/appointments/countByCompany/${company.id}`)
          const data = await response.json()
          counts[company.id] = data.success ? data.data.total_appointees : 0
        } catch (error) {
          console.error(`Error fetching count for company ${company.id}:`, error)
          counts[company.id] = 0
        }
      }
      setCompanyAppointmentCounts(counts)
    }

    if (companies.length > 0) {
      fetchAppointmentCounts()
    }
  }, [companies])

  const filteredCompanies = companies
    .filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.email && company.email.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = statusFilter === "all" || company.status === statusFilter
      const matchesCategory = categoryFilter === "all" || company.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      const modifier = sortOrder === "asc" ? 1 : -1

      if (aValue < bValue) return -1 * modifier
      if (aValue > bValue) return 1 * modifier
      return 0
    })

  const categories = [...new Set(companies.map((c) => c.category).filter(Boolean))]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-3" />
            <p className="text-muted-foreground">Loading companies...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Companies</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-card rounded-2xl border border-border p-6 hover-lift">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Awaiting Setup">Awaiting Setup</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-")
                setSortBy(field)
                setSortOrder(order)
              }}
              className="px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="category-asc">Category A-Z</option>
              <option value="status-asc">Status A-Z</option>
            </select>

            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
              <Download className="w-4 h-4 mr-2 inline" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company, index) => (
          <div
            key={company.id}
            className="bg-card rounded-2xl border border-border p-6 hover-lift cursor-pointer group animate-slide-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {company.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{company.category || "Uncategorized"}</p>
                </div>
              </div>

              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  company.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {company.status || "Unknown"}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-muted-foreground">
                <strong>Email:</strong> {company.email || "Not provided"}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Phone:</strong> {company.phone || "Not provided"}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center space-x-2">
                <Activity className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-600">
                  {companyAppointmentCounts[company.id] || 0} appointments
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                  <Eye className="w-3 h-3 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                  <Edit className="w-3 h-3 text-muted-foreground" />
                </button>
                <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                  <Trash2 className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No companies found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}

const recentActivities = [
  {
    title: "New company registered",
    description: "Innovate Solutions joined the platform",
    time: "2 minutes ago",
    icon: Building2,
    color: "bg-chart-1",
  },
  {
    title: "Appointment scheduled",
    description: "Urban Fitness Co. has a new booking",
    time: "15 minutes ago",
    icon: Calendar,
    color: "bg-chart-2",
  },
  {
    title: "Payment received",
    description: "$299.99 from Apex Logistics",
    time: "1 hour ago",
    icon: DollarSign,
    color: "bg-chart-3",
  },
  {
    title: "System update",
    description: "Database backup completed successfully",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "bg-chart-4",
  },
]

export default EnhancedAdmin
