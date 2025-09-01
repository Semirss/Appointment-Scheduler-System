// context/CustomizationContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CustomizationContext = createContext();

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};

export const CustomizationProvider = ({ children, companyId = 2 }) => {
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
    font_family: 'Inter',
    font_size_base: '16px',
    font_heading: 'Inter',
    // description: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch customization from database
  const fetchCustomization = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/customizations/${companyId}`);
      
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
          font_family: dbData.font_family || 'Inter',
          font_size_base: dbData.font_size_base || '16px',
          font_heading: dbData.font_heading || dbData.font_family || 'Inter',
        //   description: dbData.description || ''
        });
      }
    } catch (error) {
      console.error('Error fetching customization:', error);
      // Use default values if fetch fails
    } finally {
      setIsLoading(false);
    }
  };

  // Save customization to database
  const saveCustomizationToDB = async (newCustomization) => {
    try {
      await axios.put(`http://localhost:5000/api/customizations/${companyId}`, {
        bg_color: newCustomization.theme_background,
        text_color: newCustomization.theme_text,
        btn_color: newCustomization.theme_button,
        card_color: newCustomization.theme_card,
        sidebar_bg_color: newCustomization.sidebar_bg,
        sidebar_text_color: newCustomization.sidebar_text,
        header_bg_color: newCustomization.header_bg,
        header_text_color: newCustomization.header_text,
        logo_url: newCustomization.logo_url,
        banner_image: newCustomization.banner_image,
        font_family: newCustomization.font_family,
        font_size_base: newCustomization.font_size_base,
        font_heading: newCustomization.font_heading,
        // description: newCustomization.description
      });
    } catch (error) {
      console.error('Error saving customization:', error);
      throw new Error('Failed to save customization to database');
    }
  };

  // Load customization from database on initial load
  useEffect(() => {
    fetchCustomization();
  }, [companyId]);

  const updateCustomization = async (newCustomization) => {
    try {
      // Update local state immediately for responsive UI
      setCustomization(newCustomization);
      
      // Save to database in the background
      await saveCustomizationToDB(newCustomization);
    } catch (error) {
      console.error('Error updating customization:', error);
      // Revert local state if database save fails
      fetchCustomization(); // Reload from database
      throw error;
    }
  };

  return (
    <CustomizationContext.Provider value={{ 
      customization, 
      updateCustomization,
      isLoading,
      refreshCustomization: fetchCustomization 
    }}>
      {children}
    </CustomizationContext.Provider>
  );
};