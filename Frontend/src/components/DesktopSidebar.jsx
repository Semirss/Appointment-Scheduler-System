import React from 'react';
import { FaTh, FaCalendarAlt, FaPlus, FaUserEdit, FaExchangeAlt, FaBars, FaChevronLeft } from 'react-icons/fa';

const navItems = [
  { name: 'Dashboard', icon: <FaTh /> },
  { name: 'View Appointment', icon: <FaCalendarAlt /> },
  { name: 'Add Appointment', icon: <FaPlus /> },
  { name: 'Update Information', icon: <FaUserEdit /> },
  { name: 'View Transaction', icon: <FaExchangeAlt /> },
];

const DesktopSidebar = ({ setActiveTab, isCollapsed, setIsCollapsed, activeTab }) => {
  return (
    <div
      className={`bg-white h-screen flex flex-col fixed top-0 left-0 transition-all duration-300 z-50 border-r border-gray-200 ${
        isCollapsed ? 'w-20' : 'w-64'
      } hidden md:flex`}
    >
      {/* Header */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-3 border-b border-gray-100`}>
        {!isCollapsed && (
          <span className="text-xl font-bold text-gray-800 tracking-wide">Kati</span>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-3 rounded-md text-gray-500 hover:bg-gray-100 transition-colors text-xl"
        >
          {isCollapsed ? <FaBars className="text-xl" /> : <FaChevronLeft className="text-xl" />}
        </button>
      </div>
      
      {/* Navigation Items */}
      <div className={`flex-1 p-3 overflow-y-auto space-y-2 mt-2 ${isCollapsed ? 'items-center' : ''}`}>
        {navItems.map(item => (
          <div
            key={item.name}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              activeTab === item.name 
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-semibold' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab(item.name)}
          >
            <div className={`text-lg ${isCollapsed ? '' : 'mr-3'}`}>
              {item.icon}
            </div>
            {!isCollapsed && (
              <span className="text-sm tracking-wide">{item.name}</span>
            )}
          </div>
        ))}
      </div>
      
      {/* Footer (optional) */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-100 text-xs text-gray-500 text-center">
          © 2023 Kati App v1.2.0
        </div>
      )}
    </div>
  );
};

export default DesktopSidebar;