"use client"

import { useState } from "react"
import {
  BarChart3,
  Users,
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
} from "lucide-react"

const EnhancedAdmin = () => {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [notificationCount, setNotificationCount] = useState(3)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleNavigation = (page) => {
    setCurrentPage(page)
    setSidebarOpen(false)
  }

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <ModernDashboardView />
      case "addCompany":
        return <ModernAddCompanyForm />
      case "viewCompanies":
        return <ModernViewCompaniesList companies={mockCompanies} />
      case "template":
        return <ModernTemplateForm />
      default:
        return <ModernDashboardView />
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

const ModernDashboardView = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")
  const [isLoading, setIsLoading] = useState(false)

  const stats = [
    {
      title: "Total Companies",
      value: "124",
      change: "+12%",
      trend: "up",
      icon: Building2,
      color: "from-chart-1 to-chart-1/80",
    },
    {
      title: "Active Users",
      value: "2,415",
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "from-chart-2 to-chart-2/80",
    },
    {
      title: "Revenue",
      value: "$48,392",
      change: "+23%",
      trend: "up",
      icon: DollarSign,
      color: "from-chart-3 to-chart-3/80",
    },
    {
      title: "Appointments",
      value: "1,847",
      change: "-3%",
      trend: "down",
      icon: Calendar,
      color: "from-chart-4 to-chart-4/80",
    },
  ]

  const appointmentData = [
    { company: "Innovate Solutions", count: 142, status: "High", growth: "+15%", avatar: "IS" },
    { company: "Green Harvest Farm", count: 98, status: "Medium", growth: "+8%", avatar: "GH" },
    { company: "Urban Fitness Co.", count: 203, status: "High", growth: "+22%", avatar: "UF" },
    { company: "Apex Logistics", count: 76, status: "Medium", growth: "+5%", avatar: "AL" },
    { company: "Petal & Stem Florist", count: 45, status: "Low", growth: "-2%", avatar: "PS" },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 border border-border hover-lift cursor-pointer group animate-slide-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm font-medium ${
                    stat.trend === "up" ? "text-chart-1" : "text-destructive"
                  }`}
                >
                  <TrendingUp className={`w-4 h-4 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Chart Card */}
        <div className="bg-card rounded-2xl p-6 border border-border hover-lift">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Revenue Analytics</h3>
              <p className="text-sm text-muted-foreground">Monthly performance overview</p>
            </div>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center">
            <EnhancedLineChart />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-card rounded-2xl p-6 border border-border hover-lift">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">Latest system updates</p>
            </div>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Filter className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Appointment Analytics */}
      <div className="bg-card rounded-2xl p-6 border border-border hover-lift">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Top Performing Companies</h3>
            <p className="text-sm text-muted-foreground">Appointment booking analytics</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
              <Download className="w-4 h-4 mr-2 inline" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Company</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Appointments</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Growth</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Status</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointmentData.map((item, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{item.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.company}</p>
                        <p className="text-xs text-muted-foreground">Active since 2023</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-foreground">{item.count}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`text-sm font-medium ${
                        item.growth.startsWith("+") ? "text-chart-1" : "text-destructive"
                      }`}
                    >
                      {item.growth}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "High"
                          ? "bg-chart-1/20 text-chart-1"
                          : item.status === "Medium"
                            ? "bg-chart-4/20 text-chart-4"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}














const ModernAddCompanyForm = () => {
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
    // Log the data being sent for debugging
    console.log("Submitting company data:", formData);
    
    const response = await fetch("http://localhost:5000/api/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    
    // Check if this is a CORS preflight issue
    if (response.status === 0) {
      // This typically indicates a CORS error
      throw new Error("CORS error: Request was blocked. Check server CORS configuration.");
    }
    
    // Get the response text first to see what's actually coming back
    const responseText = await response.text();
    console.log("Raw response text:", responseText);
    
    // Try to parse as JSON if it's not empty
    let result = null;
    if (responseText && responseText.trim() !== '') {
      try {
        result = JSON.parse(responseText);
        console.log("Parsed JSON response:", result);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error(`Server returned non-JSON response: ${responseText}`);
      }
    } else {
      console.log("Empty response received");
      // Handle empty response - check if it's a success
      if (response.ok) {
        setSuccessMessage("Company added successfully!")
        setFormData({
          name: "",
          email: "",
          phone: "",
          category: "",
          password: "",
        })
        return;
      } else {
        throw new Error(`Server returned empty response with status: ${response.status}`);
      }
    }
    
    if (!response.ok) {
      // Try to get error message from server response or use default
      const errorMsg = result?.message || `Server error: ${response.status} ${response.statusText}`;
      throw new Error(errorMsg)
    }

    // If we get here, the request was successful with JSON response
    setSuccessMessage(result.message || "Company added successfully!")
    setFormData({
      name: "",
      email: "",
      phone: "",
      category: "",
      password: "",
    })
    
  } catch (error) {
    console.error("Error adding company:", error)
    
    // More specific error messages
    let errorMessage = error.message;
    if (error.message.includes("Failed to fetch")) {
      errorMessage = "Cannot connect to server. Please make sure the backend is running on port 5000.";
    } else if (error.message.includes("CORS")) {
      errorMessage = "CORS error: The request was blocked. Please check your browser console for CORS errors and ensure your backend has proper CORS configuration.";
    } else if (error.message.includes("Network error")) {
      errorMessage = "Network error. Please check your connection.";
    }
    
    setErrors({ submit: errorMessage })
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
    });
    console.log("OPTIONS test response status:", response.status);
    
    if (response.status === 204 || response.status === 200) {
      console.log("CORS preflight is working!");
      setErrors({ submit: "CORS preflight is working! You can now submit the form." });
    } else {
      setErrors({ submit: `CORS preflight test failed with status: ${response.status}` });
    }
  } catch (error) {
    console.error("CORS test failed:", error);
    setErrors({ submit: "CORS preflight failed. Please check your backend CORS configuration." });
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
                "name": "Company Name", 
                "email": "email@example.com",
                "phone": "123-456-7890", 
                "category": "Category",
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
            <p className="text-sm text-muted-foreground mt-2">
              API Endpoint: /api/companies
            </p>
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

const ModernViewCompaniesList = ({ companies }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  const filteredCompanies = companies
    .filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
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

  const categories = [...new Set(companies.map((c) => c.category))]

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
                  <p className="text-sm text-muted-foreground">{company.category}</p>
                </div>
              </div>

              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  company.status === "Active" ? "bg-chart-1/20 text-chart-1" : "bg-chart-4/20 text-chart-4"
                }`}
              >
                {company.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-muted-foreground">
                <strong>Contact:</strong> {company.contactPerson}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Since:</strong> 2023
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-chart-1" />
                <span className="text-sm font-medium text-chart-1">142 appointments</span>
              </div>

              <div className="flex items-center space-x-1">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No companies found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}

