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

const getCompanyByID = async (id) => {
  const sql = `SELECT company_id, name, domain, email, category FROM companies WHERE company_id = ? LIMIT 1`;
  const [rows] = await mySqlConnection.query(sql, [id]);
  return rows[0]; // return single company or undefined
};

const getCompanyByDomainModel = async (domain) => {
  const sql = `SELECT company_id, name, domain, email, category FROM companies WHERE domain = ? LIMIT 1`;
  const [rows] = await mySqlConnection.query(sql, [domain]);
  return rows[0]; // return single company or undefined
};


const addCompanyModel = async (data) => {
  const sql = `
    INSERT INTO companies (name, email, phone, category, password, domain, tin_number)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  await mySqlConnection.query(sql, [
    data.name,
    data.email,
    data.phone,
    data.category,
    data.password,
    data.domain,
    data.tin_number || null // Handle cases where tin_number might be undefined
  ]);
};

const updateCompanyModel = async (id, data) => {
  let sql, params;

  if (data.password) {
    sql = `
      UPDATE companies
      SET name = ?, email = ?, phone = ?, category = ?, password = ?, domain = ?
      WHERE company_id = ?
    `;
    params = [data.name, data.email, data.phone, data.category, data.password, data.domain, id];
  } else {
    sql = `
      UPDATE companies
      SET name = ?, email = ?, phone = ?, category = ?, domain = ?
      WHERE company_id = ?
    `;
    params = [data.name, data.email, data.phone, data.category, data.domain, id];
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
  getCompanyByDomainModel,
  getCompanyByID,
  addCompanyModel,
  updateCompanyModel,
  deleteCompanyModel
};