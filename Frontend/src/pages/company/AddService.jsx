import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDollarSign, FaClock, FaPlus, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { useCustomization } from '../../context/CustomizationContext';

const AddService = () => {
  const { customization } = useCustomization();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceError, setServiceError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Set a constant company ID
  const companyId = 2;

  // State for the service form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_time: '',
    discount: '',
    is_active: true
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
    if (!hexColor) return '#000000';
    
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white depending on luminance
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServiceError('');
    setSuccessMessage('');

    // Prepare payload
    const payload = {
      company_id: companyId,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) || 0,
      duration_time: parseInt(formData.duration_time) || 0,
      discount: parseFloat(formData.discount) || 0,
      is_active: formData.is_active
    };

    try {
      const response = await axios.post(`https://gravity.et/appointment_Backend/api/services`, payload);
      
      if (response.data.success) {
        setSuccessMessage('Service created successfully!');
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          duration_time: '',
          discount: '',
          is_active: true
        });
      } else {
        setServiceError(response.data.message || 'Failed to create service');
      }
    } catch (error) {
      console.error('Error creating new service:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setServiceError(error.response.data.message);
      } else {
        setServiceError('Failed to create new service. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.price && formData.duration_time;

  return (
    <div className="p-6 min-h-screen" style={containerStyle}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Add New Service</h1>
          <p>Create a new service offering for your business</p>
        </div>

        {/* Form */}
        <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: customization.theme_background }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaInfoCircle style={{ color: customization.theme_button }} />
                Service Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Haircut, Massage, Consultation"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the service in detail..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaDollarSign style={{ color: customization.theme_button }} />
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaClock style={{ color: customization.theme_button }} />
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    name="duration_time"
                    value={formData.duration_time}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 30, 60"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="flex items-center">
                  <div className="flex items-center h-5">
                    <input
                      id="is_active"
                      name="is_active"
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="is_active" className="font-medium text-gray-700">
                      Active Service
                    </label>
                    <p className="text-gray-500">Uncheck to disable this service</p>
                  </div>
                </div>
              </div>
            </div>

            {serviceError && (
              <div className="mt-4 text-red-600 text-sm p-3 bg-red-50 rounded-lg">
                {serviceError}
              </div>
            )}
            
            {successMessage && (
              <div className="mt-4 text-green-600 text-sm p-3 bg-green-50 rounded-lg">
                {successMessage}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: '',
                    description: '',
                    price: '',
                    duration_time: '',
                    discount: '',
                    is_active: true
                  });
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
                {isSubmitting ? 'Creating...' : 'Create Service'}
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
            <li>• Duration should be in minutes (e.g., 30 for a half-hour service)</li>
            <li>• Discount is optional and should be a percentage value (0-100)</li>
            <li>• You can disable a service later by unchecking "Active Service"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddService;