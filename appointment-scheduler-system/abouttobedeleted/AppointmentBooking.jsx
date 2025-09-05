

import { useState } from "react"
import { Calendar, User, Stethoscope, CheckCircle, Star, Shield, Award } from "lucide-react"

export default function AppointmentBooking() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "General Check-up",
    date: "",
    time: "",
    pricingTier: "",
    notes: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const services = [
    { name: "General Check-up", icon: Stethoscope, duration: "30 min" },
    { name: "Dental Cleaning", icon: Stethoscope, duration: "45 min" },
    { name: "Specialist Consultation", icon: Stethoscope, duration: "60 min" },
    { name: "Vaccination", icon: Shield, duration: "15 min" },
    { name: "Follow-up Visit", icon: CheckCircle, duration: "20 min" },
  ]

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
  ]

  const pricingTiers = [
    {
      id: "standard",
      name: "Standard Plan",
      price: 100,
      discountPercent: 10,
      icon: Star,
      features: ["Basic consultation", "Standard follow-up", "Email support"],
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: 150,
      discountPercent: 15,
      icon: Award,
      features: ["Extended consultation", "Priority booking", "Phone support", "Health report"],
    },
    {
      id: "vip",
      name: "VIP Plan",
      price: 250,
      discountPercent: 20,
      icon: Shield,
      features: [
        "Comprehensive consultation",
        "Same-day booking",
        "24/7 support",
        "Detailed health report",
        "Follow-up care",
      ],
    },
  ]

  const selectedTier = pricingTiers.find((tier) => tier.id === formData.pricingTier)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.date || !formData.time || !formData.pricingTier) {
      setError("Please fill in all required fields, including selecting a pricing plan.")
      return
    }
    setError("")
    console.log("Appointment Submitted:", formData)
    setIsSubmitted(true)
  }

  const bookAnother = () => {
    setIsSubmitted(false)
    setCurrentStep(1)
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "General Check-up",
      date: "",
      time: "",
      pricingTier: "",
      notes: "",
    })
    setError("")
  }

  const nextStep = () => {
  if (currentStep === 1 && (!formData.name || !formData.phone)) {
  setError("Please fill in your name and phone number to continue.");
  return;
}
    if (currentStep === 2 && (!formData.date || !formData.time)) {
      setError("Please select a date and time to continue.")
      return
    }
    setError("")
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setError("")
  }

  if (isSubmitted) {
    const finalPrice = selectedTier ? selectedTier.price - (selectedTier.price * selectedTier.discountPercent) / 100 : 0
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl p-8 text-center animate-slide-in-up border border-border/50">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-card-foreground mb-2">Appointment Confirmed!</h2>
          <p className="text-muted-foreground mb-6 text-balance">
  Thank you, <span className="font-semibold text-card-foreground">{formData.name}</span>. We've sent a
  confirmation to <span className="font-semibold text-card-foreground">{formData.phone}</span>.
</p>
          <div className="bg-muted rounded-xl p-4 mb-6 space-y-3 text-left">
            <div className="flex items-center gap-3">
              <Stethoscope className="w-4 h-4 text-primary" />
              <span className="text-sm">
                <strong>Service:</strong> {formData.service}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm">
                <strong>Date & Time:</strong> {formData.date} at {formData.time}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm">
                <strong>Plan:</strong> {selectedTier?.name} (${finalPrice.toFixed(2)})
              </span>
            </div>
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
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                    currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
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
            <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>Appointment</span>
            <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>Plan & Confirm</span>
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
                  />
                </div>

              <div className="space-y-2">
  <label htmlFor="email" className="text-sm font-medium text-card-foreground">
    Email Address
  </label>
  <input
    type="email"
    id="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
    placeholder="Enter your email (optional)"
  />
                </div>

                <div className="space-y-2">
  <label htmlFor="phone" className="text-sm font-medium text-card-foreground">
    Phone Number *
  </label>
  <input
    type="tel"
    id="phone"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
    placeholder="Enter your phone number"
    required
  />
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
                  <label htmlFor="service" className="text-sm font-medium text-card-foreground">
                    Service Type
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-input border border-border rounded-xl px-4 py-3 text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                  >
                    {services.map((service) => (
                      <option key={service.name} value={service.name}>
                        {service.name} ({service.duration})
                      </option>
                    ))}
                  </select>
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
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-card-foreground">Preferred Time *</label>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {timeSlots.map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => handleChange({ target: { name: "time", value: slot } })}
                          className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                            formData.time === slot
                              ? "bg-primary text-primary-foreground border-primary shadow-md"
                              : "bg-input text-card-foreground border-border hover:bg-muted"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing Plan */}
          {currentStep === 3 && (
            <div className="p-8 animate-slide-in-up">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold text-card-foreground">Choose Your Plan</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {pricingTiers.map((tier) => {
                  const IconComponent = tier.icon
                  const finalPrice = tier.price - (tier.price * tier.discountPercent) / 100

                  return (
                    <div
                      key={tier.id}
                      onClick={() => handleChange({ target: { name: "pricingTier", value: tier.id } })}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        formData.pricingTier === tier.id
                          ? "border-primary bg-primary/5 shadow-lg"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <IconComponent className="w-6 h-6 text-primary" />
                        <h3 className="font-semibold text-card-foreground">{tier.name}</h3>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-card-foreground">${finalPrice.toFixed(0)}</span>
                          <span className="text-sm text-muted-foreground line-through">${tier.price}</span>
                        </div>
                        <p className="text-sm text-secondary font-medium">{tier.discountPercent}% OFF</p>
                      </div>

                      <ul className="space-y-2">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium text-card-foreground">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 resize-none"
                  placeholder="Any specific requirements or notes for your appointment..."
                />
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

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 transform hover:scale-[1.02]"
              >
                Confirm Appointment
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
