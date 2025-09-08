import React, { createContext, useState, useEffect } from 'react';
import { useContext } from 'react';

export const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(() => {
    try {
      // Retrieve the stored company data as a string
      const storedCompany = localStorage.getItem('company');
      // Parse the JSON string back into a JavaScript object
      return storedCompany ? JSON.parse(storedCompany) : null;
    } catch (error) {
      console.error("Failed to parse company from localStorage:", error);
      return null;
    }
  });

  useEffect(() => {
    if (company) {
      // Stringify the entire company object before saving to localStorage
      localStorage.setItem('company', JSON.stringify(company));
    } else {
      // Clear localStorage if the company state is null
      localStorage.removeItem('company');
    }
  }, [company]);

  return (
    <CompanyContext.Provider value={{ company, setCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};