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

const CompanyLayout = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
        case 'Dashboard':
            return <Dashboard />;
        case 'View Appointment':
            return <ViewAppointment />;
        case 'Add Appointment':
            return <AddAppointment />;
        case 'Update Information':
            return <UpdateInformation />;
        case 'View Transaction':
            return <ViewTransactions />;
      // Add cases for other tabs as needed
      default:
        return <Dashboard />;
    }
  };

  // Dynamically set padding based on the collapsed state
  const mainContentPadding = isCollapsed ? 'md:pl-20' : 'md:pl-64';

  return (
    <div className="flex min-h-screen">
      {/* Pass the activeTab state and setter to the sidebar */}
      <DesktopSidebar 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        activeTab={activeTab}
      />
      <MobileSidebar setActiveTab={setActiveTab} />

      <div className={`flex-1 flex flex-col ${mainContentPadding}`}>
        <Header isCollapsed={isCollapsed} />
        <main className="flex-1 p-8 bg-gray-100 mt-16">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;