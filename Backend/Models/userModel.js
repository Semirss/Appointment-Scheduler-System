import mySqlConnection from "../Config/db.js";

// Get all users
const getAllUsersModel = async () => {
  const sql = `SELECT * FROM users`;
  const [result] = await mySqlConnection.query(sql);
  return result;
};

// Get user by ID
const getUserByIdModel = async (id) => {
  const sql = `SELECT * FROM users WHERE user_id = ?`;
  const [result] = await mySqlConnection.query(sql, [id]);
  return result[0]; // Return single user object
};
const getUserByEmailModel = async (email) => {
  const sql = `SELECT user_id, name, email, phone, telegram_id, created_at FROM users WHERE email = ?`;
  const [result] = await mySqlConnection.query(sql, [email]);
  return result[0];
};
const findOrCreateUserById = async ({ client_id, name, email, phone, telegram_id, address }) => {
  const lookupSql = `SELECT user_id FROM users WHERE user_id = ? OR phone = ? LIMIT 1`;
  const [rows] = await mySqlConnection.query(lookupSql, [client_id, phone]);

  if (rows.length > 0) {
    return rows[0].user_id; // User exists
  }

  const insertSql = `
    INSERT INTO users (user_id, name, email, phone, telegram_id, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await mySqlConnection.query(insertSql, [
    client_id,
    name,
    email,
    phone,
    telegram_id,
    address
  ]);

  return client_id; // Return the same ID after creation
};
const getUserByPhoneModel = async (phone) => {
  const sql = `SELECT user_id, name, email, phone, telegram_id, created_at FROM users WHERE phone = ?`;
  const [result] = await mySqlConnection.query(sql, [phone]);
  return result[0];
};
const addUserModel = async (data) => {
  const sql = `
    INSERT INTO users (name, email, phone, telegram_id, address)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await mySqlConnection.query(sql, [
    data.name,
    data.email,
    data.phone || null,
    data.telegram_id || null,
    data.address || null
  ]);
  return result;
};

export {
  getAllUsersModel,
  getUserByEmailModel,
  getUserByPhoneModel, 
  getUserByIdModel,
  findOrCreateUserById,
  addUserModel
};