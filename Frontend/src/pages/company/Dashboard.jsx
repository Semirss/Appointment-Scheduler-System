import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in progress':
      return 'bg-blue-100 text-blue-800';
    case 'scheduled':
      return 'bg-yellow-100 text-yellow-800';
    case 'canceled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Appointee ID can be a prop, a context variable, or a constant
  const appointeeId = 2;

  useEffect(() => {
    fetchDashboardData();
  }, [appointeeId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [usersResponse, appointmentsResponse, ratingsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/users'),
        axios.get(`http://localhost:5000/api/appointments/appointees/${appointeeId}`),
        axios.get('http://localhost:5000/api/ratings')
      ]);

      setUsers(usersResponse.data.data || []);
      setAppointments(appointmentsResponse.data.data || []);
      setRatings(ratingsResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === date.toDateString();

    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) return `Today, ${timeStr}`;
    if (isYesterday) return `Yesterday, ${timeStr}`;

    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
  };

  // Memoize the calculation of stats to improve performance
  const stats = useMemo(() => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Filter users created in the last month as "new"
    const newUsersThisMonth = users.filter(user => {
      const userDate = new Date(user.created_at);
      return userDate >= oneMonthAgo;
    });

    // Calculate monthly growth data (last 6 months)
    const monthlyGrowth = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 6; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${month.getFullYear()}-${month.getMonth()}`;
      monthlyGrowth[monthKey] = {
        label: monthNames[month.getMonth()],
        count: 0
      };
    }

    users.forEach(user => {
      const userDate = new Date(user.created_at);
      const monthKey = `${userDate.getFullYear()}-${userDate.getMonth()}`;

      if (monthlyGrowth[monthKey]) {
        monthlyGrowth[monthKey].count++;
      }
    });

    // Calculate appointment stats
    const todaysAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.start_time);
      return aptDate.toDateString() === now.toDateString();
    });

    const thisWeekAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.start_time);
      return aptDate >= oneWeekAgo;
    });

    const thisMonthAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.start_time);
      return aptDate >= oneMonthAgo;
    });

    // Calculate weekly appointments for chart
    const weeklyAppointments = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
    };

    thisWeekAppointments.forEach(apt => {
      const aptDate = new Date(apt.start_time);
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][aptDate.getDay()];
      weeklyAppointments[dayName]++;
    });

    // Calculate satisfaction rating
    const averageRating = ratings.length > 0
      ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length) * 20
      : 0;

    // Prepare recent activities from appointments using names from the fetched data
    const recentActivities = appointments
      .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
      .slice(0, 5)
      .map(apt => ({
        id: apt.appointment_id,
        dateTime: formatDateTime(apt.start_time),
        client: apt.name || `Client #${apt.user_id}`,
        service: apt.service_name || `Service #${apt.service_id}`,
        referenceId: `APT-${apt.appointment_id}`,
        status: apt.status || 'Scheduled',
      }));

    return {
      totalClients: users.length,
      newThisMonth: newUsersThisMonth.length,
      averageRating,
      monthlyGrowth: Object.values(monthlyGrowth).map(item => item.count),
      monthlyLabels: Object.values(monthlyGrowth).map(item => item.label),
      todayCount: todaysAppointments.length,
      thisWeekCount: thisWeekAppointments.length,
      thisMonthCount: thisMonthAppointments.length,
      weeklyAppointments: Object.values(weeklyAppointments),
      recentActivities
    };
  }, [users, appointments, ratings]);

  // Client growth chart data
  const getClientGrowthData = () => {
    return {
      labels: stats.monthlyLabels.length > 0 ? stats.monthlyLabels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [{
        label: 'Number of Clients',
        data: stats.monthlyGrowth.length > 0 ? stats.monthlyGrowth : [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3,
      }]
    };
  };

  const clientGrowthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Client Growth Trend',
      },
    },
  };

  // Appointment trend chart data
  const getAppointmentChartData = () => {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Appointments',
        data: stats.weeklyAppointments,
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2,
      }]
    };
  };

  const appointmentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'This Week\'s Appointments',
      },
    },
  };

  // Client status chart data
  const getClientStatusData = () => {
    const activeClients = stats.totalClients - stats.newThisMonth;

    return {
      labels: ['Active', 'New', 'Inactive'],
      datasets: [{
        data: [activeClients, stats.newThisMonth, 0],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(156, 163, 175)',
        ],
        borderWidth: 1,
      }]
    };
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <main className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Clients Statistics */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Clients</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-700">
                {stats.totalClients}
              </div>
              <div className="text-sm text-gray-600 mt-1">Number of Clients</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-700">
                {stats.newThisMonth}
              </div>
              <div className="text-sm text-gray-600 mt-1">New This Month</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-700">
                {stats.averageRating.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Satisfaction Rate</div>
            </div>
          </div>
          <div className="h-64">
            <Line data={getClientGrowthData()} options={clientGrowthOptions} />
          </div>
        </div>

        {/* Appointments by Date */}
        <div className="col-span-1 bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Appointments by Date</h2>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Today</span>
              <span className="font-semibold">
                {stats.todayCount}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="font-semibold">
                {stats.thisWeekCount}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">This Month</span>
              <span className="font-semibold">
                {stats.thisMonthCount}
              </span>
            </div>
          </div>
          <div className="h-40 mb-4">
            <Bar data={getAppointmentChartData()} options={appointmentOptions} />
          </div>
          <div className="h-40">
            <Doughnut data={getClientStatusData()} />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recent Appointments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentActivities.length > 0 ? (
                  stats.recentActivities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.dateTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.client}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.referenceId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No recent appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;