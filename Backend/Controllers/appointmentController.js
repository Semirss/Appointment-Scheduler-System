import { getAddressId } from "../Models/addressModel.js";
import {
  getAppointmentsModel,
  addAppointmentModel,
  updateAppointmentModel,
  deleteAppointmentModel,
  getAppointeesByCompany,
  getAppointeesByServiceInCompany,
  countAppointeesByCompany,
  countAppointeesByServiceInCompany
} from "../Models/appointmentModel.js";
import mySqlConnection from "../Config/db.js";
import { findOrCreateUserById } from "../Models/userModel.js";

export const getAppointments = async (req, res) => {
  try {
    const appointments = await getAppointmentsModel();
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch appointments" });
  }
};

export const fetchAppointeesByCompany = async (req, res) => {
  const { companyId } = req.params;
  try {
    const appointees = await getAppointeesByCompany(companyId);
    res.status(200).json({ success: true, data: appointees });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch appointees" });
  }
};

export const fetchAppointeesByServiceInCompany = async (req, res) => {
  const { companyId, serviceId } = req.params;
  try {
    const appointees = await getAppointeesByServiceInCompany(companyId, serviceId);
    res.status(200).json({ success: true, data: appointees });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch appointees by service" });
  }
};

export const getAppointeeCountByCompany = async (req, res) => {
  const { companyId } = req.params;
  try {
    const count = await countAppointeesByCompany(companyId);
    res.status(200).json({ success: true, data: count });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch appointee count" });
  }
};

export const getAppointeeCountByService = async (req, res) => {
  const { companyId } = req.params;
  try {
    const counts = await countAppointeesByServiceInCompany(companyId);
    res.status(200).json({ success: true, data: counts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch appointee counts by service" });
  }
};

export const addAppointment = async (req, res) => {
  try {
    await addAppointmentModel(req.body);
    res.status(201).json({ success: true, message: "Appointment added" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add appointment" });
  }
};

export const createAppointment = async (req, res) => {
  const {
    company_id,
    client_id,
    service_id,
    start_time,
    end_time,
    status,
    branch_name,
    location,
    name,
    email,
    phone,
    telegram_id,
    address
  } = req.body;

  try {
    const address_id = await getAddressId(company_id, branch_name, location);

    const resolvedClientId = await findOrCreateUserById({
      client_id,
      name,
      email,
      phone,
      telegram_id,
      address
    });

    const sql = `
      INSERT INTO appointments (company_id, client_id, service_id, start_time, end_time, status, address_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await mySqlConnection.query(sql, [
      company_id,
      resolvedClientId,
      service_id,
      start_time,
      end_time,
      status,
      address_id
    ]);

    res.status(201).json({ success: true, message: "Appointment created successfully" });
  } catch (error) {
    console.error("Appointment creation error:", error);
    res.status(500).json({ success: false, message: "Failed to create appointment" });
  }
};


export const updateAppointment = async (req, res) => {
  try {
    await updateAppointmentModel(req.params.id, req.body);
    res.json({ success: true, message: "Appointment updated" });
  } catch (error) {
    // This is the key change: log the specific error from the database
    console.error("Error in updateAppointment:", error);
    res.status(500).json({ success: false, message: "Failed to update appointment", error: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    await deleteAppointmentModel(req.params.id);
    res.json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete appointment" });
  }
};
