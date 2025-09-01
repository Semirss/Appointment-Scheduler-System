import React, { createContext, useState, useEffect } from 'react';
import { useContext } from 'react';

export const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCustomization must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(() => {
    const storedCompany = localStorage.getItem('companyName');
    return storedCompany ? storedCompany : null;
  });

//   const [role, setRole] = useState(() => {
//     const storedRole = localStorage.getItem('role');
//     return storedRole ? storedRole : null;
//   });

  useEffect(() => {
    if (company) {
      localStorage.setItem('companyName', company);
    //   localStorage.setItem('role', role)
    }
  }, [company]);

  return (
    <CompanyContext.Provider value={{ company, setCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

