import React from 'react';
import { FaTh, FaCalendarAlt, FaPlus, FaUserEdit, FaExchangeAlt } from 'react-icons/fa';
import { useCustomization } from '../context/CustomizationContext';

const navItems = [
  { name: 'Dashboard', icon: <FaTh /> },
  { name: 'View Appointment', icon: <FaCalendarAlt /> },
  { name: 'Add Appointment', icon: <FaPlus /> },
  { name: 'Update Information', icon: <FaUserEdit /> },
  { name: 'View Transaction', icon: <FaExchangeAlt /> },
];

const MobileSidebar = ({ setActiveTab, activeTab }) => {
  const { customization } = useCustomization();

  const mobileSidebarStyle = {
    backgroundColor: customization.sidebar_bg,
    color: customization.sidebar_text,
    boxShadow: `0 -2px 10px ${customization.theme_button}10`
  };

  const activeItemStyle = {
    color: customization.theme_button
  };

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 shadow-lg p-2 flex justify-around"
      style={mobileSidebarStyle}
    >
      {navItems.map(item => (
        <div
          key={item.name}
          className={`flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
            activeTab === item.name ? 'font-semibold' : ''
          }`}
          style={activeTab === item.name ? activeItemStyle : { color: customization.sidebar_text }}
          onClick={() => setActiveTab(item.name)}
        >
          <div className="text-xl">{item.icon}</div>
          <span className="text-xs mt-1">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default MobileSidebar;