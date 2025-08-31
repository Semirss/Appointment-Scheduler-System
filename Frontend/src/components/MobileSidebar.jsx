// MobileSidebar.jsx
import React from 'react';
import { FaTh, FaCalendarAlt, FaPlus, FaUserEdit, FaExchangeAlt } from 'react-icons/fa';

const navItems = [
  { name: 'Dashboard', icon: <FaTh /> },
  { name: 'View Appointment', icon: <FaCalendarAlt /> },
  { name: 'Add Appointment', icon: <FaPlus /> },
  { name: 'Update Information', icon: <FaUserEdit /> },
  { name: 'View Transaction', icon: <FaExchangeAlt /> },
];

const MobileSidebar = ({ setActiveTab }) => {
  const activeItem = 'Dashboard';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg p-2 flex justify-around">
      {navItems.map(item => (
        <div
          key={item.name}
          className={`flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
            activeItem === item.name ? 'text-blue-700' : 'text-gray-600'
          }`}
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