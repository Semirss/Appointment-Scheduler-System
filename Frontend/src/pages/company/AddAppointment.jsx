import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaUser, FaMapMarkerAlt, FaPhone, FaPlus, FaTimes } from 'react-icons/fa';
import { useCustomization } from '../../context/CustomizationContext';

const AddAppointment = () => {
  const { customization } = useCustomization(); // Get customization data
  const [availableBranches, setAvailableBranches] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableClients, setAvailableClients] = useState([]);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentError, setAppointmentError] = useState('');

  // Set a constant company ID to fetch addresses for
  const companyId = 2;

  // State for the appointment form data
  const [formData, setFormData] = useState({
    client_id: '',
    name: '',
    email: '',
    phone: '',
    telegram_id: '',
    address: '',
    service_id: '',
    date: '',
    start_time: '',
    end_time: '',
    branch_name: '',
    location: ''
  });

  // Apply the customized colors
  const containerStyle = {
    backgroundColor: customization.theme_background,
    color: customization.theme_text,
  };

  const buttonStyle = {
    backgroundColor: customization.theme_button,
    color: getContrastColor(customization.theme_button),
  };

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

  const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000) + 1;
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/addresses/${companyId}`);
        setAvailableBranches(response.data.data || []);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };
    
    const fetchServices = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/services`);
        setAvailableServices(response.data.data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users`);
        setAvailableClients(response.data.data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchBranches();
    fetchServices();
    fetchClients();
  }, [companyId]);

  const handleClientSelection = (clientId) => {
    if (clientId === 'new') {
      setShowNewClientForm(true);
      setFormData(prev => ({
        ...prev,
        client_id: generateRandomId(), // Generate ID immediately for new clients
        name: '',
        email: '',
        phone: '',
        telegram_id: '',
        address: ''
      }));
    } else {
      const selectedClient = availableClients.find(client => client.user_id.toString() === clientId);
      if (selectedClient) {
        setFormData(prev => ({
          ...prev,
          client_id: selectedClient.user_id,
          name: selectedClient.name,
          email: selectedClient.email || '',
          phone: selectedClient.phone || '',
          telegram_id: selectedClient.telegram_id || '',
          address: selectedClient.address || ''
        }));
        setShowNewClientForm(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAppointmentError('');

    // Convert to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
    const formatForMySQL = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    const payload = {
      company_id: companyId,
      client_id: formData.client_id,
      service_id: parseInt(formData.service_id),
      start_time: formatForMySQL(new Date(`${formData.date}T${formData.start_time}`)),
      end_time: formatForMySQL(new Date(`${formData.date}T${formData.end_time}`)),
      status: 'scheduled',
      branch_name: formData.branch_name,
      location: formData.location,
      // Include client data as individual fields (not nested object)
      name: showNewClientForm ? formData.name : '',
      email: showNewClientForm ? formData.email : '',
      phone: showNewClientForm ? formData.phone : '',
      telegram_id: showNewClientForm ? formData.telegram_id : '',
      address: showNewClientForm ? formData.address : ''
    };

    try {
      console.log("Sending payload:", payload);
      const response = await axios.post(`http://localhost:5000/api/appointments/createAppointment`, payload);
      
      // Show success message
      alert('Appointment created successfully!');
      
      // Reset form
      setFormData({
        client_id: '',
        name: '',
        email: '',
        phone: '',
        telegram_id: '',
        address: '',
        service_id: '',
        date: '',
        start_time: '',
        end_time: '',
        branch_name: '',
        location: ''
      });
      setShowNewClientForm(false);
      
      // Refresh clients list if a new client was created
      if (showNewClientForm) {
        const clientsResponse = await axios.get(`http://localhost:5000/api/users`);
        setAvailableClients(clientsResponse.data.data || []);
      }
    } catch (error) {
      console.error('Error creating new appointment:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setAppointmentError(error.response.data.message);
      } else {
        setAppointmentError('Failed to create new appointment. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.client_id && formData.service_id && formData.date && formData.start_time && formData.end_time && (!showNewClientForm || formData.name);

  return (
    <div className="p-6 min-h-screen" style={containerStyle}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Add New Appointment</h1>
          <p>Schedule a new appointment for your client</p>
        </div>

        {/* Form */}
        <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: customization.theme_background }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaUser style={{ color: customization.theme_button }} />
                Client Information
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Client *
                </label>
                <select
                  name="client_id"
                  value={showNewClientForm ? 'new' : formData.client_id}
                  onChange={(e) => handleClientSelection(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>Select a client</option>
                  {availableClients.map((client) => (
                    <option key={client.user_id} value={client.user_id}>
                      {client.name} - {client.phone || 'No phone'}
                    </option>
                  ))}
                  <option value="new">+ New Client</option>
                </select>
              </div>

              {/* New Client Form (conditionally rendered) */}
              {showNewClientForm && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter client name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="client@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telegram ID
                    </label>
                    <input
                      type="text"
                      name="telegram_id"
                      value={formData.telegram_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="@username"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter client address"
                    />
                  </div>
                </div>
              )}

              {/* Client Info Display (when existing client is selected) */}
              {!showNewClientForm && formData.client_id && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="text"
                      value={formData.email}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telegram ID</label>
                    <input
                      type="text"
                      value={formData.telegram_id}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Appointment Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" />
                Appointment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service *
                  </label>
                  <select
                    name="service_id"
                    value={formData.service_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="" disabled>Select a service</option>
                    {availableServices.map(service => (
                      <option key={service.service_id} value={service.service_id}>
                        {service.service_name || service.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch
                  </label>
                  <select
                    name="branch_name"
                    value={formData.branch_name}
                    onChange={(e) => {
                      const selectedBranch = availableBranches.find(branch => branch.branch_name === e.target.value);
                      setFormData({ 
                        ...formData, 
                        branch_name: e.target.value,
                        location: selectedBranch ? selectedBranch.location : ''
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a branch</option>
                    {availableBranches.map((branch, index) => (
                      <option key={index} value={branch.branch_name}>
                        {branch.branch_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {appointmentError && (
              <div className="mt-4 text-red-600 text-sm p-3 bg-red-50 rounded-lg">
                {appointmentError}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    client_id: '',
                    name: '',
                    email: '',
                    phone: '',
                    telegram_id: '',
                    address: '',
                    service_id: '',
                    date: '',
                    start_time: '',
                    end_time: '',
                    branch_name: '',
                    location: '',
                  });
                  setShowNewClientForm(false);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <FaTimes />
                Clear
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                style={buttonStyle}
                className="px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 ml-auto"
              >
                <FaPlus />
                {isSubmitting ? 'Creating...' : 'Create Appointment'}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 rounded-lg p-4" style={{ 
          backgroundColor: `${customization.theme_button}20`, // 20% opacity
          color: customization.theme_text 
        }}>
          <h4 className="font-semibold mb-2">Quick Tips</h4>
          <ul className="text-sm space-y-1">
            <li>• Required fields are marked with an asterisk (*)</li>
            <li>• Double-check the date and time to avoid scheduling conflicts</li>
            <li>• Select "New Client" to create a client profile while booking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddAppointment;