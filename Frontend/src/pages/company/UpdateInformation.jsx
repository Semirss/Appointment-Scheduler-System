import React, { useState, useEffect, useRef } from 'react';
import { FaLock, FaUnlock, FaPalette, FaImage, FaSave, FaPaperPlane, FaInfoCircle, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { useCustomization } from '../../context/CustomizationContext';
import axios from 'axios';
import { useCompany } from '../../context/CompanyContext';

const UpdateInformation = () => {
  const { customization, updateCustomization, updateStatus, refreshCustomization, isLoading: contextLoading } = useCustomization();
  const { company } = useCompany();
  
  // Derive states directly from customization.status
  const isLocked = customization.status === 'locked';
  const requestSent = customization.status === 'unlock_requested';
  const isUnlocked = customization.status === 'unlocked';
  
  const [previewLogo, setPreviewLogo] = useState('');
  const [activeColorPicker, setActiveColorPicker] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const pollingIntervalRef = useRef(null);

  // Load initial data
  useEffect(() => {
    setPreviewLogo(customization.logo_url);
    setPreviewBanner(customization.banner_image);
  }, [customization.logo_url, customization.banner_image]);

    // Polling effect to check for status changes
  useEffect(() => {
    // Only start polling if request is sent and waiting for approval
    if (requestSent) {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const response = await axios.get(`https://test.dynamicrealestatemarketing.com/backend/api/customizations/${company.company_id}`);
          
          if (response.data.success && response.data.data) {
            const currentStatus = response.data.data.status;
            
            // If status has changed from unlock_requested to unlocked
            if (currentStatus === 'unlocked' && customization.status === 'unlock_requested') {
              // Refresh the customization data
              await refreshCustomization();
              // Clear the interval since we got the status change
              clearInterval(pollingIntervalRef.current);
            }
            
            // If status has changed from unlocked to locked (admin manually locked it)
            if (currentStatus === 'locked' && customization.status === 'unlocked') {
              await refreshCustomization();
              clearInterval(pollingIntervalRef.current);
            }
          }
        } catch (error) {
          console.error('Error polling for status update:', error);
        }
      }, 5000); // Check every 5 seconds
    }

    // Cleanup function to clear interval when component unmounts or status changes
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [requestSent, customization.status, company.company_id, refreshCustomization]);

  // Predefined color options
  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899',
    '#06B6D4', '#F97316', '#6366F1', '#14B8A6', '#84CC16', '#64748B',
    '#FFFFFF', '#000000', '#1F2937', '#F3F4F6', '#E5E7EB', '#9CA3AF',
    '#F8FAFC', '#F1F5F9', '#E2E8F0'
  ];

  const fontOptions = [
    { name: 'Inter', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Poppins', value: 'Poppins' },
    { name: 'Lato', value: 'Lato' },
    { name: 'Nunito', value: 'Nunito' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro' },
  ];

  const fontSizeOptions = [
    { name: 'Small', value: '14px' },
    { name: 'Medium', value: '16px' },
    { name: 'Large', value: '18px' },
    { name: 'X-Large', value: '20px' },
  ];

  // Load initial data
  // useEffect(() => {
  //   setPreviewLogo(customization.logo_url);
  //   setPreviewBanner(customization.banner_image);
  //   setIsLocked(customization.status === 'locked');
  //   setRequestSent(customization.status === 'unlock_requested');
  // }, [customization]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateCustomization({
      ...customization,
      [name]: value
    });
  };

  const handleColorSelect = async (color, type) => {
    const newCustomization = {
      ...customization,
      [type]: color
    };
    
    try {
      await updateCustomization(newCustomization);
      setActiveColorPicker(null);
    } catch (error) {
      setSaveError('Failed to save color change');
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 2MB)
    const fileLimit = 2 * 1024 * 1024;
    if (file.size > fileLimit) {
        setSaveError('Image size too large. Please use images under 2MB.');
        return;
    }

    // Show immediate preview
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageUrl = e.target.result;
        if (type === 'logo') {
            setPreviewLogo(imageUrl);
        }
    };
    reader.readAsDataURL(file);

    try {
        // NEW: Call the dedicated upload function from the context
        const response = await handleLogoUpload(file);
        if (response.success) {
            console.log("Logo upload successful:", response.url);
            setSaveError(null); // Clear any previous errors
        } else {
            setSaveError('Failed to upload logo: ' + response.message);
            // Revert preview if upload fails
            if (type === 'logo') {
                setPreviewLogo(customization.logo_url);
            }
        }
    } catch (error) {
        console.error('Error during logo upload:', error);
        setSaveError('Failed to upload image. Please try again.');
        if (type === 'logo') {
            setPreviewLogo(customization.logo_url);
        }
    }
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleRequestAccess = async () => {
    try {
      const response = await axios.post('https://test.dynamicrealestatemarketing.com/backend/api/customizations/request-unlock', {
        company_id: company.company_id
      });

      console.log(response.data);
      
      // Only update if the API call was successful
      if (response.data.success) {
        // Update the context to reflect the new status
        updateCustomization({
          ...customization,
          status: 'unlock_requested'
        });
      } else {
        throw new Error(response.data.message || 'Failed to request unlock');
      }
    } catch (error) {
      setSaveError(error.response?.data?.message || 'Failed to send unlock request');
    }
  };

  // const handleLockCustomization = async () => {
  //   try {
  //     setLockLoading(true);
  //     const response = await axios.post('https://test.dynamicrealestatemarketing.com/backend/api/customizations/lock', {
  //       company_id: company.company_id
  //     });
      
  //     // Only update if the API call was successful
  //     if (response.data.success) {
  //       // Update the context to reflect the new status
  //       updateCustomization({
  //         ...customization,
  //         status: 'locked'
  //       });
  //       setIsLocked(true);
  //     } else {
  //       throw new Error(response.data.message || 'Failed to lock customization');
  //     }
  //   } catch (error) {
  //     setSaveError(error.response?.data?.message || 'Failed to lock customization');
  //   } finally {
  //     setLockLoading(false);
  //   }
  // };

  const handleSaveChanges = async () => {
    if (customization.status === 'locked') return;

    setSaveLoading(true);
    setSaveError('');
    setSaveSuccess('');

    try {
        await updateCustomization(customization);
        await updateStatus('locked'); 
        
        setSaveSuccess('Changes saved successfully and customization locked!');

    } catch (error) {
        // This catch block handles errors from both updateCustomization and updateStatus.
        setSaveError('Failed to save changes to database');
    } finally {
        setSaveLoading(false);
    }
  };

  if (contextLoading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center" style={{ backgroundColor: customization.theme_background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: customization.theme_button }}>
            <FaSpinner className="text-2xl" />
          </div>
          <p className="mt-4" style={{ color: customization.theme_text }}>Loading customization settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: customization.theme_background, color: customization.theme_text }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Company Customization</h1>
          <p>Manage your company's appearance and branding</p>
        </div>

        {/* Save Error */}
        {saveError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{saveError}</p>
          </div>
        )}

        {/* Success Msg */}
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-700">{saveSuccess}</p>
          </div>
        )}

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
                  disabled={requestSent || isUnlocked} // Disable if request is already sent or already unlocked
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <FaPaperPlane />
                  {requestSent ? 'Request Sent!' : 'Request Access'}
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

        {/* Unlocked Status - Show when admin grants access (only when status is 'unlocked') */}
        {isUnlocked && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <FaUnlock className="text-green-600 text-2xl mt-1" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Customization Unlocked
                </h3>
                <p className="text-green-700 mb-4">
                  You now have permission to customize your company's appearance. 
                  Changes will be saved to the database.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Request Pending Status - Show when status is 'unlock_requested' */}
        {requestSent && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <FaInfoCircle className="text-blue-600 text-2xl mt-1" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Request Pending
                </h3>
                <p className="text-blue-700">
                  Your request to unlock customization has been sent to the administrator. 
                  Please wait for approval.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Current Customization Display */}
        <div className="rounded-lg shadow-sm p-6 mb-6" style={{ backgroundColor: customization.theme_card }}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaInfoCircle style={{ color: customization.theme_button }} />
            Current Customization (From Database)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Colors */}
            <div className="md:col-span-2">
              <h3 className="text-md font-medium mb-3">Theme Colors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 rounded border" style={{ borderColor: `${customization.theme_button}20` }}>
                  <div 
                    className="w-8 h-8 rounded border" 
                    style={{ 
                      backgroundColor: customization.theme_background,
                      borderColor: `${customization.theme_button}20`
                    }}
                  ></div>
                  <div>
                    <p className="text-sm font-medium">Background</p>
                    <p className="text-xs opacity-70">{customization.theme_background}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded border" style={{ borderColor: `${customization.theme_button}20` }}>
                  <div 
                    className="w-8 h-8 rounded border" 
                    style={{ 
                      backgroundColor: customization.theme_text,
                      borderColor: `${customization.theme_button}20`
                    }}
                  ></div>
                  <div>
                    <p className="text-sm font-medium">Text</p>
                    <p className="text-xs opacity-70">{customization.theme_text}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded border" style={{ borderColor: `${customization.theme_button}20` }}>
                  <div 
                    className="w-8 h-8 rounded border" 
                    style={{ 
                      backgroundColor: customization.theme_button,
                      borderColor: `${customization.theme_button}20`
                    }}
                  ></div>
                  <div>
                    <p className="text-sm font-medium">Button</p>
                    <p className="text-xs opacity-70">{customization.theme_button}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded border" style={{ borderColor: `${customization.theme_button}20` }}>
                  <div 
                    className="w-8 h-8 rounded border" 
                    style={{ 
                      backgroundColor: customization.theme_card,
                      borderColor: `${customization.theme_button}20`
                    }}
                  ></div>
                  <div>
                    <p className="text-sm font-medium">Card</p>
                    <p className="text-xs opacity-70">{customization.theme_card}</p>
                  </div>
                </div>
                {/* Sidebar Background */}
                <div className="flex items-center gap-3 p-3 rounded border" style={{ borderColor: `${customization.theme_button}20` }}>
                    <div 
                    className="w-8 h-8 rounded border" 
                    style={{ 
                        backgroundColor: customization.sidebar_bg,
                        borderColor: `${customization.theme_button}20`
                    }}
                    ></div>
                    <div>
                    <p className="text-sm font-medium">Sidebar BG</p>
                    <p className="text-xs opacity-70">{customization.sidebar_bg}</p>
                    </div>
                </div>
                
                {/* Sidebar Text */}
                <div className="flex items-center gap-3 p-3 rounded border" style={{ borderColor: `${customization.theme_button}20` }}>
                    <div 
                    className="w-8 h-8 rounded border" 
                    style={{ 
                        backgroundColor: customization.sidebar_text,
                        borderColor: `${customization.theme_button}20`
                    }}
                    ></div>
                    <div>
                    <p className="text-sm font-medium">Sidebar Text</p>
                    <p className="text-xs opacity-70">{customization.sidebar_text}</p>
                    </div>
                </div>
                
                {/* Header Background */}
                <div className="flex items-center gap-3 p-3 rounded border" style={{ borderColor: `${customization.theme_button}20` }}>
                    <div 
                    className="w-8 h-8 rounded border" 
                    style={{ 
                        backgroundColor: customization.header_bg,
                        borderColor: `${customization.theme_button}20`
                    }}
                    ></div>
                    <div>
                    <p className="text-sm font-medium">Header BG</p>
                    <p className="text-xs opacity-70">{customization.header_bg}</p>
                    </div>
                </div>
                
                {/* Header Text */}
                <div className="flex items-center gap-3 p-3 rounded border" style={{ borderColor: `${customization.theme_button}20` }}>
                    <div 
                    className="w-8 h-8 rounded border" 
                    style={{ 
                        backgroundColor: customization.header_text,
                        borderColor: `${customization.theme_button}20`
                    }}
                    ></div>
                    <div>
                    <p className="text-sm font-medium">Header Text</p>
                    <p className="text-xs opacity-70">{customization.header_text}</p>
                    </div>
                </div>
              </div>
            </div>

            {/* Logo Preview */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Logo
              </label>
              {previewLogo ? (
                <img 
                  src={previewLogo} 
                  alt="Company Logo" 
                  className="w-16 h-16 object-contain border rounded"
                  style={{ borderColor: `${customization.theme_button}20` }}
                />
              ) : (
                <div className="w-16 h-16 border-2 border-dashed rounded flex items-center justify-center opacity-50" style={{ borderColor: customization.theme_button }}>
                  No Logo
                </div>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <p className="text-sm p-3 rounded border" style={{ 
                backgroundColor: `${customization.theme_button}05`,
                borderColor: `${customization.theme_button}20`
              }}>
                {customization.description || 'No description set'}
              </p>
            </div>
          </div>
            <div className="md:col-span-2">
                <h3 className="text-md font-medium mb-3">Font Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded border" style={{ borderColor: `${customization.theme_button}20` }}>
                    <div className="w-8 h-8 rounded border flex items-center justify-center" style={{ 
                        borderColor: `${customization.theme_button}20`,
                        fontFamily: customization.font_family
                    }}>
                        Aa
                    </div>
                    <div>
                        <p className="text-sm font-medium">Body Font</p>
                        <p className="text-xs opacity-70" style={{ fontFamily: customization.font_family }}>
                        {customization.font_family}
                        </p>
                    </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded border" style={{ borderColor: `${customization.theme_button}20` }}>
                    <div className="w-8 h-8 rounded border flex items-center justify-center" style={{ 
                        borderColor: `${customization.theme_button}20`,
                        fontFamily: customization.font_heading
                    }}>
                        Aa
                    </div>
                    <div>
                        <p className="text-sm font-medium">Heading Font</p>
                        <p className="text-xs opacity-70" style={{ fontFamily: customization.font_heading }}>
                        {customization.font_heading}
                        </p>
                    </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded border" style={{ borderColor: `${customization.theme_button}20` }}>
                    <div className="w-8 h-8 rounded border flex items-center justify-center text-xs" style={{ 
                        borderColor: `${customization.theme_button}20`,
                        fontSize: customization.font_size_base
                    }}>
                        A
                    </div>
                    <div>
                        <p className="text-sm font-medium">Base Size</p>
                        <p className="text-xs opacity-70">{customization.font_size_base}</p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        

        {/* Customization Form */}
        <div className="rounded-lg shadow-sm p-6 relative" style={{ backgroundColor: customization.theme_card }}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaPalette style={{ color: customization.theme_button }} />
            Customization Settings
          </h2>

          <div className={`space-y-6 ${isLocked || requestSent ? 'opacity-75 pointer-events-none' : ''}`}>
            {/* Theme Colors with Pickers */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Theme Colors
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Background Color */}
                <div className="relative">
                  <label className="block text-xs opacity-70 mb-2">Background Color</label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-10 h-10 rounded border cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      style={{ 
                        backgroundColor: customization.theme_background,
                        borderColor: `${customization.theme_button}20`
                      }}
                      onClick={() => setActiveColorPicker(activeColorPicker === 'background' ? null : 'background')}
                    ></div>
                    <div>
                      <span className="text-sm block">{customization.theme_background}</span>
                    </div>
                  </div>
                  
                  {activeColorPicker === 'background' && (
                    <ColorPicker 
                      currentColor={customization.theme_background}
                      onSelect={(color) => handleColorSelect(color, 'theme_background')}
                      onClose={() => setActiveColorPicker(null)}
                    />
                  )}
                </div>
                
                {/* Text Color */}
                <div className="relative">
                  <label className="block text-xs opacity-70 mb-2">Text Color</label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-10 h-10 rounded border cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      style={{ 
                        backgroundColor: customization.theme_text,
                        borderColor: `${customization.theme_button}20`
                      }}
                      onClick={() => setActiveColorPicker(activeColorPicker === 'text' ? null : 'text')}
                    ></div>
                    <div>
                      <span className="text-sm block">{customization.theme_text}</span>
                    </div>
                  </div>
                  
                  {activeColorPicker === 'text' && (
                    <ColorPicker 
                      currentColor={customization.theme_text}
                      onSelect={(color) => handleColorSelect(color, 'theme_text')}
                      onClose={() => setActiveColorPicker(null)}
                    />
                  )}
                </div>
                
                {/* Button Color */}
                <div className="relative">
                  <label className="block text-xs opacity-70 mb-2">Button Color</label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-10 h-10 rounded border cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      style={{ 
                        backgroundColor: customization.theme_button,
                        borderColor: `${customization.theme_button}20`
                      }}
                      onClick={() => setActiveColorPicker(activeColorPicker === 'button' ? null : 'button')}
                    ></div>
                    <div>
                      <span className="text-sm block">{customization.theme_button}</span>
                    </div>
                  </div>
                  
                  {activeColorPicker === 'button' && (
                    <ColorPicker 
                      currentColor={customization.theme_button}
                      onSelect={(color) => handleColorSelect(color, 'theme_button')}
                      onClose={() => setActiveColorPicker(null)}
                    />
                  )}
                </div>
                
                {/* Card Color */}
                <div className="relative">
                  <label className="block text-xs opacity-70 mb-2">Card Color</label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-10 h-10 rounded border cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      style={{ 
                        backgroundColor: customization.theme_card,
                        borderColor: `${customization.theme_button}20`
                      }}
                      onClick={() => setActiveColorPicker(activeColorPicker === 'card' ? null : 'card')}
                    ></div>
                    <div>
                      <span className="text-sm block">{customization.theme_card}</span>
                    </div>
                  </div>
                  
                  {activeColorPicker === 'card' && (
                    <ColorPicker 
                      currentColor={customization.theme_card}
                      onSelect={(color) => handleColorSelect(color, 'theme_card')}
                      onClose={() => setActiveColorPicker(null)}
                    />
                  )}
                </div>
                {/* Sidebar bg Color */}
                <div className="relative">
                    <label className="block text-xs opacity-70 mb-2">Sidebar Background Color</label>
                    <div className="flex items-center gap-2">
                    <div 
                        className="w-10 h-10 rounded border cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                        style={{ 
                        backgroundColor: customization.sidebar_bg,
                        borderColor: `${customization.theme_button}20`
                        }}
                        onClick={() => setActiveColorPicker(activeColorPicker === 'sidebar_bg' ? null : 'sidebar_bg')}
                    ></div>
                    <div>
                        <span className="text-sm block">{customization.sidebar_bg}</span>
                    </div>
                    </div>
                    
                    {activeColorPicker === 'sidebar_bg' && (
                    <ColorPicker 
                        currentColor={customization.sidebar_bg}
                        onSelect={(color) => handleColorSelect(color, 'sidebar_bg')}
                        onClose={() => setActiveColorPicker(null)}
                    />
                    )}
                </div>
                
                {/* Sidebar Text Color */}
                <div className="relative">
                    <label className="block text-xs opacity-70 mb-2">Sidebar Text Color</label>
                    <div className="flex items-center gap-2">
                    <div 
                        className="w-10 h-10 rounded border cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                        style={{ 
                        backgroundColor: customization.sidebar_text,
                        borderColor: `${customization.theme_button}20`
                        }}
                        onClick={() => setActiveColorPicker(activeColorPicker === 'sidebar_text' ? null : 'sidebar_text')}
                    ></div>
                    <div>
                        <span className="text-sm block">{customization.sidebar_text}</span>
                    </div>
                    </div>
                    
                    {activeColorPicker === 'sidebar_text' && (
                    <ColorPicker 
                        currentColor={customization.sidebar_text}
                        onSelect={(color) => handleColorSelect(color, 'sidebar_text')}
                        onClose={() => setActiveColorPicker(null)}
                    />
                    )}
                </div>
                
                {/* Header Background Color */}
                <div className="relative">
                    <label className="block text-xs opacity-70 mb-2">Header Background Color</label>
                    <div className="flex items-center gap-2">
                    <div 
                        className="w-10 h-10 rounded border cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                        style={{ 
                        backgroundColor: customization.header_bg,
                        borderColor: `${customization.theme_button}20`
                        }}
                        onClick={() => setActiveColorPicker(activeColorPicker === 'header_bg' ? null : 'header_bg')}
                    ></div>
                    <div>
                        <span className="text-sm block">{customization.header_bg}</span>
                    </div>
                    </div>
                    
                    {activeColorPicker === 'header_bg' && (
                    <ColorPicker 
                        currentColor={customization.header_bg}
                        onSelect={(color) => handleColorSelect(color, 'header_bg')}
                        onClose={() => setActiveColorPicker(null)}
                    />
                    )}
                </div>
                
                {/* Header Text Color */}
                <div className="relative">
                    <label className="block text-xs opacity-70 mb-2">Header Text Color</label>
                    <div className="flex items-center gap-2">
                    <div 
                        className="w-10 h-10 rounded border cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                        style={{ 
                        backgroundColor: customization.header_text,
                        borderColor: `${customization.theme_button}20`
                        }}
                        onClick={() => setActiveColorPicker(activeColorPicker === 'header_text' ? null : 'header_text')}
                    ></div>
                    <div>
                        <span className="text-sm block">{customization.header_text}</span>
                    </div>
                    </div>
                    
                    {activeColorPicker === 'header_text' && (
                    <ColorPicker 
                        currentColor={customization.header_text}
                        onSelect={(color) => handleColorSelect(color, 'header_text')}
                        onClose={() => setActiveColorPicker(null)}
                    />
                    )}
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                  Upload Logo
              </label>
              <div className="flex items-center gap-4">
                {previewLogo && (
                  <img 
                    src={previewLogo} 
                    alt="Logo preview" 
                    className="w-16 h-16 object-contain border rounded"
                    style={{ borderColor: `${customization.theme_button}20` }}
                  />
                )}
                <label 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                  style={{ 
                    backgroundColor: `${customization.theme_button}10`,
                    color: customization.theme_text
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = `${customization.theme_button}20`}
                  onMouseOut={(e) => e.target.style.backgroundColor = `${customization.theme_button}10`}
                >
                  <FaImage />
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="hidden"
                    disabled={isLocked || requestSent}
                  />
                </label>
              </div>
            </div>

            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Banner
              </label>
              <div className="flex items-center gap-4">
                {previewBanner && (
                  <img 
                    src={previewBanner} 
                    alt="Banner preview" 
                    className="w-32 h-16 object-cover border rounded"
                    style={{ borderColor: `${customization.theme_button}20` }}
                  />
                )}
                <label 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                  style={{ 
                    backgroundColor: `${customization.theme_button}10`,
                    color: customization.theme_text
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = `${customization.theme_button}20`}
                  onMouseOut={(e) => e.target.style.backgroundColor = `${customization.theme_button}10`}
                >
                  <FaImage />
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'banner')}
                    className="hidden"
                    disabled={isLocked || requestSent}
                  />
                </label>
              </div>
          </div>

            <div>
                <label className="block text-sm font-medium mb-3">
                    Font Settings
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Body Font Selector */}
                    <div>
                    <label className="block text-xs opacity-70 mb-2">Body Font</label>
                    <select
                        value={customization.font_family}
                        onChange={(e) => handleInputChange({
                        target: {
                            name: 'font_family',
                            value: e.target.value
                        }
                        })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:border-transparent"
                        style={{ 
                        borderColor: `${customization.theme_button}20`,
                        fontFamily: customization.font_family
                        }}
                        disabled={isLocked || requestSent}
                    >
                        {fontOptions.map(font => (
                        <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                            {font.name}
                        </option>
                        ))}
                    </select>
                    </div>
                    
                    {/* Heading Font Selector */}
                    <div>
                    <label className="block text-xs opacity-70 mb-2">Heading Font</label>
                    <select
                        value={customization.font_heading}
                        onChange={(e) => handleInputChange({
                        target: {
                            name: 'font_heading',
                            value: e.target.value
                        }
                        })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:border-transparent"
                        style={{ 
                        borderColor: `${customization.theme_button}20`,
                        fontFamily: customization.font_heading
                        }}
                        disabled={isLocked || requestSent}
                    >
                        {fontOptions.map(font => (
                        <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                            {font.name}
                        </option>
                        ))}
                    </select>
                    </div>
                    
                    {/* Font Size Selector */}
                    <div>
                    <label className="block text-xs opacity-70 mb-2">Base Font Size</label>
                    <select
                        value={customization.font_size_base}
                        onChange={(e) => handleInputChange({
                        target: {
                            name: 'font_size_base',
                            value: e.target.value
                        }
                        })}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:border-transparent"
                        style={{ 
                        borderColor: `${customization.theme_button}20`,
                        fontSize: customization.font_size_base
                        }}
                        disabled={isLocked || requestSent}
                    >
                        {fontSizeOptions.map(size => (
                        <option key={size.value} value={size.value}>
                            {size.name} ({size.value})
                        </option>
                        ))}
                    </select>
                </div>
            </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Description
              </label>
              <textarea
                name="description"
                value={customization.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                style={{ 
                  borderColor: `${customization.theme_button}20`,
                  focusRingColor: customization.theme_button
                }}
                placeholder="Enter company description..."
                disabled={isLocked || requestSent}
              />
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t" style={{ borderColor: `${customization.theme_button}20` }}>
            <button
              onClick={handleSaveChanges}
              disabled={isLocked || requestSent || saveLoading} // Add requestSent to disabled condition
              className="px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              style={{ 
                backgroundColor: customization.theme_button,
                color: getContrastColor(customization.theme_button)
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.9'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              {saveLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Changes
                </>
              )}
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
        <div className="mt-6 rounded-lg p-4" style={{ 
          backgroundColor: `${customization.theme_button}10`,
          color: customization.theme_text
        }}>
          <h4 className="font-semibold mb-2">Need Help?</h4>
          <p className="text-sm">
            Contact us <span className="font-medium">  info@gravityet.com </span> 
            or call <span className="font-medium">+251 910 446 666</span> for customization access.
          </p>
        </div>
      </div>
    </div>
  );
};