const EnhancedLineChart = () => {
  const data = [
    { month: "Jan", value: 4000 },
    { month: "Feb", value: 3000 },
    { month: "Mar", value: 5000 },
    { month: "Apr", value: 4500 },
    { month: "May", value: 6000 },
    { month: "Jun", value: 5500 },
  ]

  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const range = maxValue - minValue

  return (
    <div className="w-full h-full relative">
      <svg viewBox="0 0 400 200" className="w-full h-full">
        {/* Grid lines */}
        {[0, 50, 100, 150, 200].map((y) => (
          <line key={y} x1="40" y1={y} x2="400" y2={y} stroke="hsl(var(--border))" strokeWidth="1" opacity="0.3" />
        ))}

        {/* Data line */}
        <polyline
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={data
            .map((item, i) => `${40 + (i / (data.length - 1)) * 360},${200 - ((item.value - minValue) / range) * 160}`)
            .join(" ")}
        />

        {/* Data points */}
        {data.map((item, i) => (
          <circle
            key={i}
            cx={40 + (i / (data.length - 1)) * 360}
            cy={200 - ((item.value - minValue) / range) * 160}
            r="4"
            fill="hsl(var(--primary))"
            className="hover:r-6 transition-all cursor-pointer"
          />
        ))}

        {/* Fill under line */}
        <polygon
          fill="url(#gradient)"
          fillOpacity="0.2"
          points={`${data
            .map((item, i) => `${40 + (i / (data.length - 1)) * 360},${200 - ((item.value - minValue) / range) * 160}`)
            .join(" ")}, 400,200, 40,200`}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Labels */}
        {data.map((item, i) => (
          <text
            key={i}
            x={40 + (i / (data.length - 1)) * 360}
            y="220"
            textAnchor="middle"
            fontSize="12"
            fill="hsl(var(--muted-foreground))"
          >
            {item.month}
          </text>
        ))}
      </svg>
    </div>
  )
}

// Mock data
const mockCompanies = [
  { id: 1, name: "Innovate Solutions", category: "Tech Consulting", contactPerson: "Jane Doe", status: "Active" },
  { id: 2, name: "Green Harvest Farm", category: "Agriculture", contactPerson: "John Smith", status: "Awaiting Setup" },
  { id: 3, name: "Urban Fitness Co.", category: "Health & Wellness", contactPerson: "Emily White", status: "Active" },
  { id: 4, name: "Apex Logistics", category: "Transportation", contactPerson: "Michael Brown", status: "Active" },
  { id: 5, name: "Petal & Stem Florist", category: "Retail", contactPerson: "Sarah Chen", status: "Awaiting Setup" },
  { id: 6, name: "Digital Marketing Pro", category: "Marketing", contactPerson: "Alex Johnson", status: "Active" },
  { id: 7, name: "Coastal Real Estate", category: "Real Estate", contactPerson: "Maria Garcia", status: "Active" },
  {
    id: 8,
    name: "TechStart Incubator",
    category: "Technology",
    contactPerson: "David Wilson",
    status: "Awaiting Setup",
  },
]

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
