import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaDownload, FaEye, FaCalendarAlt, FaReceipt, FaImage } from 'react-icons/fa';

const ViewTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // Sample transaction data with images
  const sampleTransactions = [
    {
      transaction_id: 1,
      appointment_id: 101,
      transaction_img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop',
      amount: 75.00,
      status: 'completed',
      client_name: 'John Smith',
      service: 'Haircut & Styling',
      created_at: '2023-11-15 10:30:00',
      payment_method: 'Credit Card'
    },
    {
      transaction_id: 2,
      appointment_id: 102,
      transaction_img: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=400&h=300&fit=crop',
      amount: 120.00,
      status: 'completed',
      client_name: 'Sarah Johnson',
      service: 'Color Treatment',
      created_at: '2023-11-15 14:45:00',
      payment_method: 'PayPal'
    },
    {
      transaction_id: 3,
      appointment_id: 103,
      transaction_img: 'https://images.unsplash.com/photo-1613243555978-636c48dc653c?w=400&h=300&fit=crop',
      amount: 45.00,
      status: 'pending',
      client_name: 'Mike Wilson',
      service: 'Beard Trim',
      created_at: '2023-11-16 09:15:00',
      payment_method: 'Cash'
    },
    {
      transaction_id: 4,
      appointment_id: 104,
      transaction_img: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
      amount: 85.00,
      status: 'completed',
      client_name: 'Emily Davis',
      service: 'Manicure & Pedicure',
      created_at: '2023-11-16 11:30:00',
      payment_method: 'Debit Card'
    },
    {
      transaction_id: 5,
      appointment_id: 105,
      transaction_img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
      amount: 95.00,
      status: 'failed',
      client_name: 'Robert Brown',
      service: 'Massage Therapy',
      created_at: '2023-11-17 15:20:00',
      payment_method: 'Credit Card'
    }
  ];

  // Simulate API call to fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setTransactions(sampleTransactions);
        setFilteredTransactions(sampleTransactions);
        setIsLoading(false);
      }, 1000);
    };

    fetchTransactions();
  }, []);

  // Filter transactions based on search and filters
  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transaction_id.toString().includes(searchTerm) ||
        transaction.appointment_id.toString().includes(searchTerm)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === selectedStatus);
    }

    if (selectedDate) {
      filtered = filtered.filter(transaction => 
        transaction.created_at.startsWith(selectedDate)
      );
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, selectedStatus, selectedDate, transactions]);

  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleDownloadImage = (imageUrl, transactionId) => {
    // Simulate download functionality
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Transaction History</h1>
          <p className="text-gray-600">View and manage all appointment transactions</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions, clients, services..."
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
              
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FaFilter className="text-sm" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.transaction_id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Transaction Image */}
              <div className="relative h-48 bg-gray-100">
                {transaction.transaction_img ? (
                  <img
                    src={transaction.transaction_img}
                    alt={`Transaction ${transaction.transaction_id}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => handleViewImage(transaction.transaction_img)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaImage className="text-3xl" />
                    <span className="ml-2">No Image</span>
                  </div>
                )}
                
                {/* Status Badge */}
                <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
                
                {/* Image Actions */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => handleViewImage(transaction.transaction_img)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="View Image"
                  >
                    <FaEye className="text-gray-600 text-sm" />
                  </button>
                  <button
                    onClick={() => handleDownloadImage(transaction.transaction_img, transaction.transaction_id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="Download Image"
                  >
                    <FaDownload className="text-gray-600 text-sm" />
                  </button>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{transaction.client_name}</h3>
                    <p className="text-sm text-gray-600">{transaction.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-800">${transaction.amount}</p>
                    <p className="text-xs text-gray-500">{transaction.payment_method}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaReceipt className="text-gray-400" />
                    <span>ID: {transaction.transaction_id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendarAlt className="text-gray-400" />
                    <span>{formatDate(transaction.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-gray-400">Appointment:</span>
                    <span>#{transaction.appointment_id}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-100 p-4">
                <button className="w-full py-2 px-4 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
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
                <h3 className="font-semibold">Transaction Image</h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-400 hover:text-gray-600"
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