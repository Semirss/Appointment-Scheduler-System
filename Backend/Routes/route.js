import express from 'express';
import { addCompany, deleteCompany, getCompanies, loginCompany, updateCompany } from '../Controllers/companiesController.js';
import { addService, deleteService, getCompanyServices, getServices, updateService, updateServiceByCompany } from '../Controllers/servicesController.js';
import { addAppointment, createAppointment, deleteAppointment, fetchAppointeesByCompany, fetchAppointeesByServiceInCompany, getAppointeeCountByCompany, getAppointeeCountByService, getAppointments, updateAppointment } from '../Controllers/appointmentController.js';
import { addAddress, deleteAddress, getAddresses, getCompanyAddresses, updateAddress } from '../Controllers/addressController.js';
import { addSchedule, deleteSchedule, fetchCompanySchedule, getSchedules, updateSchedule } from '../Controllers/scheduleController.js';
import { addTransaction, deleteTransaction, fetchTransactionById, fetchTransactionsByCompany, getTransactions, updateTransaction } from '../Controllers/transactionsController.js';
import { addCustomization, deleteCustomization, getCustomizationByCompanyId, getCustomizations, updateCustomization } from '../Controllers/customizeController.js';
import { loginAdmin, addAdmin } from '../Controllers/adminController.js';
import { addUser, getUser, getUsers,getUserByEmail } from '../Controllers/userController.js';
import { addRating, getRatings } from '../Controllers/ratingController.js';

const router = express.Router();

// Admin login
router.post("/adminLogin", loginAdmin);
router.post("/adminRegister", addAdmin);

// router.get("/companies", verifyAdminToken, getCompanies);
// router.post("/companies", verifyAdminToken, addCompany);
// router.put("/companies/:id", verifyAdminToken, updateCompany);
// router.delete("/companies/:id", verifyAdminToken, deleteCompany);

router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.post("/users", addUser);
router.get("/users/email/:email", getUserByEmail);

// Companies
router.post("/companyLogin", loginCompany);
router.get("/companies", getCompanies);
router.post("/companies", addCompany);
router.put("/companies/:id", updateCompany);
router.delete("/companies/:id", deleteCompany);

// Services
router.get("/services", getServices);
router.get("/services/:companyId", getCompanyServices);
router.post("/services", addService);
router.put("/services/:id", updateService);
router.put("/services/:companyId/:serviceId", updateServiceByCompany);
router.delete("/services/:id", deleteService);

// Appointments
router.get("/appointments", getAppointments);
router.get("/appointments/appointees/:companyId", fetchAppointeesByCompany);
router.get("/appointments/appointees/:companyId/:serviceId", fetchAppointeesByServiceInCompany);
router.get("/appointments/countByCompany/:companyId", getAppointeeCountByCompany);
router.get("/appointments/countByService/:companyId", getAppointeeCountByService);
router.post("/appointments/createAppointment", createAppointment);
router.post("/appointments", addAppointment);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);

// Addresses
router.get("/addresses", getAddresses);
router.get("/addresses/:companyId", getCompanyAddresses);
router.post("/addresses", addAddress);
router.put("/addresses/:id", updateAddress);
router.delete("/addresses/:id", deleteAddress);

// Schedules
router.get("/schedules", getSchedules);
router.get("/schedules/:scheduleCompanyId", fetchCompanySchedule);
router.post("/schedules", addSchedule);
router.put("/schedules/:id", updateSchedule);
router.delete("/schedules/:id", deleteSchedule);

// Transactions
router.get("/transactions", getTransactions);
router.get("/transactions/company/:companyId", fetchTransactionsByCompany);
router.get("/transactions/:transactionId", fetchTransactionById);
router.post("/transactions", addTransaction);
router.put("/transactions/:id", updateTransaction);
router.delete("/transactions/:id", deleteTransaction);

// Customize
router.get("/customizations", getCustomizations);
router.get('/customizations/:companyId', getCustomizationByCompanyId);
router.post("/customizations", addCustomization);
router.put("/customizations/:companyId", updateCustomization);
router.delete("/customizations/:id", deleteCustomization);

// Rating
router.post("/ratings", addRating);
router.get("/ratings", getRatings);


export default router;