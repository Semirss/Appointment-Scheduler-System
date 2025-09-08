// Header.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaBell, FaSearch, FaTimes, FaCalendarAlt, FaUser, FaCog, FaClock, FaFilter, FaSync } from 'react-icons/fa';
import { useCustomization } from '../context/CustomizationContext';
import axios from "axios";
import { useCompany } from '../context/CompanyContext';

const Header = ({ isCollapsed }) => {
    const { customization } = useCustomization();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { company } = useCompany();
    const companyId = company?.company_id;
    const lastCheckedRef = useRef(new Date());

    const fetchAppointments = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get(`https://test.dynamicrealestatemarketing.com/backend/api/appointments/appointees/${companyId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = response.data?.data || response.data || [];
            const updatedAppointments = data.map((appointment) => ({
                ...appointment,
                isNew: new Date(appointment.created_at || appointment.start_time) > lastCheckedRef.current,
            }));
            setAppointments(updatedAppointments);
            lastCheckedRef.current = new Date();
        } catch (err) {
            setError(err.message || "Something went wrong");
            console.error("Failed to fetch appointments:", err);
        } finally {
            setIsLoading(false);
        }
    }, [companyId]);

    useEffect(() => {
        if (companyId) {
            fetchAppointments();
            const intervalId = setInterval(fetchAppointments, 30000);
            return () => clearInterval(intervalId);
        }
    }, [fetchAppointments, companyId]);

    const headerStyle = {
        backgroundColor: customization?.header_bg || '#ffffff',
        color: customization?.header_text || '#000000',
        borderColor: customization?.theme_button || '#3b82f6'
    };

    const buttonStyle = {
        color: customization?.theme_button || '#3b82f6'
    };

    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        try {
            const date = new Date(dateTimeString);
            return isNaN(date) ? 'Invalid Date' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        try {
            const date = new Date(dateTimeString);
            return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        try {
            const date = new Date(dateTimeString);
            return isNaN(date) ? 'Invalid Date' : date.toLocaleString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const getStatusColor = (status) => {
        const lowerCaseStatus = status ? status.toLowerCase() : '';
        switch (lowerCaseStatus) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const markAsRead = (id) => {
        setAppointments(appointments.map(app =>
            (app.appointment_id || app._id) === id ? { ...app, isNew: false } : app
        ));
    };

    const markAllAsRead = () => {
        setAppointments(appointments.map(app => ({ ...app, isNew: false })));
    };

    const refreshAppointments = () => {
        fetchAppointments();
    };

    const filteredAppointments = filterStatus === 'All'
        ? appointments
        : appointments.filter(app => (app.status || '').toLowerCase() === filterStatus.toLowerCase());

    const newAppointmentsCount = appointments.filter(app => app.isNew).length;

    return (
        <>
            <header
                style={headerStyle}
                className={`fixed top-0 right-0 flex items-center p-2 sm:p-[0.66rem] bg-white border-b border-gray-200 shadow-sm z-40 transition-all duration-300
                left-0 md:${isCollapsed ? 'left-20' : 'left-64'}`}
            >
                <div className="flex relative flex-1 ml-0 md:ml-4 mr-2">
                    <div className="relative w-full">
                        <FaSearch className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search ..."
                            className="bg-gray-50 w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 md:p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                        <FaBell style={buttonStyle} className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
                        {newAppointmentsCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 md:h-5 md:w-5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 md:h-5 md:w-5 bg-red-500 text-xs text-white items-center justify-center font-medium">
                                    {newAppointmentsCount}
                                </span>
                            </span>
                        )}
                    </button>
                </div>
            </header>
            {showNotifications && (
                <div className="fixed inset-0 z-50 flex justify-end items-start pt-16 md:pt-20" onClick={() => setShowNotifications(false)}>
                    <div className="relative mx-2 md:mr-4 mt-2 w-full max-w-sm md:max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="absolute right-0 top-0 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-800">Appointment Notifications</h3>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={refreshAppointments}
                                        className="text-gray-500 hover:text-gray-700"
                                        title="Refresh appointments"
                                    >
                                        <FaSync className="h-4 w-4" />
                                    </button>
                                    {newAppointmentsCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowNotifications(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <FaTimes className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="max-h-64 md:max-h-96 overflow-y-auto">
                                {isLoading ? (
                                    <div className="p-4 text-center text-gray-500">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                        <p>Loading appointments...</p>
                                    </div>
                                ) : error ? (
                                    <div className="p-4 text-center text-red-500">
                                        <p>Error loading appointments</p>
                                        <button
                                            onClick={refreshAppointments}
                                            className="text-blue-500 hover:text-blue-700 text-sm mt-2"
                                        >
                                            Try again
                                        </button>
                                    </div>
                                ) : appointments.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                        No appointments scheduled
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {appointments.slice(0, 3).map((appointment, index) => (
                                            <div
                                                key={appointment.appointment_id || index}
                                                className={`p-4 hover:bg-gray-50 transition-colors duration-150 ${appointment.isNew ? 'bg-blue-50' : ''}`}
                                                onClick={() => markAsRead(appointment.appointment_id)}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center">
                                                        {appointment.isNew && (
                                                            <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                                                        )}
                                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                                                            {appointment.status || 'Unknown'}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {formatDate(appointment.start_time)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center mb-1">
                                                    <FaUser className="h-3 w-3 text-gray-500 mr-2" />
                                                    <span className="font-medium text-sm">{appointment.name || 'Unknown Client'}</span>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    <FaCog className="h-3 w-3 text-gray-500 mr-2" />
                                                    <span className="text-sm text-gray-700">{appointment.service_name || 'Unknown Service'}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <FaClock className="h-3 w-3 text-gray-500 mr-2" />
                                                    <span className="text-sm text-gray-700">
                                                        {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                                                    </span>
                                                </div>
                                                {appointment.created_at && (
                                                    <div className="mt-2 md:mt-3 text-xs text-gray-400">
                                                        Created: {formatDateTime(appointment.created_at)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        setShowNotifications(false);
                                        setShowAppointmentsModal(true);
                                    }}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center w-full"
                                >
                                    View all appointments
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showAppointmentsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 md:p-4" onClick={() => setShowAppointmentsModal(false)}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">All Appointments</h2>
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={refreshAppointments}
                                        className="text-gray-500 hover:text-gray-700"
                                        title="Refresh appointments"
                                    >
                                        <FaSync className="h-4 w-4" />
                                    </button>
                                    <FaFilter className="text-gray-500 hidden sm:block" />
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="All">All Statuses</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <button
                                    onClick={() => setShowAppointmentsModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                            {isLoading ? (
                                <div className="p-4 md:p-8 text-center text-gray-500">
                                    <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-500 mx-auto mb-2 md:mb-4"></div>
                                    <p className="text-base md:text-lg">Loading appointments...</p>
                                </div>
                            ) : error ? (
                                <div className="p-4 md:p-8 text-center text-red-500">
                                    <FaTimes className="h-8 w-8 md:h-12 md:w-12 mx-auto text-red-300 mb-2 md:mb-4" />
                                    <p className="text-base md:text-lg">Error loading appointments</p>
                                    <p className="text-xs md:text-sm mb-2 md:mb-4">{error}</p>
                                    <button
                                        onClick={refreshAppointments}
                                        className="px-3 py-1 md:px-4 md:py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm md:text-base"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : filteredAppointments.length === 0 ? (
                                <div className="p-4 md:p-8 text-center text-gray-500">
                                    <FaCalendarAlt className="h-8 w-8 md:h-12 md:w-12 mx-auto text-gray-300 mb-2 md:mb-4" />
                                    <p className="text-base md:text-lg">No appointments found</p>
                                    <p className="text-xs md:text-sm">Try changing your filter settings</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {filteredAppointments.map((appointment, index) => (
                                        <div
                                            key={appointment.appointment_id || index}
                                            className={`p-4 md:p-6 hover:bg-gray-50 transition-colors duration-150 ${appointment.isNew ? 'bg-blue-50' : ''}`}
                                            onClick={() => markAsRead(appointment.appointment_id)}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center">
                                                    {appointment.isNew && (
                                                        <span className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-blue-500 mr-2 md:mr-3"></span>
                                                    )}
                                                    <span className={`text-xs md:text-sm px-2 py-1 md:px-3 md:py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                                                        {appointment.status || 'Unknown'}
                                                    </span>
                                                </div>
                                                <span className="text-xs md:text-sm text-gray-500">
                                                    {formatDate(appointment.start_time)}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                                <div className="flex items-center">
                                                    <FaUser className="h-3 w-3 md:h-4 md:w-4 text-gray-500 mr-2 md:mr-3" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Client</p>
                                                        <p className="font-medium text-sm md:text-base">{appointment.name || 'Unknown Client'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <FaCog className="h-3 w-3 md:h-4 md:w-4 text-gray-500 mr-2 md:mr-3" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Service</p>
                                                        <p className="font-medium text-sm md:text-base">{appointment.service_name || 'Unknown Service'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <FaClock className="h-3 w-3 md:h-4 md:w-4 text-gray-500 mr-2 md:mr-3" />
                                                    <div>
                                                        <p className="text-xs text-gray-500">Time</p>
                                                        <p className="font-medium text-sm md:text-base">
                                                            {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            {appointment.created_at && (
                                                <div className="mt-2 md:mt-3 text-xs text-gray-400">
                                                    Created: {formatDateTime(appointment.created_at)}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                            <p className="text-xs md:text-sm text-gray-500">
                                Showing {filteredAppointments.length} of {appointments.length} appointments
                            </p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={markAllAsRead}
                                    className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Mark All as Read
                                </button>
                                <button
                                    onClick={() => setShowAppointmentsModal(false)}
                                    className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;