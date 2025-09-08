// CompanyLayout.jsx
import React, { useState } from 'react';

import Dashboard from './Dashboard';
import ViewAppointment from './ViewAppointment';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileSidebar from '../../components/MobileSidebar';
import Header from '../../components/Header';
import AddAppointment from './AddAppointment';
import UpdateInformation from './UpdateInformation';
import ViewTransactions from './ViewTransactions';
import { useCustomization } from '../../context/CustomizationContext';
import AddService from './AddService';

const CompanyLayout = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { customization } = useCustomization();

  // Apply the customized colors to the layout
  const layoutStyle = {
    backgroundColor: customization.theme_background,
    color: customization.theme_text,
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'View Appointment':
        return <ViewAppointment />;
      case 'Add Service':
        return <AddService />;
      case 'Update Information':
        return <UpdateInformation />;
      case 'View Transaction':
        return <ViewTransactions />;
      default:
        return <Dashboard />;
    }
  };

  // Dynamically set padding based on the collapsed state
  const mainContentPadding = isCollapsed ? 'md:pl-20' : 'md:pl-64';

  return (
    <div className="flex min-h-screen" style={layoutStyle}>
      {/* Pass the activeTab state and setter to the sidebar */}
      <DesktopSidebar 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        activeTab={activeTab}
      />
      
      <MobileSidebar 
        setActiveTab={setActiveTab} 
        activeTab={activeTab}
      />

      <div className={`flex-1 flex flex-col ${mainContentPadding}`}>
        <Header 
          isCollapsed={isCollapsed} 
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8 mt-16 pb-16" style={{ backgroundColor: customization.theme_background }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;