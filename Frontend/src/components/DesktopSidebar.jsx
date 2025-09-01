import React from 'react';
import { FaTh, FaCalendarAlt, FaPlus, FaUserEdit, FaExchangeAlt, FaBars, FaChevronLeft } from 'react-icons/fa';
import { useCustomization } from '../context/CustomizationContext';
import { useCompany } from '../context/CompanyContext';
;

const navItems = [
  { name: 'Dashboard', icon: <FaTh /> },
  { name: 'View Appointment', icon: <FaCalendarAlt /> },
  { name: 'Add Appointment', icon: <FaPlus /> },
  { name: 'Update Customization', icon: <FaUserEdit /> },
  { name: 'View Transaction', icon: <FaExchangeAlt /> },
];

const DesktopSidebar = ({ setActiveTab, isCollapsed, setIsCollapsed, activeTab }) => {
  const { customization } = useCustomization();
  const { company } = useCompany();

  const sidebarStyle = {
    backgroundColor: customization.sidebar_bg,
    color: customization.sidebar_text,
    borderRight: `1px solid ${customization.theme_button}20`
  };

  const activeItemStyle = {
    backgroundColor: `${customization.theme_button}20`,
    color: customization.theme_button,
    borderLeft: `4px solid ${customization.theme_button}`
  };

  const hoverStyle = {
    backgroundColor: `${customization.theme_button}10`,
    color: customization.sidebar_text
  };

  return (
    <div
      className={`h-screen flex flex-col fixed top-0 left-0 transition-all duration-300 z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      } hidden md:flex`}
      style={sidebarStyle}
    >
      {/* Header */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-3 border-b`} style={{ borderColor: `${customization.theme_button}20` }}>
        {!isCollapsed && (
          <span className="text-sm font-bold tracking-wide">
            {company}
          </span>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-3 rounded-md transition-colors text-xl"
          style={{ 
            color: customization.sidebar_text,
            backgroundColor: 'transparent'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = `${customization.theme_button}20`}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
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
              activeTab === item.name ? 'font-semibold' : ''
            }`}
            style={activeTab === item.name ? activeItemStyle : { color: customization.sidebar_text }}
            onClick={() => setActiveTab(item.name)}
            // onMouseOver={(e) => {
            //   if (activeTab !== item.name) {
            //     e.target.style.backgroundColor = hoverStyle.backgroundColor;
            //     e.target.style.color = hoverStyle.color;
            //   }
            // }}
            // onMouseOut={(e) => {
            //   if (activeTab !== item.name) {
            //     e.target.style.backgroundColor = 'transparent';
            //     e.target.style.color = customization.sidebar_text;
            //   }
            // }}
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
        <div className="p-4 border-t text-xs text-center" style={{ borderColor: `${customization.theme_button}20`, color: customization.sidebar_text }}>
          © 2025 Gravity Technology. All Rights Reserved.
        </div>
      )}
    </div>
  );
};

export default DesktopSidebar;