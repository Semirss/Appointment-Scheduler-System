import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useCompany } from './CompanyContext';

const CustomizationContext = createContext();

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};

export const CustomizationProvider = ({ children }) => {
  const { company } = useCompany();
  const companyId = company?.company_id;

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
    description: '', // Changed from banner_image
    font_family: 'Inter',
    font_size_base: '16px',
    font_heading: 'Inter',
    status: 'locked'
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomization = async () => {
    if (!companyId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`https://test.dynamicrealestatemarketing.com/backend/api/customizations/${companyId}`);

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
          description: dbData.description || '', // Changed from banner_image
          font_family: dbData.font_family || 'Inter',
          font_size_base: dbData.font_size_base || '16px',
          font_heading: dbData.font_heading || dbData.font_family || 'Inter',
          status: dbData.status || 'locked'
        });
      }
    } catch (error) {
      console.error('Error fetching customization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCustomizationToDB = async (newCustomization) => {
    try {
      // Prepare the data for both API calls - use the exact field names expected by backend
      const customizationData = {
        bg_color: newCustomization.theme_background,
        text_color: newCustomization.theme_text,
        btn_color: newCustomization.theme_button,
        card_color: newCustomization.theme_card,
        sidebar_bg_color: newCustomization.sidebar_bg,
        sidebar_text_color: newCustomization.sidebar_text,
        header_bg_color: newCustomization.header_bg,
        header_text_color: newCustomization.header_text,
        logo_url: newCustomization.logo_url,
        description: newCustomization.description,
        font_family: newCustomization.font_family,
        font_size_base: newCustomization.font_size_base,
        font_heading: newCustomization.font_heading,
        status: newCustomization.status
      };

      let finalResponse = { success: false, message: 'Failed to save to any database' };

      // Save to the first URL: test.dynamicrealestatemarketing.com
      try {
        const response = await axios.put(`https://test.dynamicrealestatemarketing.com/backend/api/customizations/${companyId}`, customizationData);
        if (response.data.success) {
          finalResponse = { success: true, message: 'Customization saved to Dynamic Real Estate Marketing.' };
        } else {
          finalResponse = { success: false, message: response.data.message || 'Unknown error from primary API.' };
        }
      } catch (error) {
        console.error('Error saving to Dynamic Real Estate Marketing:', error);
        // We'll still try the second API even if this one fails
      }

      // Save to the second URL: gravity.et
      try {
        // 1. Get the domain
        const companyResponse = await axios.get(`https://test.dynamicrealestatemarketing.com/backend/api/company/${companyId}`);
        const domain = companyResponse.data.data.domain;

        if (domain) {
          // 2. Get the new companyId using the domain
          const domainResponse = await axios.get(`https://gravity.et/backend/api/companies/domain/${domain}`);
          const newCompanyId = domainResponse.data.data.company_id;

          if (newCompanyId) {
            // 3. Save the customization using the new ID
            await axios.put(`https://gravity.et/backend/api/customizations/${newCompanyId}`, customizationData);
            
            // Update the final response if the gravity.et save was successful
            if (finalResponse.success) {
              finalResponse.message += ' Also saved to Gravity.et.';
            } else {
              finalResponse = { success: true, message: 'Customization saved to Gravity.et only.' };
            }
          } else {
            console.error('Gravity.et API Error: Could not get new company ID for domain:', domain);
            finalResponse.message += ' (Gravity.et save failed: new ID not found)';
          }
        } else {
          console.error('Dynamic Real Estate Marketing API Error: Could not get domain for companyId:', companyId);
          finalResponse.message += ' (Gravity.et save failed: domain not found)';
        }
      } catch (gravityError) {
        console.error('Error saving to Gravity.et:', gravityError);
        finalResponse.message += ' (Gravity.et save failed)';
      }

      return finalResponse;

    } catch (error) {
      // This catch block will only execute if the initial setup or data retrieval fails.
      console.error('Unexpected error:', error);
      return { success: false, message: 'An unexpected error occurred.' };
    }
  };

  // New function to handle the lock status
  const lockCustomization = async () => {
    if (!companyId) return;

    // Save the current state to a variable for potential rollback
    const prevCustomization = customization;
    // Optimistically update the local state
    setCustomization(prev => ({ ...prev, status: 'locked' }));

    try {
        // First API call: Lock customization in Dynamic Real Estate Marketing system
        const dynamicApiUrl = `https://test.dynamicrealestatemarketing.com/backend/api/customizations/lock`;
        const dynamicApiRequestData = { company_id: companyId };
        const dynamicApiResponse = await axios.post(dynamicApiUrl, dynamicApiRequestData);

        if (!dynamicApiResponse.data.success) {
            console.error('Dynamic Real Estate Marketing database lock failed:', dynamicApiResponse.data.message);
            throw new Error('Database lock failed');
        }

        console.log("Customization locked successfully in Dynamic Real Estate Marketing system.");

        // Second API call: Lock customization in Gravity.et system
        try {
            // 1. Get the domain
            const companyResponse = await axios.get(`https://test.dynamicrealestatemarketing.com/backend/api/company/${companyId}`);
            const domain = companyResponse.data.data.domain;

            if (domain) {
                // 2. Get the new company ID using the domain
                const domainResponse = await axios.get(`https://gravity.et/backend/api/companies/domain/${domain}`);
                const newCompanyId = domainResponse.data.data.company_id;

                if (newCompanyId) {
                    // 3. Post the lock request using the new ID
                    const gravityApiUrl = 'https://gravity.et/backend/api/customizations/lock';
                    const gravityApiRequestData = { company_id: newCompanyId };
                    const gravityApiResponse = await axios.post(gravityApiUrl, gravityApiRequestData);
                    
                    if (gravityApiResponse.data.success) {
                        console.log("Customization locked successfully in Gravity.et system.");
                    } else {
                        console.error('Gravity.et database lock failed:', gravityApiResponse.data.message);
                    }
                } else {
                    console.error('Gravity.et API Error: Could not get new company ID for domain:', domain);
                }
            } else {
                console.error('Dynamic Real Estate Marketing API Error: Could not get domain for companyId:', companyId);
            }
        } catch (gravityError) {
            console.error('Error locking status in Gravity.et:', gravityError);
            // We do not re-throw here because the primary lock was successful
        }

    } catch (error) {
        console.error('Error locking status:', error);
        // Revert local state if the primary save fails
        setCustomization(prevCustomization);
        throw error;
    }
  };

  const updateCustomization = async (newCustomization) => {
    if (!companyId) return;

    // Optimistically update local state for responsive UI
    setCustomization(newCustomization);

    // Save to database
    const result = await saveCustomizationToDB(newCustomization);
    if (!result.success) {
      console.error('Error updating customization:', result.message);
      // Revert local state if database save fails
      fetchCustomization();
      throw new Error(result.message);
    }
  };

  // Old updateStatus function, now just a simple router
  const updateStatus = async (newStatus) => {
    if (newStatus === 'locked') {
      return await lockCustomization();
    }
    // You can add an 'unlocked' case here if needed
  };

  const handleLogoUpload = async (file) => {
    if (!companyId) {
      console.error("No company ID available to upload logo.");
      return { success: false, message: "No company ID available." };
    }

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await axios.post(
        `https://test.dynamicrealestatemarketing.com/backend/api/customizations/upload-logo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success && response.data.url) {
        const newLogoUrl = response.data.url;
        const updatedCustomization = { ...customization, logo_url: newLogoUrl };
        setCustomization(updatedCustomization); // Update local state
        await saveCustomizationToDB(updatedCustomization); // Save the new URL to the database
        console.log('Logo uploaded and URL saved successfully.');
        return { success: true, url: newLogoUrl };
      } else {
        throw new Error(response.data.message || 'Logo upload failed.');
      }
    } catch (error) {
      console.error('Error during logo upload:', error);
      return { success: false, message: "An error occurred during upload." };
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchCustomization();
    }
  }, [companyId]);

  return (
    <CustomizationContext.Provider value={{
      customization,
      updateCustomization,
      updateStatus,
      isLoading,
      refreshCustomization: fetchCustomization,
      handleLogoUpload
    }}>
      {children}
    </CustomizationContext.Provider>
  );
};