"use client"
import { useState, useEffect, useContext } from "react"
import { Calendar, User, Stethoscope, CheckCircle } from "lucide-react"
import { useCustomization } from "../../context/CustomizationContext";
import axios from "axios";


export default function AppointmentBooking() {
  const { customization } = useCustomization();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company_id: "",
    service_id: "",
    date: "",
    time: "",
  })

  const [company, setCompany] = useState(null);
  const [services, setServices] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // API base URL - make sure this matches your backend
  const API_BASE_URL = "https://gravity.et/appointment_Backend/api"
  const subdomain = window.location.hostname.split('.')[0];
  // console.log(subdomain)

  // Apply customization styles
  const styles = {
    background: `linear-gradient(to bottom right, ${customization.theme_background}15, ${customization.theme_card}15, ${customization.theme_button}15)`,
    card: {
      backgroundColor: customization.theme_card,
      color: customization.theme_text,
      borderColor: `${customization.theme_button}20`,
      fontFamily: customization.font_family,
    },
    button: {
      backgroundColor: customization.theme_button,
      color: getContrastColor(customization.theme_button),
      fontFamily: customization.font_heading,
    },
    input: {
      backgroundColor: `${customization.theme_background}30`,
      borderColor: `${customization.theme_button}30`,
      color: customization.theme_text,
      fontFamily: customization.font_family,
    },
    muted: {
      backgroundColor: `${customization.theme_background}15`,
      color: customization.theme_text,
      fontFamily: customization.font_family,
    },
    progress: {
      active: {
        backgroundColor: customization.theme_button,
        color: getContrastColor(customization.theme_button),
        fontFamily: customization.font_heading,
      },
      inactive: {
        backgroundColor: `${customization.theme_background}30`,
        color: `${customization.theme_text}80`,
        fontFamily: customization.font_heading,
      }
    },
    heading: {
      color: customization.theme_text,
      fontFamily: customization.font_heading,
    },
    text: {
      color: customization.theme_text,
      fontFamily: customization.font_family,
    }
  }

  // Helper function to determine text color based on background
  function getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white depending on luminance
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }

  useEffect(() => {
    const fetchCompanyAndServices = async () => {
      try {
        setLoading(true);
        
        // First, fetch company by subdomain
        const companyRes = await axios.get(`${API_BASE_URL}/companies/subdomain/${subdomain}`);
        const companyData = companyRes.data.data;
        console.log(companyRes);
        setCompany(companyData);
        
        // Set company_id in formData
        setFormData(prev => ({ ...prev, company_id: companyData.company_id }));
        
        // Now fetch services for this company
        const servicesRes = await axios.get(`${API_BASE_URL}/services/${companyData.company_id}`);
        setServices(servicesRes.data.data || []);
        
      } catch (err) {
        console.error("Failed to fetch company or services:", err);
        setError("Invalid subdomain or company not found. Please check the URL.");
      } finally {
        setLoading(false);
      }
    };

    if (subdomain) {
      fetchCompanyAndServices();
    }
  }, [subdomain]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.date || !formData.time || 
        !formData.company_id || !formData.service_id) {
      setError("Please fill in all required fields.");
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
      company_id: company ? company.company_id : "",
      service_id: "",
      date: "",
      time: "",
    })
    setError("")
  }

  const nextStep = () => {
    if (currentStep === 1 && (!formData.name || !formData.email)) {
      setError("Please fill in your name and email to continue.")
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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: styles.background, fontFamily: customization.font_family }}>
        <div className="w-full max-w-md rounded-2xl shadow-2xl p-8 text-center animate-slide-in-up border" style={styles.card}>
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={styles.muted}>
            <CheckCircle className="w-10 h-10" style={{ color: customization.theme_button }} />
          </div>

          <h2 className="text-2xl font-bold mb-2" style={styles.heading}>Appointment Confirmed!</h2>
          <p className="mb-6 text-balance" style={styles.text}>
            Thank you, <span className="font-semibold" style={styles.text}>{formData.name}</span>. We've sent a
            confirmation to <span className="font-semibold" style={styles.text}>{formData.email}</span>.
          </p>

          <div className="rounded-xl p-4 mb-6 space-y-3 text-left" style={styles.muted}>
            <div className="flex items-center gap-3">
              <Stethoscope className="w-4 h-4" style={{ color: customization.theme_button }} />
              <span className="text-sm" style={styles.text}>
                <strong>Company:</strong> {company?.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="w-4 h-4" style={{ color: customization.theme_button }} />
              <span className="text-sm" style={styles.text}>
                <strong>Service:</strong> {selectedService?.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4" style={{ color: customization.theme_button }} />
              <span className="text-sm" style={styles.text}>
                <strong>Date & Time:</strong> {formData.date} at {formData.time}
              </span>
            </div>
            {selectedService?.price && (
              <div className="flex items-center gap-3">
                <span className="text-sm" style={styles.text}>
                  <strong>Price:</strong> ${selectedService.price}
                  {selectedService.discount > 0 && ` (${selectedService.discount}% off)`}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={bookAnother}
            className="w-full font-semibold py-3 px-6 rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 transition-all duration-200 transform hover:scale-[1.02]"
            style={styles.button}
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: styles.background, fontFamily: customization.font_family }}>
      {/* Header */}
      <div className="backdrop-blur-sm border-b sticky top-0 z-10" style={{ backgroundColor: `${customization.header_bg}CC`, borderColor: `${customization.theme_button}20` }}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-balance" style={styles.heading}>Book Your Appointment</h1>
            <p className="mt-2 text-pretty" style={styles.text}>
              Schedule your visit with our healthcare professionals
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                    currentStep >= step ? "" : ""
                  }`}
                  style={currentStep >= step ? styles.progress.active : styles.progress.inactive}
                >
                  {step}
                </div>
                {step < 2 && (
                  <div
                    className={`w-12 h-0.5 mx-2 transition-all duration-200 ${
                      currentStep > step ? "" : ""
                    }`}
                    style={{ backgroundColor: currentStep > step ? customization.theme_button : `${customization.theme_button}30` }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4 space-x-8 text-sm">
            <span className={currentStep >= 1 ? "font-medium" : ""} style={{ color: currentStep >= 1 ? customization.theme_button : customization.header_text, fontFamily: customization.font_family }}>Personal Info</span>
            <span className={currentStep >= 2 ? "font-medium" : ""} style={{ color: currentStep >= 2 ? customization.theme_button : customization.header_text, fontFamily: customization.font_family }}>Appointment Details</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 py-8">
        {error && (
          <div className="mb-6 border p-4 rounded-xl animate-fade-in" style={{ backgroundColor: `${customization.theme_button}10`, borderColor: `${customization.theme_button}20`, color: customization.theme_text, fontFamily: customization.font_family }}>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {loading && !company && (
          <div className="mb-6 border p-4 rounded-xl animate-fade-in text-center" style={{ backgroundColor: `${customization.theme_button}10`, borderColor: `${customization.theme_button}20`, color: customization.theme_text, fontFamily: customization.font_family }}>
            <p className="text-sm font-medium">Loading company information...</p>
          </div>
        )}

        {company && (
          <form onSubmit={handleSubmit} className="rounded-2xl shadow-xl border overflow-hidden" style={styles.card}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="p-8 animate-slide-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6" style={{ color: customization.theme_button }} />
                  <h2 className="text-xl font-semibold" style={styles.heading}>Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium" style={styles.text}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 border-2"
                      style={{...styles.input, borderColor: customization.theme_button + '30', focusRingColor: customization.theme_button}}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium" style={styles.text}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 border-2"
                      style={{...styles.input, borderColor: customization.theme_button + '30', focusRingColor: customization.theme_button}}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium" style={styles.text}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 border-2"
                      style={{...styles.input, borderColor: customization.theme_button + '30', focusRingColor: customization.theme_button}}
                      placeholder="Enter your phone number (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={styles.text}>
                      Company
                    </label>
                    <div className="w-full rounded-xl px-4 py-3" style={styles.muted}>
                      <p className="text-sm" style={styles.text}>{company.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Appointment Details */}
            {currentStep === 2 && (
              <div className="p-8 animate-slide-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6" style={{ color: customization.theme_button }} />
                  <h2 className="text-xl font-semibold" style={styles.heading}>Appointment Details</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="service_id" className="text-sm font-medium" style={styles.text}>
                      Service Type *
                    </label>
                    <select
                      id="service_id"
                      name="service_id"
                      value={formData.service_id}
                      onChange={handleChange}
                      className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 border-2"
                      style={{...styles.input, borderColor: customization.theme_button + '30', focusRingColor: customization.theme_button}}
                      required
                      disabled={services.length === 0}
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
                    {services.length === 0 && !loading && (
                      <p className="text-sm mt-1" style={styles.text}>No services available for this company</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="date" className="text-sm font-medium" style={styles.text}>
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 border-2"
                        style={{...styles.input, borderColor: customization.theme_button + '30', focusRingColor: customization.theme_button}}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={styles.text}>Preferred Time *</label>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {timeSlots.map((slot) => (
                          <button
                            type="button"
                            key={slot.value}
                            onClick={() => handleChange({ target: { name: "time", value: slot.value } })}
                            className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                              formData.time === slot.value
                                ? "shadow-md"
                                : "hover:opacity-90"
                            }`}
                            style={formData.time === slot.value ? 
                              { backgroundColor: customization.theme_button, color: getContrastColor(customization.theme_button), borderColor: customization.theme_button, fontFamily: customization.font_family } : 
                              { backgroundColor: styles.input.backgroundColor, color: customization.theme_text, borderColor: styles.input.borderColor, fontFamily: customization.font_family }
                            }
                            disabled={!formData.service_id || !formData.date}
                          >
                            {slot.display}
                          </button>
                        ))}
                        {(!formData.service_id || !formData.date) && (
                          <p className="text-sm col-span-2 mt-2" style={styles.text}>
                            Please select a service and date first
                          </p>
                        )}
                        {formData.service_id && formData.date && timeSlots.length === 0 && (
                          <p className="text-sm col-span-2 mt-2" style={styles.text}>
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
            <div className="px-8 py-6 border-t flex justify-between" style={{ backgroundColor: `${customization.theme_background}15`, borderColor: `${customization.theme_button}20`, fontFamily: customization.font_family }}>
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: currentStep === 1 ? `${customization.theme_text}80` : customization.theme_text }}
              >
                Previous
              </button>

              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={loading}
                  className="px-8 py-2 font-semibold rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={styles.button}
                >
                  {loading ? "Loading..." : "Next Step"}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2 font-semibold rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={styles.button}
                >
                  {loading ? "Booking..." : "Confirm Appointment"}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}