// Color Picker Component (remains the same)
const ColorPicker = ({ currentColor, onSelect, onClose }) => {
  const { customization } = useCustomization();
  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899',
    '#06B6D4', '#F97316', '#6366F1', '#14B8A6', '#84CC16', '#64748B',
    '#FFFFFF', '#000000', '#1F2937', '#F3F4F6', '#E5E7EB', '#9CA3AF',
    '#F8FAFC', '#F1F5F9', '#E2E8F0'
  ];

  return (
    <div className="absolute top-full left-0 mt-2 border rounded-lg shadow-xl z-10 p-3 w-64" style={{ 
      backgroundColor: customization.theme_card,
      borderColor: `${customization.theme_button}20`,
      color: customization.theme_text
    }}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium">Choose a color</span>
        <button 
          onClick={onClose}
          className="opacity-70 hover:opacity-100"
        >
          <FaTimes />
        </button>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {colorOptions.map((color) => (
          <div
            key={color}
            className="w-8 h-8 rounded border cursor-pointer hover:scale-110 transition-transform"
            style={{ 
              backgroundColor: color,
              borderColor: `${customization.theme_button}20`
            }}
            onClick={() => onSelect(color)}
          >
            {currentColor === color && (
              <div className="w-full h-full flex items-center justify-center text-white">
                <FaCheck className="text-xs" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3">
        <label className="block text-xs opacity-70 mb-1">Custom Color</label>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full h-8 border rounded"
          style={{ 
            borderColor: `${customization.theme_button}20`
          }}
        />
      </div>
    </div>
  );
};

// Helper function to determine text color based on background
const getContrastColor = (hexColor) => {
  if (!hexColor) return '#000000';
  
  // Convert hex to RGB
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white depending on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

export default UpdateInformation;