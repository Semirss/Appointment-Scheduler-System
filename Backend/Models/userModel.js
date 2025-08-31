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

const addUserModel = async (data) => {
  const sql = `
    INSERT INTO users (name, email, phone, telegram_id, address)
    VALUES (?, ?, ?, ?, ?)
  `;
  await mySqlConnection.query(sql, [
    data.name,
    data.email,
    data.phone,
    data.telegram_id,
    data.address
  ]);
};



export {
  getAllUsersModel,
  getUserByIdModel,
  addUserModel
};