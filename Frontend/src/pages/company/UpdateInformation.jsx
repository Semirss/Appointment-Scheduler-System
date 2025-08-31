import React, { useState, useEffect } from 'react';
import { FaLock, FaUnlock, FaPalette, FaImage, FaSave, FaPaperPlane, FaInfoCircle, FaCheck, FaTimes } from 'react-icons/fa';

const UpdateInformation = () => {
  const [customization, setCustomization] = useState({
    theme_color: '#3B82F6',
    logo_url: '',
    banner_image: '',
    description: ''
  });
  
  const [isLocked, setIsLocked] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [requestSent, setRequestSent] = useState(false);
  const [previewLogo, setPreviewLogo] = useState('');
  const [previewBanner, setPreviewBanner] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Predefined color options
  const colorOptions = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#84CC16', // Lime
    '#64748B'  // Gray
  ];

  // Simulate fetching data from API
  useEffect(() => {
    const fetchCustomization = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setCustomization({
          theme_color: '#3B82F6',
          logo_url: 'https://example.com/logo.png',
          banner_image: 'https://example.com/banner.jpg',
          description: 'Your current company description goes here. This can be updated by administrators.'
        });
        setPreviewLogo('https://example.com/logo.png');
        setPreviewBanner('https://example.com/banner.jpg');
        setIsLoading(false);
      }, 1000);
    };

    fetchCustomization();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomization(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorSelect = (color) => {
    setCustomization(prev => ({
      ...prev,
      theme_color: color
    }));
    setShowColorPicker(false);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'logo') {
          setPreviewLogo(e.target.result);
        } else {
          setPreviewBanner(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRequestAccess = () => {
    // Simulate sending request to admin
    setTimeout(() => {
      setRequestSent(true);
      // Simulate admin granting access after 3 seconds
      setTimeout(() => {
        setIsLocked(false);
        setRequestSent(false);
      }, 3000);
    }, 1000);
  };

  const handleSaveChanges = () => {
    if (isLocked) return;
    
    // Simulate saving changes
    console.log('Saving changes:', customization);
    alert('Changes saved successfully!');
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customization settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Company Customization</h1>
          <p className="text-gray-600">Manage your company's appearance and branding</p>
        </div>

        {/* Lock Banner - Only show when locked */}
        {isLocked && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <FaLock className="text-yellow-600 text-2xl mt-1" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Customization Locked
                </h3>
                <p className="text-yellow-700 mb-4">
                  Customization features are currently locked. Please contact your administrator 
                  to request access to modify these settings.
                </p>
                <button
                  onClick={handleRequestAccess}
                  disabled={requestSent}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <FaPaperPlane />
                  {requestSent ? 'Request Sent!' : 'Request Access from Admin'}
                </button>
                {requestSent && (
                  <p className="text-green-600 mt-2 text-sm">
                    Request sent to administrator. Waiting for approval...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Unlocked Status - Show when admin grants access */}
        {!isLocked && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <FaUnlock className="text-green-600 text-2xl mt-1" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Customization Unlocked
                </h3>
                <p className="text-green-700">
                  You now have permission to customize your company's appearance. 
                  Changes will be saved immediately.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Current Customization Display */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaInfoCircle className="text-blue-600" />
            Current Customization
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme Color
              </label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
                  style={{ backgroundColor: customization.theme_color }}
                  onClick={() => !isLocked && setShowColorPicker(!showColorPicker)}
                ></div>
                <span className="text-sm text-gray-600">{customization.theme_color}</span>
              </div>
            </div>

            {/* Logo Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo
              </label>
              {previewLogo ? (
                <img 
                  src={previewLogo} 
                  alt="Company Logo" 
                  className="w-16 h-16 object-contain border border-gray-200 rounded"
                />
              ) : (
                <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
                  No Logo
                </div>
              )}
            </div>

            {/* Banner Preview */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image
              </label>
              {previewBanner ? (
                <img 
                  src={previewBanner} 
                  alt="Banner" 
                  className="w-full h-32 object-cover border border-gray-200 rounded"
                />
              ) : (
                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
                  No Banner
                </div>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded border border-gray-200">
                {customization.description}
              </p>
            </div>
          </div>
        </div>

        {/* Customization Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 relative">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaPalette className="text-blue-600" />
            Customization Settings
          </h2>

          <div className={`space-y-6 ${isLocked ? 'opacity-75 pointer-events-none' : ''}`}>
            {/* Theme Color with Picker */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme Color
              </label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  style={{ backgroundColor: customization.theme_color }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  {showColorPicker && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-3 w-64">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">Choose a color</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowColorPicker(false);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {colorOptions.map((color) => (
                          <div
                            key={color}
                            className="w-8 h-8 rounded border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColorSelect(color);
                            }}
                          >
                            {customization.theme_color === color && (
                              <div className="w-full h-full flex items-center justify-center text-white">
                                <FaCheck className="text-xs" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3">
                        <label className="block text-xs text-gray-500 mb-1">Custom Color</label>
                        <input
                          type="color"
                          value={customization.theme_color}
                          onChange={(e) => handleColorSelect(e.target.value)}
                          className="w-full h-8 border border-gray-200 rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-sm text-gray-600 block">{customization.theme_color}</span>
                  <span className="text-xs text-gray-400">Click to change color</span>
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Logo
              </label>
              <div className="flex items-center gap-4">
                {previewLogo && (
                  <img 
                    src={previewLogo} 
                    alt="Logo preview" 
                    className="w-16 h-16 object-contain border border-gray-200 rounded"
                  />
                )}
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                  <FaImage />
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="hidden"
                    disabled={isLocked}
                  />
                </label>
              </div>
            </div>

            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Banner
              </label>
              <div className="flex items-center gap-4">
                {previewBanner && (
                  <img 
                    src={previewBanner} 
                    alt="Banner preview" 
                    className="w-32 h-16 object-cover border border-gray-200 rounded"
                  />
                )}
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                  <FaImage />
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'banner')}
                    className="hidden"
                    disabled={isLocked}
                  />
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description
              </label>
              <textarea
                name="description"
                value={customization.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter company description..."
                disabled={isLocked}
              />
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleSaveChanges}
                disabled={isLocked}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <FaSave />
                Save Changes
              </button>
            </div>
          </div>

          {/* Overlay when locked */}
          {isLocked && (
            <div className="absolute inset-0 bg-white bg-opacity-80 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FaLock className="text-gray-400 text-4xl mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Customization features are locked</p>
                <p className="text-gray-500 text-sm mt-1">Request access from administrator</p>
              </div>
            </div>
          )}
        </div>

        {/* Admin Contact Info */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
          <p className="text-sm text-blue-700">
            Contact your system administrator at <span className="font-medium">admin@company.com</span> 
            or call <span className="font-medium">+1 (555) 123-ADMIN</span> for customization access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateInformation;