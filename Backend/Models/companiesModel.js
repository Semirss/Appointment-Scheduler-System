import mySqlConnection from "../Config/db.js";

const findCompanyByEmail = async (email) => {
  const sql = `SELECT * FROM companies WHERE email = ?`;
  const [rows] = await mySqlConnection.query(sql, [email]);
  return rows[0]; // Return the first match or undefined
};

const getCompaniesModel = async () => {
  const sql = `SELECT * FROM companies`;
  const [result] = await mySqlConnection.query(sql);
  return result;
};

const addCompanyModel = async (data) => {
  const sql = `
    INSERT INTO companies (name, email, phone, category, password)
    VALUES (?, ?, ?, ?, ?)
  `;
  await mySqlConnection.query(sql, [
    data.name,
    data.email,
    data.phone,
    data.category,
    data.password
  ]);
};

const updateCompanyModel = async (id, data) => {
  let sql, params;

  if (data.password) {
    sql = `
      UPDATE companies
      SET name = ?, email = ?, phone = ?, category = ?, password = ?
      WHERE company_id = ?
    `;
    params = [data.name, data.email, data.phone, data.category, data.password, id];
  } else {
    sql = `
      UPDATE companies
      SET name = ?, email = ?, phone = ?, category = ?
      WHERE company_id = ?
    `;
    params = [data.name, data.email, data.phone, data.category, id];
  }

  await mySqlConnection.query(sql, params);
};

const deleteCompanyModel = async (id) => {
  const sql = `DELETE FROM companies WHERE company_id = ?`;
  await mySqlConnection.query(sql, [id]);
};


export {
  getCompaniesModel,
  findCompanyByEmail,
  addCompanyModel,
  updateCompanyModel,
  deleteCompanyModel
};