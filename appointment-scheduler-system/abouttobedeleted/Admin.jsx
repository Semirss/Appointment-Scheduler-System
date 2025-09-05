import React, { useState, useEffect } from 'react';

// Main App component
const Admin = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [notificationCount, setNotificationCount] = useState(3);

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardView />;
      case 'addCompany':
        return <EnhancedAddCompanyForm />;
      case 'viewCompanies':
        return <ViewCompaniesList companies={mockCompanies} />;
      case 'template':
        return <TemplateForm />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-lg flex flex-col items-center py-6 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Kati Admin</h1>
        <nav className="w-full">
          <ul>
            <li className="mb-4">
              <button
                onClick={() => handleNavigation('dashboard')}
                className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
            </li>
            <li className="mb-4">
              <button
                onClick={() => handleNavigation('addCompany')}
                className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 ${
                  currentPage === 'addCompany'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                Add Company
              </button>
            </li>
            <li className="mb-4">
              <button
                onClick={() => handleNavigation('viewCompanies')}
                className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 ${
                  currentPage === 'viewCompanies'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                View Companies
              </button>
            </li>
            <li className="mb-4">
              <button
                onClick={() => handleNavigation('template')}
                className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 ${
                  currentPage === 'template'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                Template
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header with Notifications */}
        <header className="flex items-center justify-between p-4 bg-white shadow-md rounded-xl mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentPage === 'dashboard' && 'Dashboard Overview'}
            {currentPage === 'addCompany' && 'Add New Company'}
            {currentPage === 'viewCompanies' && 'Registered Companies'}
            {currentPage === 'template' && 'Company Template'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0v1a3 3 0 10-6 0v-1"
                />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
};

// Dashboard Content with Charts
const DashboardView = () => {
  // Mock data for charts
  const userGrowthData = {
    labels: ['2021', '2022', '2023'],
    datasets: [
      {
        data: [3000, 2500, 1800],
        backgroundColor: ['#4C51BF', '#ED8936', '#E53E3E'],
      },
    ],
  };

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Active Users',
        data: [1200, 1900, 1500, 2100, 1800, 2500, 2200, 2400, 2100, 2300, 2200, 2400],
        borderColor: '#4C51BF',
        backgroundColor: 'rgba(76, 81, 191, 0.1)',
        fill: true,
      },
    ],
  };

  const appointmentData = [
    { company: 'Innovate Solutions', count: 142, status: 'High' },
    { company: 'Green Harvest Farm', count: 98, status: 'Medium' },
    { company: 'Urban Fitness Co.', count: 203, status: 'High' },
    { company: 'Apex Logistics', count: 76, status: 'Medium' },
    { company: 'Petal & Stem Florist', count: 45, status: 'Low' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Companies</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">124</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Registered Users</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">5,852</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Active Users</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">2,415</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Pending Actions</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">18</p>
        </div>
      </div>

      {/* Charts and Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Growth (2021-2023)</h3>
          <div className="flex justify-center items-center h-64">
            <PieChart data={userGrowthData} />
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Lost 3 years of growth momentum
          </div>
        </div>

        {/* Monthly Active Users */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Active Users</h3>
          <div className="h-64">
            <LineChart data={monthlyData} />
          </div>
        </div>
      </div>

      {/* Appointment Analytics */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Analytics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointment Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointmentData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'High'
                          ? 'bg-red-100 text-red-800'
                          : item.status === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${transaction.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Enhanced Add Company Form
const EnhancedAddCompanyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    address: '',
    website: '',
    description: '',
    logo: null,
    status: 'Active'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSuccessMessage('Company added successfully!');
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      category: '', 
      address: '', 
      website: '', 
      description: '', 
      logo: null, 
      status: 'Active' 
    });
    setLogoPreview(null);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
          <p>{successMessage}</p>
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Add New Company</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
              placeholder="Enter company name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
              placeholder="company@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
            >
              <option value="">Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Retail">Retail</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              name="website"
              id="website"
              value={formData.website}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
            placeholder="Enter company address"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
            placeholder="Brief description of the company"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
            <div className="mt-1 flex items-center">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload a file</span>
                <input 
                  id="logo" 
                  name="logo" 
                  type="file" 
                  className="sr-only" 
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
              <p className="pl-1 text-sm text-gray-500">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
          </div>
          
          {logoPreview && (
            <div className="flex justify-center">
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Logo Preview:</p>
                <div className="h-20 w-20 rounded-md overflow-hidden border border-gray-200">
                  <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            type="button"
            className="mr-4 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Company
          </button>
        </div>
      </form>
    </div>
  );
};

// Template Form
const TemplateForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    color: '#3b82f6',
    logo: null
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Template submitted:', formData);
    setSuccessMessage('Template saved successfully!');
    setFormData({ 
      companyName: '', 
      description: '', 
      color: '#3b82f6', 
      logo: null 
    });
    setLogoPreview(null);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
          <p>{successMessage}</p>
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Company Template</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
          <input
            type="text"
            name="companyName"
            id="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
            placeholder="Enter company name"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border"
            placeholder="Brief description of the company"
          />
        </div>
        
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Brand Color</label>
          <div className="flex items-center mt-1">
            <input
              type="color"
              name="color"
              id="color"
              value={formData.color}
              onChange={handleChange}
              className="h-10 w-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border cursor-pointer"
            />
            <span className="ml-3 text-sm text-gray-500">{formData.color}</span>
          </div>
        </div>
        
        <div>
          <label htmlFor="templateLogo" className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
          <div className="mt-1 flex items-center">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
              <span>Upload a file</span>
              <input 
                id="templateLogo" 
                name="logo" 
                type="file" 
                className="sr-only" 
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
            <p className="pl-1 text-sm text-gray-500">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
          
          {logoPreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-1">Logo Preview:</p>
              <div className="h-20 w-20 rounded-md overflow-hidden border border-gray-200">
                <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain" />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            type="button"
            className="mr-4 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Template
          </button>
        </div>
      </form>
    </div>
  );
};

// Simple Pie Chart Component
const PieChart = ({ data }) => {
  const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
  let cumulativePercent = 0;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {data.datasets[0].data.map((value, i) => {
        const percent = (value / total) * 100;
        const startPercent = cumulativePercent;
        cumulativePercent += percent;

        return (
          <circle
            key={i}
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke={data.datasets[0].backgroundColor[i]}
            strokeWidth="10"
            strokeDasharray={`${percent} ${100 - percent}`}
            strokeDashoffset={-startPercent + 25}
            transform="rotate(-90 50 50)"
          />
        );
      })}
      <text x="50" y="50" textAnchor="middle" dy="0.3em" fontSize="12" fontWeight="bold">
        {total} Users
      </text>
    </svg>
  );
};

// Simple Line Chart Component
const LineChart = ({ data }) => {
  const values = data.datasets[0].data;
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="100"
          y2={y}
          stroke="#E5E7EB"
          strokeWidth="0.5"
        />
      ))}

      {/* Data line */}
      <polyline
        fill="none"
        stroke={data.datasets[0].borderColor}
        strokeWidth="2"
        points={values
          .map(
            (value, i) =>
              `${(i / (values.length - 1)) * 100},${
                100 - ((value - minValue) / range) * 80
              }`
          )
          .join(" ")}
      />

      {/* Data points */}
      {values.map((value, i) => (
        <circle
          key={i}
          cx={(i / (values.length - 1)) * 100}
          cy={100 - ((value - minValue) / range) * 80}
          r="2"
          fill={data.datasets[0].borderColor}
        />
      ))}

      {/* Fill under line */}
      <polygon
        fill={data.datasets[0].backgroundColor}
        fillOpacity="0.3"
        points={`${values
          .map(
            (value, i) =>
              `${(i / (values.length - 1)) * 100},${
                100 - ((value - minValue) / range) * 80
              }`
          )
          .join(" ")}, 100,100, 0,100`}
      />
    </svg>
  );
};

