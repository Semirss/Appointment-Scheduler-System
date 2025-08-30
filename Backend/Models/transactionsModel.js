import mySqlConnection from "../Config/db.js";

const getTransactionsModel = async () => {
  const sql = `SELECT * FROM appointment_transactions`;
  const [result] = await mySqlConnection.query(sql);
  return result;
};

// Get all transactions for a specific company
const getTransactionsByCompany = async (companyId) => {
  const sql = `
    SELECT 
      t.transaction_id,
      t.transaction_img,
      t.created_at AS transaction_created,
      a.appointment_id,
      a.start_time,
      a.end_time,
      a.status,
      u.user_id,
      u.name,
      u.email,
      cs.service_id,
      cs.name,
      c.company_id,
      c.name
    FROM appointment_transactions t
    JOIN appointments a ON t.appointment_id = a.appointment_id
    JOIN users u ON a.client_id = u.user_id
    JOIN company_services cs ON a.service_id = cs.service_id
    JOIN companies c ON a.company_id = c.company_id
    WHERE c.company_id = ?
    ORDER BY t.created_at DESC
  `;
  const [result] = await mySqlConnection.query(sql, [companyId]);
  return result;
};

// Get a specific transaction by ID
const getTransactionById = async (transactionId) => {
  const sql = `
    SELECT 
      t.transaction_id,
      t.transaction_img,
      t.created_at AS transaction_created,
      a.appointment_id,
      a.start_time,
      a.end_time,
      a.status,
      u.user_id,
      u.name,
      u.email,
      cs.service_id,
      cs.name,
      c.company_id,
      c.name
    FROM appointment_transactions t
    JOIN appointments a ON t.appointment_id = a.appointment_id
    JOIN users u ON a.client_id = u.user_id
    JOIN company_services cs ON a.service_id = cs.service_id
    JOIN companies c ON a.company_id = c.company_id
    WHERE t.transaction_id = ?
  `;
  const [result] = await mySqlConnection.query(sql, [transactionId]);
  return result[0];
};

const addTransactionModel = async (data) => {
  const sql = `INSERT INTO appointment_transactions (appointment_id, transaction_img) VALUES (?, ?)`;
  await mySqlConnection.query(sql, [data.appointment_id, data.transaction_img]);
};

const updateTransactionModel = async (id, data) => {
  const sql = `UPDATE appointment_transactions SET transaction_img = ? WHERE transaction_id = ?`;
  await mySqlConnection.query(sql, [data.transaction_img, id]);
};

const deleteTransactionModel = async (id) => {
  const sql = `DELETE FROM appointment_transactions WHERE transaction_id = ?`;
  await mySqlConnection.query(sql, [id]);
};

export {
  getTransactionsModel,
  getTransactionsByCompany,
  getTransactionById,
  addTransactionModel,
  updateTransactionModel,
  deleteTransactionModel
};