import mySqlConnection from "../Config/db.js";

const findAdminByEmail = async (email) => {
  const [rows] = await mySqlConnection.query("SELECT * FROM admins WHERE email = ?", [email]);
  // Return the first Admin found, or null if none
  return rows[0]; 
};

const createAdmin = async (adminData) => {
  const { email, password } = adminData;
  
  // Insert new admin into database
  const [result] = await mySqlConnection.query(
    "INSERT INTO admins (email, password) VALUES (?, ?)",
    [email, password]
  );
  
  // Get the newly created admin
  const [newAdminRows] = await mySqlConnection.query(
    "SELECT admin_id, email FROM admins WHERE admin_id = ?",
    [result.insertId]
  );
  
  // Return the newly created admin
  return newAdminRows[0];
};

export {
  findAdminByEmail,
  createAdmin
};