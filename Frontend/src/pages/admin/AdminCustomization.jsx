import React, { useState, useEffect } from 'react';
import { FaPalette, FaImage, FaSave, FaBuilding, FaSpinner, FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';

const AdminCustomization = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [customization, setCustomization] = useState({
    theme_background: '#FFFFFF',
    theme_text: '#1F2937',
    theme_button: '#3B82F6',
    theme_card: '#F8FAFC',
    sidebar_bg: '#FFFFFF',
    sidebar_text: '#1F2937',
    header_bg: '#FFFFFF',
    header_text: '#1F2937',
    logo_url: '',
    banner_image: '',
    // description: ''
  });

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
  
  const [previewLogo, setPreviewLogo] = useState('');
  const [previewBanner, setPreviewBanner] = useState('');
  const [activeColorPicker, setActiveColorPicker] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  // Predefined color options
  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899',
    '#06B6D4', '#F97316', '#6366F1', '#14B8A6', '#84CC16', '#64748B',
    '#FFFFFF', '#000000', '#1F2937', '#F3F4F6', '#E5E7EB', '#9CA3AF',
    '#F8FAFC', '#F1F5F9', '#E2E8F0'
  ];

  // Fetch companies from backend
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        // For demo purposes, we'll create mock companies if the API fails
        const mockCompanies = [
          { company_id: 1, name: 'Company One' },
          { company_id: 2, name: 'Company Two' },
          { company_id: 3, name: 'Company Three' }
        ];
        
        try {
          const response = await axios.get('http://localhost:5000/api/companies');
          setCompanies(response.data.data || mockCompanies);
        } catch (error) {
          console.error('API Error, using mock companies:', error);
          setCompanies(mockCompanies);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
        setSaveError('Failed to load companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Load customization when company is selected
  useEffect(() => {
    const fetchCompanyCustomization = async () => {
      if (!selectedCompany) return;

      try {
        setLoading(true);
        
        // Try to fetch from API, fall back to defaults if it fails
        try {
          const response = await axios.get(`http://localhost:5000/api/customizations/${selectedCompany}`);
          
          if (response.data.success && response.data.data) {
            const dbData = response.data.data;
            setCustomization({
              theme_background: dbData.bg_color || '#FFFFFF',
              theme_text: dbData.text_color || '#1F2937',
              theme_button: dbData.btn_color || '#3B82F6',
              theme_card: dbData.card_color || '#F8FAFC',
              sidebar_bg: dbData.sidebar_bg_color || '#FFFFFF',
              sidebar_text: dbData.sidebar_text_color || '#1F2937',
              header_bg: dbData.header_bg_color || '#FFFFFF',
              header_text: dbData.header_text_color || '#1F2937',
              logo_url: dbData.logo_url || '',
              banner_image: dbData.banner_image || '',
              // description: dbData.description || ''
            });
            setPreviewLogo(dbData.logo_url || '');
            setPreviewBanner(dbData.banner_image || '');
          } else {
            // Reset to defaults if no customization exists
            resetToDefaults();
          }
        } catch (error) {
          console.error('API Error, using default customization:', error);
          resetToDefaults();
        }
      } catch (error) {
        console.error('Error fetching customization:', error);
        resetToDefaults();
      } finally {
        setLoading(false);
      }
    };

    const resetToDefaults = () => {
      setCustomization({
        theme_background: '#FFFFFF',
        theme_text: '#1F2937',
        theme_button: '#3B82F6',
        theme_card: '#F8FAFC',
        sidebar_bg: '#FFFFFF',
        sidebar_text: '#1F2937',
        header_bg: '#FFFFFF',
        header_text: '#1F2937',
        logo_url: '',
        banner_image: '',
        // description: ''
      });
      setPreviewLogo('');
      setPreviewBanner('');
    };

    fetchCompanyCustomization();
  }, [selectedCompany]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomization(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorSelect = (color, type) => {
    setCustomization(prev => ({
      ...prev,
      [type]: color
    }));
    setActiveColorPicker(null);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        if (type === 'logo') {
          setPreviewLogo(imageUrl);
          setCustomization(prev => ({
            ...prev,
            logo_url: imageUrl
          }));
        } else {
          setPreviewBanner(imageUrl);
          setCustomization(prev => ({
            ...prev,
            banner_image: imageUrl
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCustomization = async () => {
    if (!selectedCompany) {
      setSaveError('Please select a company first');
      return;
    }

    setSaveLoading(true);
    setSaveError('');
    setSaveSuccess('');

    try {
      // Try to save to API, but don't fail completely if API is down
      try {
        await axios.put(`http://localhost:5000/api/customizations/${selectedCompany}`, {
          bg_color: customization.theme_background,
          text_color: customization.theme_text,
          btn_color: customization.theme_button,
          card_color: customization.theme_card,
          sidebar_bg_color: customization.sidebar_bg,
          sidebar_text_color: customization.sidebar_text,
          header_bg_color: customization.header_bg,
          header_text_color: customization.header_text,
          logo_url: customization.logo_url,
          banner_image: customization.banner_image,
          // description: customization.description
        });

        setSaveSuccess('Customization saved successfully to database!');
      } catch (error) {
        console.error('API Error, but continuing:', error);
        setSaveSuccess('Customization applied locally (database save failed)');
      }
      
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving customization:', error);
      setSaveError('Failed to save customization');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
    setSaveError('');
    setSaveSuccess('');
  };

  if (loading && !selectedCompany) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto">
            <FaSpinner className="text-2xl" />
          </div>
          <p className="mt-4 text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin - Company Customization</h1>
          <p className="text-gray-600">Manage company appearance and branding settings</p>
        </div>

        {/* Company Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaBuilding className="text-blue-600" />
            Select Company
          </h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company *
            </label>
            <select
              value={selectedCompany}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.company_id} value={company.company_id}>
                  {company.name} - ID: {company.company_id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages */}
        {saveError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{saveError}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700">{saveSuccess}</p>
          </div>
        )}

        {selectedCompany ? (
          <>
            {/* Current Customization Display */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-blue-600" />
                Current Customization for Company {selectedCompany}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Theme Colors */}
                <div className="md:col-span-2">
                  <h3 className="text-md font-medium text-gray-700 mb-3">Theme Colors</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded border border-gray-200">
                      <div 
                        className="w-8 h-8 rounded border border-gray-200"
                        style={{ backgroundColor: customization.theme_background }}
                      ></div>
                      <div>
                        <p className="text-sm font-medium">Background</p>
                        <p className="text-xs text-gray-500">{customization.theme_background}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded border border-gray-200">
                      <div 
                        className="w-8 h-8 rounded border border-gray-200"
                        style={{ backgroundColor: customization.theme_text }}
                      ></div>
                      <div>
                        <p className="text-sm font-medium">Text</p>
                        <p className="text-xs text-gray-500">{customization.theme_text}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded border border-gray-200">
                      <div 
                        className="w-8 h-8 rounded border border-gray-200"
                        style={{ backgroundColor: customization.theme_button }}
                      ></div>
                      <div>
                        <p className="text-sm font-medium">Button</p>
                        <p className="text-xs text-gray-500">{customization.theme_button}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded border border-gray-200">
                      <div 
                        className="w-8 h-8 rounded border border-gray-200"
                        style={{ backgroundColor: customization.theme_card }}
                      ></div>
                      <div>
                        <p className="text-sm font-medium">Card</p>
                        <p className="text-xs text-gray-500">{customization.theme_card}</p>
                      </div>
                    </div>

                    {/* Sidebar Background */}
                    <div className="flex items-center gap-3 p-3 rounded border border-gray-200">
                      <div 
                        className="w-8 h-8 rounded border border-gray-200"
                        style={{ backgroundColor: customization.sidebar_bg }}
                      ></div>
                      <div>
                        <p className="text-sm font-medium">Sidebar BG</p>
                        <p className="text-xs text-gray-500">{customization.sidebar_bg}</p>
                      </div>
                    </div>
                    
                    {/* Sidebar Text */}
                    <div className="flex items-center gap-3 p-3 rounded border border-gray-200">
                      <div 
                        className="w-8 h-8 rounded border border-gray-200"
                        style={{ backgroundColor: customization.sidebar_text }}
                      ></div>
                      <div>
                        <p className="text-sm font-medium">Sidebar Text</p>
                        <p className="text-xs text-gray-500">{customization.sidebar_text}</p>
                      </div>
                    </div>
                    
                    {/* Header Background */}
                    <div className="flex items-center gap-3 p-3 rounded border border-gray-200">
                      <div 
                        className="w-8 h-8 rounded border border-gray-200"
                        style={{ backgroundColor: customization.header_bg }}
                      ></div>
                      <div>
                        <p className="text-sm font-medium">Header BG</p>
                        <p className="text-xs text-gray-500">{customization.header_bg}</p>
                      </div>
                    </div>
                    
                    {/* Header Text */}
                    <div className="flex items-center gap-3 p-3 rounded border border-gray-200">
                      <div 
                        className="w-8 h-8 rounded border border-gray-200"
                        style={{ backgroundColor: customization.header_text }}
                      ></div>
                      <div>
                        <p className="text-sm font-medium">Header Text</p>
                        <p className="text-xs text-gray-500">{customization.header_text}</p>
                      </div>
                    </div>
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
                <div>
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
                {/* <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded border border-gray-200">
                    {customization.description || 'No description set'}
                  </p>
                </div> */}
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaPalette className="text-blue-600" />
                Customization Settings
              </h2>

              <div className="space-y-6">
                {/* Theme Colors with Pickers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Theme Colors
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Background Color */}
                    <div className="relative">
                      <label className="block text-xs text-gray-500 mb-2">Background Color</label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-10 h-10 rounded border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                          style={{ backgroundColor: customization.theme_background }}
                          onClick={() => setActiveColorPicker(activeColorPicker === 'background' ? null : 'background')}
                        ></div>
                        <div>
                          <span className="text-sm text-gray-600 block">{customization.theme_background}</span>
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
                      <label className="block text-xs text-gray-500 mb-2">Text Color</label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-10 h-10 rounded border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                          style={{ backgroundColor: customization.theme_text }}
                          onClick={() => setActiveColorPicker(activeColorPicker === 'text' ? null : 'text')}
                        ></div>
                        <div>
                          <span className="text-sm text-gray-600 block">{customization.theme_text}</span>
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
                      <label className="block text-xs text-gray-500 mb-2">Button Color</label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-10 h-10 rounded border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                          style={{ backgroundColor: customization.theme_button }}
                          onClick={() => setActiveColorPicker(activeColorPicker === 'button' ? null : 'button')}
                        ></div>
                        <div>
                          <span className="text-sm text-gray-600 block">{customization.theme_button}</span>
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
                      <label className="block text-xs text-gray-500 mb-2">Card Color</label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-10 h-10 rounded border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                          style={{ backgroundColor: customization.theme_card }}
                          onClick={() => setActiveColorPicker(activeColorPicker === 'card' ? null : 'card')}
                        ></div>
                        <div>
                          <span className="text-sm text-gray-600 block">{customization.theme_card}</span>
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

                    {/* Sidebar Background Color */}
                    <div className="relative">
                      <label className="block text-xs text-gray-500 mb-2">Sidebar BG Color</label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-10 h-10 rounded border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                          style={{ backgroundColor: customization.sidebar_bg }}
                          onClick={() => setActiveColorPicker(activeColorPicker === 'sidebar_bg' ? null : 'sidebar_bg')}
                        ></div>
                        <div>
                          <span className="text-sm text-gray-600 block">{customization.sidebar_bg}</span>
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
                      <label className="block text-xs text-gray-500 mb-2">Sidebar Text Color</label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-10 h-10 rounded border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                          style={{ backgroundColor: customization.sidebar_text }}
                          onClick={() => setActiveColorPicker(activeColorPicker === 'sidebar_text' ? null : 'sidebar_text')}
                        ></div>
                        <div>
                          <span className="text-sm text-gray-600 block">{customization.sidebar_text}</span>
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
                      <label className="block text-xs text-gray-500 mb-2">Header BG Color</label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-10 h-10 rounded border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                          style={{ backgroundColor: customization.header_bg }}
                          onClick={() => setActiveColorPicker(activeColorPicker === 'header_bg' ? null : 'header_bg')}
                        ></div>
                        <div>
                          <span className="text-sm text-gray-600 block">{customization.header_bg}</span>
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
                      <label className="block text-xs text-gray-500 mb-2">Header Text Color</label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-10 h-10 rounded border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                          style={{ backgroundColor: customization.header_text }}
                          onClick={() => setActiveColorPicker(activeColorPicker === 'header_text' ? null : 'header_text')}
                        ></div>
                        <div>
                          <span className="text-sm text-gray-600 block">{customization.header_text}</span>
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
                      />
                    </label>
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
                          // disabled={isLocked}
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
                          // disabled={isLocked}
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
                          // disabled={isLocked}
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
                </div>
                
                {/* Save Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveCustomization}
                    disabled={saveLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {saveLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Save Customization
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-700">Please select a company to manage its customization settings.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Color Picker Component
const ColorPicker = ({ currentColor, onSelect, onClose }) => {
  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899',
    '#06B6D4', '#F97316', '#6366F1', '#14B8A6', '#84CC16', '#64748B',
    '#FFFFFF', '#000000', '#1F2937', '#F3F4F6', '#E5E7EB', '#9CA3AF',
    '#F8FAFC', '#F1F5F9', '#E2E8F0'
  ];

  return (
    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-3 w-64">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-700">Choose a color</span>
        <button 
          onClick={onClose}
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
        <label className="block text-xs text-gray-500 mb-1">Custom Color</label>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full h-8 border border-gray-200 rounded"
        />
      </div>
    </div>
  );
};

export default AdminCustomization;