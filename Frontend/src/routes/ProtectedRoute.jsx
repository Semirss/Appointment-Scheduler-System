import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';

const ProtectedRoute = ({ children }) => {
  const { company } = useCompany();

  // If no company is logged in, redirect to login
  if (!company || !company.company_id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
