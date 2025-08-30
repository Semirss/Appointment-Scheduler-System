import mySqlConnection from "../Config/db.js";

const getAppointmentsModel = async () => {
  const sql = `SELECT * FROM appointments`;
  const [result] = await mySqlConnection.query(sql);
  return result;
};

// Get all appointees for a specific company (across all services)
const getAppointeesByCompany = async (companyId) => {
  const sql = `
    SELECT u.user_id, u.name, u.email, u.phone, u.telegram_id, a.appointment_id, a.start_time, a.end_time, a.status
    FROM users u
    JOIN appointments a ON u.user_id = a.client_id
    WHERE a.company_id = ?
    ORDER BY a.start_time DESC
  `;
  const [result] = await mySqlConnection.query(sql, [companyId]);
  return result;
};

// Get appointees for a specific company and specific service
const getAppointeesByServiceInCompany = async (companyId, serviceId) => {
  const sql = `
    SELECT u.user_id, u.name, u.email, u.phone, u.telegram_id, a.appointment_id, a.start_time, a.end_time, a.status
    FROM users u
    JOIN appointments a ON u.user_id = a.client_id
    WHERE a.company_id = ? AND a.service_id = ?
    ORDER BY a.start_time DESC
  `;
  const [result] = await mySqlConnection.query(sql, [companyId, serviceId]);
  return result;
};

// Count of unique appointees for a specific company (across all services)
const countAppointeesByCompany = async (companyId) => {
  const sql = `
    SELECT COUNT(DISTINCT client_id) AS total_appointees
    FROM appointments
    WHERE company_id = ?
  `;
  const [result] = await mySqlConnection.query(sql, [companyId]);
  return result[0];
};

// Count of unique appointees for each service within a specific company
const countAppointeesByServiceInCompany = async (companyId) => {
  const sql = `
    SELECT service_id, COUNT(DISTINCT client_id) AS appointee_count
    FROM appointments
    WHERE company_id = ?
    GROUP BY service_id
  `;
  const [result] = await mySqlConnection.query(sql, [companyId]);
  return result;
};


const addAppointmentModel = async (data) => {
  const sql = `INSERT INTO appointments (company_id, client_id, service_id, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?)`;
  await mySqlConnection.query(sql, [data.company_id, data.client_id, data.service_id, data.start_time, data.end_time, data.status]);
};

const updateAppointmentModel = async (id, data) => {
  const sql = `UPDATE appointments SET company_id = ?, client_id = ?, service_id = ?, start_time = ?, end_time = ?, status = ? WHERE appointment_id = ?`;
  await mySqlConnection.query(sql, [data.company_id, data.client_id, data.service_id, data.start_time, data.end_time, data.status, id]);
};

const deleteAppointmentModel = async (id) => {
  const sql = `DELETE FROM appointments WHERE appointment_id = ?`;
  await mySqlConnection.query(sql, [id]);
};

export {
  getAppointmentsModel,
  getAppointeesByCompany,
  getAppointeesByServiceInCompany,
  countAppointeesByCompany,
  countAppointeesByServiceInCompany,
  addAppointmentModel,
  updateAppointmentModel,
  deleteAppointmentModel
};
