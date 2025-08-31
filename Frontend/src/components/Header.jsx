import React from 'react';
import { FaBell, FaSearch } from 'react-icons/fa';
import { useCustomization } from '../context/CustomizationContext';

const Header = ({ isCollapsed, customization }) => {
    const { customization: custom } = useCustomization();
  
    const headerStyle = {
        backgroundColor: custom.header_bg,
        color: custom.header_text,
        borderColor: custom.theme_button
    };

    const buttonStyle = {
        color: custom.theme_button,
        // backgroundColor: custom.theme_button
    };
  return (
    <header 
    style={headerStyle}
    className={`fixed top-0 right-0 flex justify-between items-center p-[0.66rem] bg-white border-b border-gray-200 shadow-sm z-40 transition-all duration-300 ${isCollapsed ? 'left-20' : 'left-64'}`}>
      {/* Search Bar */}
      <div className="relative flex-1 max-w-2xl ml-4">
        <div className="relative">
          <FaSearch className="h-4 w-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transaction ID, date, amount..."
            className="bg-gray-50 w-full pl-12 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Notification Bell Only */}
      <div className="flex items-center ml-6 mr-4">
        <div className="relative">
          <button className="relative p-3 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <FaBell style={buttonStyle} className="h-6 w-6 text-gray-600" />
            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-xs text-white items-center justify-center font-medium">3</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;


