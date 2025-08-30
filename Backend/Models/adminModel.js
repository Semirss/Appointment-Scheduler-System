import mySqlConnection from "../Config/db.js";

const findAdminByEmail = async (email) => {
  const [rows] = await mySqlConnection.query("SELECT * FROM admins WHERE email = ?", [email]);
  // Return the first Admin found, or null if none
  return rows[0]; 
};

export {
  findAdminByEmail,
}