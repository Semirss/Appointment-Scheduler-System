import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaDownload, FaEye, FaCalendarAlt, FaReceipt, FaClock, FaUser, FaBuilding } from 'react-icons/fa';
import axios from 'axios';
import { useCustomization } from '../../context/CustomizationContext';
import { useCompany } from '../../context/CompanyContext';

const ViewTransactions = () => {
  const { customization } = useCustomization(); // Get customization data
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [error, setError] = useState(null);
  const { company } = useCompany();

  // Apply the customized colors
  const containerStyle = {
    backgroundColor: customization.theme_background,
    color: customization.theme_text,
  };

  const cardStyle = {
    backgroundColor: customization.theme_background,
    color: customization.theme_text,
    border: `1px solid ${customization.theme_button}20` // 20% opacity
  };

  const buttonStyle = {
    backgroundColor: customization.theme_button,
    color: getContrastColor(customization.theme_button),
  };

  // Helper function to determine text color based on background
  function getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white depending on luminance
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }

  // Fetch transactions from backend API
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // const companyId = 6; // Using company ID 2 as specified
        const companyId = company?.company_id;
        const response = await axios.get(`https://test.dynamicrealestatemarketing.com/backend/api/transactions/company/${companyId}`);
        
        // if (!response.ok) {
        //   throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
        // }
        
        // const data = await response.json();
        console.log(response.data.data)
        setTransactions(response.data.data);
        setFilteredTransactions(response.data.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions based on search and filters
  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.service_name && transaction.service_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        transaction.transaction_id.toString().includes(searchTerm) ||
        transaction.appointment_id.toString().includes(searchTerm)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === selectedStatus);
    }

    if (selectedDate) {
      filtered = filtered.filter(transaction => 
        transaction.transaction_created && transaction.transaction_created.startsWith(selectedDate)
      );
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, selectedStatus, selectedDate, transactions]);

  const handleViewImage = (imageUrl) => {
    if (!imageUrl) return;
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleDownloadImage = (imageUrl, transactionId) => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `transaction-${transactionId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    
    try {
      return new Date(dateTimeString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    
    try {
      return new Date(dateTimeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid Time';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" style={containerStyle}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Transaction History</h1>
          <p className="text-gray-600">View and manage all appointment transactions</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error: {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6" style={cardStyle}>
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients, services, IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <button 
                onClick={() => {
                  // Re-apply filters
                  let filtered = transactions;
                  if (searchTerm) {
                    filtered = filtered.filter(transaction =>
                      transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (transaction.service_name && transaction.service_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                      transaction.transaction_id.toString().includes(searchTerm) ||
                      transaction.appointment_id.toString().includes(searchTerm)
                    );
                  }
                  if (selectedStatus !== 'all') {
                    filtered = filtered.filter(transaction => transaction.status === selectedStatus);
                  }
                  if (selectedDate) {
                    filtered = filtered.filter(transaction => 
                      transaction.transaction_created && transaction.transaction_created.startsWith(selectedDate)
                    );
                  }
                  setFilteredTransactions(filtered);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaFilter className="text-sm" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.transaction_id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            style={cardStyle}
            >
              {/* Transaction Header with Status */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    {transaction.status || 'N/A'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">TXN #{transaction.transaction_id}</p>
                  <p className="text-xs text-gray-500">APT #{transaction.appointment_id}</p>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-1">
                      <FaUser className="text-gray-400 text-sm" />
                      {transaction.user_name || 'Unknown Client'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                      <FaBuilding className="text-gray-400 text-xs" />
                      {transaction.service_name || 'Unknown Service'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendarAlt className="text-gray-400" />
                    <span>{formatDateTime(transaction.transaction_created)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaClock className="text-gray-400" />
                    <span>{formatTime(transaction.start_time)} - {formatTime(transaction.end_time)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-100 p-4 flex justify-between">
                <button 
                  onClick={() => handleViewImage(transaction.transaction_img)}
                  disabled={!transaction.transaction_img}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    transaction.transaction_img 
                      ? '' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  style={transaction.transaction_img ? {
                    backgroundColor: `${customization.theme_button}20`,
                    color: customization.theme_button
                  } : {}}
                >
                  <FaEye className="text-sm" />
                  View Receipt
                </button>
                <button 
                  onClick={() => handleDownloadImage(transaction.transaction_img, transaction.transaction_id)}
                  disabled={!transaction.transaction_img}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    transaction.transaction_img 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FaDownload className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTransactions.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FaReceipt className="mx-auto text-gray-300 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No transactions found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-semibold">Transaction Receipt</h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
              <div className="p-4">
                <img
                  src={selectedImage}
                  alt="Transaction receipt"
                  className="max-w-full max-h-96 object-contain mx-auto"
                />
              </div>
              <div className="p-4 border-t flex justify-end gap-3">
                <button
                  onClick={() => handleDownloadImage(selectedImage, 'view')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FaDownload />
                  Download
                </button>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTransactions;