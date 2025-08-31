import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCustomization } from '../../context/CustomizationContext';


const ViewAppointment = () => {
  const { customization } = useCustomization(); // Get customization data
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [availableBranches, setAvailableBranches] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableClients, setAvailableClients] = useState([]);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [newAppointmentLoading, setNewAppointmentLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState('');
  const [newAppointmentError, setNewAppointmentError] = useState('');
  const [showDropdown, setShowDropdown] = useState({});
  const [showNewClientForm, setShowNewClientForm] = useState(false);

  // Apply the customized colors
  const containerStyle = {
    backgroundColor: customization.theme_background,
    color: customization.theme_text,
  };

//   const cardStyle = {
//     backgroundColor: customization.theme_background,
//     color: customization.theme_text,
//     border: `1px solid ${customization.theme_button}20`
//   };

  const buttonStyle = {
    backgroundColor: customization.theme_button,
    color: getContrastColor(customization.theme_button),
  };

  const cardStyle = {
    backgroundColor: customization.theme_card,
    color: customization.theme_text,
    border: `1px solid ${customization.theme_button}20`
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

  // State for the new appointment form data
  const [newAppointmentFormData, setNewAppointmentFormData] = useState({
    client_id: '',
    name: '',
    email: '',
    phone: '',
    telegram_id: '',
    address: '',
    service_id: '',
    service_name: '',
    date: '',
    start_time: '',
    end_time: '',
    branch_name: '',
    location: '',
  });

  // State for new client form data
  const [newClientFormData, setNewClientFormData] = useState({
    name: '',
    email: '',
    phone: '',
    telegram_id: '',
    address: ''
    });

  // Create a ref for the dropdown container to detect clicks outside of it
  const dropdownRef = useRef(null);

  // Set a constant appointee ID for this component
  const appointeeId = 2;
  // Set a constant company ID to fetch addresses for
  const companyId = 2;

  const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000) + 1;
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        // Fetch appointments for the specified appointee ID
        const response = await axios.get(`http://localhost:5000/api/appointments/appointees/${companyId}`);
        setAppointments(response.data.data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

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

    fetchAppointments();
    fetchBranches();
    fetchServices();
    fetchClients();
  }, [appointeeId, companyId]);
  
  // Effect to handle clicks outside of the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the dropdown menu
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown({}); // Close all dropdowns
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const statusColors = {
    scheduled: 'bg-green-100 text-green-800',
    rescheduled: 'bg-indigo-100 text-indigo-800',
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    'in progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const getStatusColor = (status) => {
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesStatus = selectedStatus === 'all' || app.status.toLowerCase() === selectedStatus;
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.service_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleRequestRating = (appointment) => {
    console.log(`Requesting a satisfaction rating for appointment ID: ${appointment.appointment_id}`);
    // Here you would add the logic to send the satisfaction rating,
    // for example, making an API call to your backend.
  };

  const handleRescheduleClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
    setRescheduleError('');
  };

  const handleNewAppointmentClick = () => {
    setShowNewAppointmentModal(true);
    setNewAppointmentError('');
    setShowNewClientForm(false);
    // Reset form data for a new entry
    setNewAppointmentFormData({
        client_id: '',
        name: '',
        email: '',
        phone: '',
        telegram_id: '',
        address: '',
        service_id: '',
        service_name: '',
        date: '',
        start_time: '',
        end_time: '',
        branch_name: '',
        location: '',
    });
    };

  const handleClientSelection = (clientId) => {
    if (clientId === 'new') {
        setShowNewClientForm(true);
        setNewAppointmentFormData(prev => ({
        ...prev,
        client_id: '',
        name: '',
        email: '',
        phone: '',
        telegram_id: '',
        address: ''
        }));
    } else {
        const selectedClient = availableClients.find(client => client.user_id.toString() === clientId);
        if (selectedClient) {
        setNewAppointmentFormData(prev => ({
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

  const handleRescheduleFormSubmit = async (e) => {
    e.preventDefault();
    setRescheduleLoading(true);
    setRescheduleError('');

    const form = e.target;
    const newDate = form.newDate.value;
    const newStartTime = form.startTime.value;
    const newEndTime = form.endTime.value;

    const updatedData = {
      start_time: new Date(`${newDate}T${newStartTime}`).toISOString(),
      end_time: new Date(`${newDate}T${newEndTime}`).toISOString(),
      // Add the required fields for your backend model
      company_id: selectedAppointment.company_id,
      client_id: selectedAppointment.client_id,
      service_id: selectedAppointment.service_id,
      status: 'rescheduled'
    };

    try {
      await axios.put(`http://localhost:5000/api/appointments/${selectedAppointment.appointment_id}`, updatedData);
      setShowRescheduleModal(false);
      // Refresh the appointments list
      const response = await axios.get(`http://localhost:5000/api/appointments/appointees/${companyId}`);
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      setRescheduleError('Failed to reschedule appointment. Please try again.');
    } finally {
      setRescheduleLoading(false);
    }
  };

//   const handleCreateNewClient = async () => {
//     try {
//       const response = await axios.post(`http://localhost:5000/api/users`, newClientFormData);
//       const newClient = response.data.data;
      
//       setAvailableClients(prev => [...prev, newClient]);
      
//       setNewAppointmentFormData(prev => ({
//         ...prev,
//         client_id: newClient.user_id,
//         name: newClient.name,
//         email: newClient.email || '',
//         phone: newClient.phone || '',
//         telegram_id: newClient.telegram_id || '',
//         address: newClient.address || ''
//       }));
      
//       setShowNewClientForm(false);
//     } catch (error) {
//       console.error('Error creating new client:', error);
//       setNewAppointmentError('Failed to create new client. Please try again.');
//     }
//   };

    const handleNewAppointmentFormSubmit = async (e) => {
    e.preventDefault();
    setNewAppointmentLoading(true);
    setNewAppointmentError('');

    // Generate a random ID for new clients
    const newClientId = showNewClientForm ? generateRandomId() : newAppointmentFormData.client_id;

    // Convert to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
    const formatForMySQL = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    const payload = {
        company_id: companyId,
        client_id: newClientId, // Use the generated ID for new clients
        service_id: parseInt(newAppointmentFormData.service_id),
        start_time: formatForMySQL(new Date(`${newAppointmentFormData.date}T${newAppointmentFormData.start_time}`)),
        end_time: formatForMySQL(new Date(`${newAppointmentFormData.date}T${newAppointmentFormData.end_time}`)),
        status: 'scheduled',
        branch_name: newAppointmentFormData.branch_name,
        location: newAppointmentFormData.location,
        // Include client data as individual fields (not nested object)
        name: showNewClientForm ? newAppointmentFormData.name : '',
        email: showNewClientForm ? newAppointmentFormData.email : '',
        phone: showNewClientForm ? newAppointmentFormData.phone : '',
        telegram_id: showNewClientForm ? newAppointmentFormData.telegram_id : '',
        address: showNewClientForm ? newAppointmentFormData.address : ''
    };

    try {
        console.log("Sending payload:", payload);
        const response = await axios.post(`http://localhost:5000/api/appointments/createAppointment`, payload);
        setShowNewAppointmentModal(false);
        // Refresh the appointments list
        const appointmentsResponse = await axios.get(`http://localhost:5000/api/appointments/appointees/${companyId}`);
        setAppointments(appointmentsResponse.data.data || []);
        // Refresh clients list if a new client was created
        if (showNewClientForm) {
        const clientsResponse = await axios.get(`http://localhost:5000/api/users`);
        setAvailableClients(clientsResponse.data.data || []);
        }
    } catch (error) {
        console.error('Error creating new appointment:', error);
        if (error.response && error.response.data && error.response.data.message) {
        setNewAppointmentError(error.response.data.message);
        } else {
        setNewAppointmentError('Failed to create new appointment. Please try again.');
        }
    } finally {
        setNewAppointmentLoading(false);
    }
    };

  const toggleDropdown = (id) => {
    setShowDropdown(prev => ({
      // Toggles the dropdown for a specific appointment while closing others
      ...Object.fromEntries(Object.keys(prev).map(key => [key, false])),
      [id]: !prev[id]
    }));
  };

  const handleDeleteAppointment = async (id) => {
    // Optimistically remove the appointment from the UI
    const originalAppointments = appointments;
    setAppointments(appointments.filter(app => app.appointment_id !== id));
    setShowDropdown({}); // Close the dropdown

    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      // Success is handled by the optimistic update
    } catch (error) {
      console.error('Error deleting appointment:', error);
      // Revert the UI if the deletion fails
      setAppointments(originalAppointments);
      // You can add a more sophisticated error message here for the user
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-700">Loading appointments...</div>
      </div>
    );
  }

  const modalStyles = `
  .scrollable-modal {
    max-height: 90vh;
    overflow-y: auto;
  }
`;

  return (
    <div className="p-6 min-h-screen" style={containerStyle}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Appointments</h1>
          <p>Manage and view all scheduled appointments</p>
        </div>

        {/* Controls */}
        <div className="rounded-lg shadow-sm p-6 mb-6" style={cardStyle}>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" fill="currentColor"/></svg>
              <input
                type="text"
                placeholder="Search clients or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <button
              style={{ 
                backgroundColor: customization.theme_background,
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="text-sm h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 416c0 17.7 14.3 32 32 32l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 384c-17.7 0-32 14.3-32 32zm32-96l448 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 256c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-160l320 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 96c-17.7 0-32 14.3-32 32s14.3 32 32 32z" fill="currentColor"/></svg>
                Filter
              </button>
              
              <button
                onClick={handleNewAppointmentClick}
                style={buttonStyle}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                New Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Appointments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <div key={appointment.appointment_id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              style={cardStyle}>
                {/* Header */}
                <div className="border-b border-gray-100 p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <svg className="text-blue-600 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M128 0c13.3 0 25.1 6.1 33 16H287c7.9-9.9 19.7-16 33-16H416c17.7 0 32 14.3 32 32V96H0V32C0 14.3 14.3 0 32 0H128zM448 128V480c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V128H448zM240 288c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32h80c17.7 0 32-14.3 32-32zm80 80c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32h160c17.7 0 32-14.3 32-32z" fill="currentColor"/></svg>
                    <span className="font-semibold text-gray-700">{formatDate(appointment.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    {/* The relative container for the button and the dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => toggleDropdown(appointment.appointment_id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <svg className="text-gray-400 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512"><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM0 64a64 64 0 1 1 128 0A64 64 0 1 1 0 64z" fill="currentColor"/></svg>
                      </button>
                      {showDropdown[appointment.appointment_id] && (
                        // Positioned below the button and aligned to the left
                        <div className="absolute left-0 top-full mt-2 z-10 w-48 bg-red-500 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <button
                            onClick={() => handleDeleteAppointment(appointment.appointment_id)}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-red-600"
                          >
                            Delete Appointment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                    
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold"
                    >
                      {appointment.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{appointment.name}</h3>
                      <p className="text-sm text-gray-600">{appointment.service_name}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="text-gray-400 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256l80 80c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" fill="currentColor"/></svg>
                      <span className="font-medium">{formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <svg className="text-gray-400 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0c17.6 0 32 14.4 32 32l0 128H416c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H288l0 128c0 17.6-14.4 32-32 32s-32-14.4-32-32L224 384H96c-17.7 0-32-14.3-32-32V192c0-17.7 14.3-32 32-32H224l0-128c0-17.6 14.4-32 32-32zM320 192V352h96V192H320zM96 192H224V352H96V192z" fill="currentColor"/></svg>
                      <span className="text-gray-600">Branch: {appointment.branch_name || 'Not Specified'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="text-gray-400 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" fill="currentColor"/></svg>
                      <span className="text-gray-600">Location: {appointment.location || 'Not Specified'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <svg className="text-gray-400 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-33.8 32.1h-78.1l93.2 93.2c17.8 17.8 17.8 46.6 0 64.4L448 512H302.2c-19.5 0-35.3-15.8-35.3-35.3V388.2H170.1V476.9c0 19.5-15.8 35.3-35.3 35.3H32.7L9.1 417.8c-17.8-17.8-17.8-46.6 0-64.4L101.9 287.6H24.2C5.4 287.6 0 273.5 0 255.5s5.4-32.1 24.2-32.1h78.1L9.1 130.2c-17.8-17.8-17.8-46.6 0-64.4L32.7 0H134.8c19.5 0 35.3 15.8 35.3 35.3v98.7H302.2V35.3c0-19.5 15.8-35.3 35.3-35.3H448L551.4 65.8c17.8 17.8 17.8 46.6 0 64.4L458.1 223.5h78.1c18.8 0 33.8 14.1 33.8 32.1zM288 304V208H160v96h128z" fill="currentColor"/></svg>
                      <span className="text-gray-600">Client Address: {appointment.address || 'Not Specified'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <svg className="text-gray-400 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368c-70.4-15.5-125.7-69.8-141.2-140.2L127.5 174.6c-13.7-11.2-18.4-30-11.6-46.3l40-96z" fill="currentColor"/></svg>
                      <span className="text-gray-600">{appointment.phone || 'Not Provided'}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-4 flex gap-2">
                  <button
                    onClick={() => handleRescheduleClick(appointment)}
                    className="flex-1 py-2 px-3 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                    style={{ 
                        backgroundColor: `${customization.theme_button}20`,
                        color: customization.theme_button
                    }}
                  >
                    Reschedule
                  </button>
                  <button 
                    onClick={() => handleRequestRating(appointment)} 
                    className="flex-1 py-2 px-3 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600 transition-colors"
                    style={buttonStyle}
                  >
                    Request Rating
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
              <svg className="mx-auto text-gray-300 h-10 w-10 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M128 0c13.3 0 25.1 6.1 33 16H287c7.9-9.9 19.7-16 33-16H416c17.7 0 32 14.3 32 32V96H0V32C0 14.3 14.3 0 32 0H128zM448 128V480c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V128H448zM240 288c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32h80c17.7 0 32-14.3 32-32zm80 80c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32h160c17.7 0 32-14.3 32-32z" fill="currentColor"/></svg>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No appointments found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Reschedule Appointment</h2>
              <button 
                onClick={() => setShowRescheduleModal(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleRescheduleFormSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="newDate" className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    id="newDate"
                    name="newDate"
                    defaultValue={new Date(selectedAppointment.start_time).toISOString().slice(0, 10)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    defaultValue={new Date(selectedAppointment.start_time).toISOString().slice(11, 16)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    defaultValue={new Date(selectedAppointment.end_time).toISOString().slice(11, 16)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {rescheduleError && (
                <div className="mt-4 text-red-600 text-sm">
                  {rescheduleError}
                </div>
              )}

              {/* Form Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rescheduleLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rescheduleLoading ? 'Rescheduling...' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      {showNewAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"> {/* Added max-h and overflow-y */}
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2 z-10"> {/* Added sticky header */}
                <h2 className="text-2xl font-semibold text-gray-800">Add New Appointment</h2>
                <button
                onClick={() => setShowNewAppointmentModal(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleNewAppointmentFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Client Selection */}
                <div className="md:col-span-2">
                  <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">Select Client</label>
                  <select
                    id="client_id"
                    name="client_id"
                    value={newAppointmentFormData.client_id}
                    onChange={(e) => handleClientSelection(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <>
                        <div>
                        <label htmlFor="new_client_name" className="block text-sm font-medium text-gray-700">Name *</label>
                        <input
                            type="text"
                            id="new_client_name"
                            value={newAppointmentFormData.name}
                            onChange={(e) => setNewAppointmentFormData({ ...newAppointmentFormData, name: e.target.value })}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        </div>
                        <div>
                        <label htmlFor="new_client_email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="new_client_email"
                            value={newAppointmentFormData.email}
                            onChange={(e) => setNewAppointmentFormData({ ...newAppointmentFormData, email: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        </div>
                        <div>
                        <label htmlFor="new_client_phone" className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="tel"
                            id="new_client_phone"
                            value={newAppointmentFormData.phone}
                            onChange={(e) => setNewAppointmentFormData({ ...newAppointmentFormData, phone: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        </div>
                        <div>
                        <label htmlFor="new_client_telegram" className="block text-sm font-medium text-gray-700">Telegram ID</label>
                        <input
                            type="text"
                            id="new_client_telegram"
                            value={newAppointmentFormData.telegram_id}
                            onChange={(e) => setNewAppointmentFormData({ ...newAppointmentFormData, telegram_id: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        </div>
                        <div className="md:col-span-2">
                        <label htmlFor="new_client_address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            id="new_client_address"
                            value={newAppointmentFormData.address}
                            onChange={(e) => setNewAppointmentFormData({ ...newAppointmentFormData, address: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        </div>
                    </>
                    )}

                {/* Client Info Display (when existing client is selected) */}
                {!showNewClientForm && newAppointmentFormData.client_id && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={newAppointmentFormData.name}
                        readOnly
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="text"
                        value={newAppointmentFormData.email}
                        readOnly
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="text"
                        value={newAppointmentFormData.phone}
                        readOnly
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Telegram ID</label>
                      <input
                        type="text"
                        value={newAppointmentFormData.telegram_id}
                        readOnly
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        value={newAppointmentFormData.address}
                        readOnly
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </>
                )}

                {/* Appointment Details */}
                <div>
                  <label htmlFor="service_id" className="block text-sm font-medium text-gray-700">Service</label>
                  <select
                    id="service_id"
                    name="service_id"
                    value={newAppointmentFormData.service_id}
                    onChange={(e) => {
                      const selectedService = availableServices.find(s => s.service_id.toString() === e.target.value);
                      setNewAppointmentFormData({ 
                        ...newAppointmentFormData, 
                        service_id: e.target.value,
                        service_name: selectedService ? selectedService.service_name : ''
                      });
                    }}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>Select a service</option>
                    {availableServices.map((service) => (
                      <option key={service.service_id} value={service.service_id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newAppointmentFormData.date}
                    onChange={(e) => setNewAppointmentFormData({ ...newAppointmentFormData, date: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="time"
                    id="start_time"
                    name="start_time"
                    value={newAppointmentFormData.start_time}
                    onChange={(e) => setNewAppointmentFormData({ ...newAppointmentFormData, start_time: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">End Time</label>
                  <input
                    type="time"
                    id="end_time"
                    name="end_time"
                    value={newAppointmentFormData.end_time}
                    onChange={(e) => setNewAppointmentFormData({ ...newAppointmentFormData, end_time: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="branch_name" className="block text-sm font-medium text-gray-700">Branch</label>
                  <select
                    id="branch_name"
                    name="branch_name"
                    value={newAppointmentFormData.branch_name}
                    onChange={(e) => {
                      const selectedBranch = availableBranches.find(branch => branch.branch_name === e.target.value);
                      setNewAppointmentFormData({ 
                        ...newAppointmentFormData, 
                        branch_name: e.target.value,
                        location: selectedBranch ? selectedBranch.location : ''
                      });
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={newAppointmentFormData.location}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              {newAppointmentError && (
                <div className="mt-4 text-red-600 text-sm">
                  {newAppointmentError}
                </div>
              )}

              {/* Form Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewAppointmentModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                    type="submit"
                    disabled={newAppointmentLoading || 
                        (showNewClientForm && !newAppointmentFormData.name) || // Require name for new clients
                        !newAppointmentFormData.service_id ||
                        !newAppointmentFormData.date ||
                        !newAppointmentFormData.start_time ||
                        !newAppointmentFormData.end_time
                    }
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {newAppointmentLoading ? 'Saving...' : 'Save Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAppointment;