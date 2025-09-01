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
import { useCustomization } from '../../context/CustomizationContext';
import { CheckCircle, AlertCircle, Users, Calendar, Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

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
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'scheduled':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'canceled':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Animation variants for stats cards
const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

// Animation for counter
const counterVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Animated counter component
const AnimatedCounter = ({ value, duration = 1 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    const totalMilSecDur = duration * 1000;
    const incrementTime = (totalMilSecDur / end) * 10;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <motion.span
      variants={counterVariants}
      initial="hidden"
      animate="visible"
      key={value}
      className="text-2xl font-bold text-foreground"
    >
      {count}
    </motion.span>
  );
};

const Dashboard = () => {
  const { customization } = useCustomization();
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Appointee ID can be a prop, a context variable, or a constant
  const appointeeId = 2;

  useEffect(() => {
    fetchDashboardData();
  }, [appointeeId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

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
      setError('Failed to load dashboard data. Please try again later.');
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
      totalActiveClients: users.length,
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
        borderColor: customization.theme_button || '#8b5cf6',
        backgroundColor: `${customization.theme_button || '#8b5cf6'}20`,
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
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Client Growth Trend',
        font: {
          size: 16,
          weight: '600'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Appointment trend chart data
  const getAppointmentChartData = () => {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Appointments',
        data: stats.weeklyAppointments,
        backgroundColor: `${customization.theme_button || '#8b5cf6'}20`,
        borderColor: customization.theme_button || '#8b5cf6',
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.6,
      }]
    };
  };

  const appointmentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'This Week\'s Appointments',
        font: {
          size: 16,
          weight: '600'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Client status chart data
  const getClientStatusData = () => {
    const activeClients = stats.totalActiveClients - stats.newThisMonth;

    return {
      labels: ['Active', 'New', 'Inactive'],
      datasets: [{
        data: [activeClients, stats.newThisMonth, 0],
        backgroundColor: [
          customization.theme_button || '#8b5cf6',
          '#10b981',
          '#6b7280',
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 6,
        hoverOffset: 12,
      }]
    };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-card rounded-2xl border border-border p-8 flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {error && (
        <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-lg animate-slide-in-up">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-destructive mr-3" />
            <p className="text-destructive font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.5 }}
          variants={cardVariants}
          className="bg-card rounded-2xl border border-border p-6 hover-lift hover:shadow-lg transition-all duration-300"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center">
            <motion.div 
              className="p-3 rounded-xl bg-primary/10 mr-4"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Users className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <p className="text-sm text-muted-foreground">Total Clients</p>
              <AnimatedCounter value={stats.totalActiveClients} duration={1} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">{stats.newThisMonth} new</span> this month
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.5 }}
          variants={cardVariants}
          className="bg-card rounded-2xl border border-border p-6 hover-lift hover:shadow-lg transition-all duration-300"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center">
            <motion.div 
              className="p-3 rounded-xl bg-blue-500/10 mr-4"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Calendar className="w-6 h-6 text-blue-500" />
            </motion.div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Appointments</p>
              <AnimatedCounter value={stats.todayCount} duration={1} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{stats.thisWeekCount} this week</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.5 }}
          variants={cardVariants}
          className="bg-card rounded-2xl border border-border p-6 hover-lift hover:shadow-lg transition-all duration-300"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <motion.div 
              className="p-3 rounded-xl bg-amber-500/10 mr-4"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Star className="w-6 h-6 text-amber-500" />
            </motion.div>
            <div>
              <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
              <motion.h3 
                className="text-2xl font-bold text-foreground"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                key={stats.averageRating}
              >
                {stats.averageRating.toFixed(1)}%
              </motion.h3>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Based on <span className="font-medium">{ratings.length} reviews</span>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.5 }}
          variants={cardVariants}
          className="bg-card rounded-2xl border border-border p-6 hover-lift hover:shadow-lg transition-all duration-300"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <motion.div 
              className="p-3 rounded-xl bg-purple-500/10 mr-4"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </motion.div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Growth</p>
              <AnimatedCounter value={stats.newThisMonth} duration={1} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{((stats.newThisMonth / stats.totalActiveClients) * 100).toFixed(1)}%</span> growth rate
            </p>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Growth Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card rounded-2xl border border-border p-6 hover-lift"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Client Growth Trend</h3>
          <div className="h-80">
            <Line data={getClientGrowthData()} options={clientGrowthOptions} />
          </div>
        </motion.div>

        {/* Appointments Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-card rounded-2xl border border-border p-6 hover-lift"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">Appointments Overview</h3>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary mr-2"></div>
                <span className="text-muted-foreground">This Week</span>
              </div>
            </div>
          </div>
          <div className="h-64 mb-6">
            <Bar data={getAppointmentChartData()} options={appointmentOptions} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <p className="text-2xl font-bold text-foreground">{stats.todayCount}</p>
              <p className="text-sm text-muted-foreground">Today</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <p className="text-2xl font-bold text-foreground">{stats.thisWeekCount}</p>
              <p className="text-sm text-muted-foreground">This Week</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <p className="text-2xl font-bold text-foreground">{stats.thisMonthCount}</p>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-card rounded-2xl border border-border overflow-hidden hover-lift"
      >
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Recent Appointments</h3>
          <p className="text-muted-foreground mt-1">Latest appointments scheduled with your business</p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date & Time</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Client</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Service</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Reference ID</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivities.length > 0 ? (
                  stats.recentActivities.map((activity, index) => (
                    <motion.tr 
                      key={activity.id} 
                      className="border-b border-border last:border-0 hover:bg-muted/30"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <td className="py-4 text-sm text-foreground">{activity.dateTime}</td>
                      <td className="py-4 text-sm text-foreground">{activity.client}</td>
                      <td className="py-4 text-sm text-foreground">{activity.service}</td>
                      <td className="py-4 text-sm text-muted-foreground">{activity.referenceId}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-muted-foreground">
                      No recent appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;