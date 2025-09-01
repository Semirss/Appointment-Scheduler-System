"use client"
import { useState, useEffect } from "react"
import { Calendar, User, Stethoscope, CheckCircle } from "lucide-react"

export default function AppointmentBooking() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company_id: "",
    service_id: "",
    date: "",
    time: "",
  })

  const [companies, setCompanies] = useState([])
  const [services, setServices] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // API base URL - make sure this matches your backend
  const API_BASE_URL = "http://localhost:5000"

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/companies`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.success) {
          setCompanies(data.data)
        } else {
          throw new Error(data.message || "Failed to fetch companies")
        }
      } catch (error) {
        console.error("Failed to fetch companies:", error)
        setError("Failed to load companies. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  // Fetch services when a company is selected
  useEffect(() => {
    const fetchServices = async () => {
      if (!formData.company_id) return
      
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/services/${formData.company_id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.success) {
          setServices(data.data)
          // Reset service selection when company changes
          setFormData(prev => ({ ...prev, service_id: "" }))
        } else {
          throw new Error(data.message || "Failed to fetch services")
        }
      } catch (error) {
        console.error("Failed to fetch services:", error)
        setError("Failed to load services. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [formData.company_id])

  // Generate time slots based on selected service duration
  useEffect(() => {
    if (!formData.service_id || !formData.date) return
    
    const generateTimeSlots = () => {
      const selectedService = services.find(s => s.service_id == formData.service_id)
      if (!selectedService) return
      
      const duration = parseInt(selectedService.duration_time) || 30 // Default to 30 minutes
      const slots = []
      const startHour = 9 // 9 AM
      const endHour = 17 // 5 PM
      const lunchStart = 12 // 12 PM
      const lunchEnd = 13 // 1 PM
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += duration) {
          // Skip lunch time
          if (hour === lunchStart && minute >= 0) continue
          if (hour === lunchEnd - 1 && minute + duration > 60) continue
          
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })
          
          slots.push({
            value: timeString,
            display: displayTime
          })
        }
      }
      
      setTimeSlots(slots)
    }
    
    generateTimeSlots()
  }, [formData.service_id, formData.date, services])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const selectedService = services.find(s => s.service_id == formData.service_id)
  const selectedCompany = companies.find(c => c.company_id == formData.company_id)

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.date || !formData.time || 
        !formData.company_id || !formData.service_id) {
      setError("Please fill in all required fields, including selecting a company and service.");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      let clientId;
      
      // Create or get user
      const userResponse = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          telegram_id: null
        }),
      });
      
      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create/get user");
      }
      
      const userData = await userResponse.json();
      clientId = userData.data.user_id;
      
      // Format date and time for backend
      const startTime = new Date(`${formData.date}T${formData.time}`);
      const serviceDuration = selectedService ? parseInt(selectedService.duration_time) || 30 : 30;
      const endTime = new Date(startTime.getTime() + serviceDuration * 60000);
      
      // Format dates for MySQL (YYYY-MM-DD HH:MM:SS)
      const formatDateTimeForMySQL = (date) => {
        return date.toISOString().slice(0, 19).replace('T', ' ');
      };
      
      const appointmentData = {
        company_id: formData.company_id,
        client_id: clientId,
        service_id: formData.service_id,
        start_time: formatDateTimeForMySQL(startTime),
        end_time: formatDateTimeForMySQL(endTime),
        status: "scheduled",
      };
      
      console.log("Sending appointment data:", appointmentData);
      
      const appointmentResponse = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });
      
      if (!appointmentResponse.ok) {
        const errorData = await appointmentResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create appointment");
      }
      
      const appointmentResult = await appointmentResponse.json();
      console.log("Appointment created:", appointmentResult);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message || "Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const bookAnother = () => {
    setIsSubmitted(false)
    setCurrentStep(1)
    setFormData({
      name: "",
      email: "",
      phone: "",
      company_id: "",
      service_id: "",
      date: "",
      time: "",
    })
    setError("")
  }

  const nextStep = () => {
    if (currentStep === 1 && (!formData.name || !formData.email || !formData.company_id)) {
      setError("Please fill in your name, email, and select a company to continue.")
      return
    }
    if (currentStep === 2 && (!formData.service_id || !formData.date || !formData.time)) {
      setError("Please select a service, date, and time to continue.")
      return
    }
    setError("")
    setCurrentStep((prev) => Math.min(prev + 1, 2))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setError("")
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card  rounded-2xl shadow-2xl p-8 text-center animate-slide-in-up border border-border/50">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-300 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-card-foreground mb-2">Appointment Confirmed!</h2>
          <p className="text-muted-foreground mb-6 text-balance">
            Thank you, <span className="font-semibold text-card-foreground">{formData.name}</span>. We've sent a
            confirmation to <span className="font-semibold text-card-foreground">{formData.email}</span>.
          </p>

          <div className="bg-muted rounded-xl p-4 mb-6 space-y-3 text-left">
            <div className="flex items-center gap-3">
              <Stethoscope className="w-4 h-4 text-primary" />
              <span className="text-sm">
                <strong>Company:</strong> {selectedCompany?.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="w-4 h-4 text-primary" />
              <span className="text-sm">
                <strong>Service:</strong> {selectedService?.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm">
                <strong>Date & Time:</strong> {formData.date} at {formData.time}
              </span>
            </div>
            {selectedService?.price && (
              <div className="flex items-center gap-3">
                <span className="text-sm">
                  <strong>Price:</strong> ${selectedService.price}
                  {selectedService.discount > 0 && ` (${selectedService.discount}% off)`}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={bookAnother}
            className="w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 transform hover:scale-[1.02]"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-card-foreground text-balance">Book Your Appointment</h1>
            <p className="text-muted-foreground mt-2 text-pretty">
              Schedule your visit with our healthcare professionals
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                    currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                {step < 2 && (
                  <div
                    className={`w-12 h-0.5 mx-2 transition-all duration-200 ${
                      currentStep > step ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4 space-x-8 text-sm text-muted-foreground">
            <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>Personal Info</span>
            <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>Appointment Details</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 py-8">
        {error && (
          <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl animate-fade-in">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="p-8 animate-slide-in-up">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-card-foreground">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-card-foreground">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-card-foreground">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-card-foreground">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    placeholder="Enter your phone number (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="company_id" className="text-sm font-medium text-card-foreground">
                    Select Company *
                  </label>
                  <select
                    id="company_id"
                    name="company_id"
                    value={formData.company_id}
                    onChange={handleChange}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    required
                  >
                    <option value="">Select a company</option>
                    {companies.map((company) => (
                      <option key={company.company_id} value={company.company_id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Appointment Details */}
          {currentStep === 2 && (
            <div className="p-8 animate-slide-in-up">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-card-foreground">Appointment Details</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="service_id" className="text-sm font-medium text-card-foreground">
                    Service Type *
                  </label>
                  <select
                    id="service_id"
                    name="service_id"
                    value={formData.service_id}
                    onChange={handleChange}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    required
                    disabled={!formData.company_id || services.length === 0}
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service.service_id} value={service.service_id}>
                        {service.name} ({service.duration_time} min)
                        {service.price && ` - $${service.price}`}
                        {service.discount > 0 && ` (${service.discount}% off)`}
                      </option>
                    ))}
                  </select>
                  {!formData.company_id && (
                    <p className="text-sm text-muted-foreground mt-1">Please select a company first</p>
                  )}
                  {formData.company_id && services.length === 0 && !loading && (
                    <p className="text-sm text-muted-foreground mt-1">No services available for this company</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="date" className="text-sm font-medium text-card-foreground">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full bg-input border border-border rounded-xl px-4 py-3 text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">Preferred Time *</label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {timeSlots.map((slot) => (
                        <button
                          type="button"
                          key={slot.value}
                          onClick={() => handleChange({ target: { name: "time", value: slot.value } })}
                          className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                            formData.time === slot.value
                              ? "bg-primary text-primary-foreground border-primary shadow-md"
                              : "bg-input text-card-foreground border-border hover:bg-muted"
                          }`}
                          disabled={!formData.service_id || !formData.date}
                        >
                          {slot.display}
                        </button>
                      ))}
                      {(!formData.service_id || !formData.date) && (
                        <p className="text-sm text-muted-foreground col-span-2 mt-2">
                          Please select a service and date first
                        </p>
                      )}
                      {formData.service_id && formData.date && timeSlots.length === 0 && (
                        <p className="text-sm text-muted-foreground col-span-2 mt-2">
                          No available time slots for this service on the selected date
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="px-8 py-6 bg-muted/50 border-t border-border flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 text-muted-foreground hover:text-card-foreground transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < 2 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={loading}
                className="px-8 py-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Next Step"}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Booking..." : "Confirm Appointment"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}