// View Companies List
const ViewCompaniesList = ({ companies }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact Person
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map((company) => (
            <tr key={company.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.contactPerson}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  company.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {company.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Mock data
const mockCompanies = [
  { id: 1, name: 'Innovate Solutions', category: 'Tech Consulting', contactPerson: 'Jane Doe', status: 'Active' },
  { id: 2, name: 'Green Harvest Farm', category: 'Agriculture', contactPerson: 'John Smith', status: 'Awaiting Setup' },
  { id: 3, name: 'Urban Fitness Co.', category: 'Health & Wellness', contactPerson: 'Emily White', status: 'Active' },
  { id: 4, name: 'Apex Logistics', category: 'Transportation', contactPerson: 'Michael Brown', status: 'Active' },
  { id: 5, name: 'Petal & Stem Florist', category: 'Retail', contactPerson: 'Sarah Chen', status: 'Awaiting Setup' },
];

const recentTransactions = [
  { time: '2023-10-15 14:30', name: 'John Smith', id: 'TX001234', status: 'Completed', amount: '249.99' },
  { time: '2023-10-15 13:45', name: 'Sarah Johnson', id: 'TX001235', status: 'Pending', amount: '99.50' },
  { time: '2023-10-15 12:20', name: 'Mike Thompson', id: 'TX001236', status: 'Completed', amount: '499.00' },
  { time: '2023-10-15 11:15', name: 'Emily Davis', id: 'TX001237', status: 'Completed', amount: '125.75' },
  { time: '2023-10-15 10:05', name: 'Robert Wilson', id: 'TX001238', status: 'Pending', amount: '299.99' },
];

export default Admin;