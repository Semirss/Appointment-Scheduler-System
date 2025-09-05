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

export const getCompanyBySubdomainModel = async (subdomain) => {
  const sql = `SELECT company_id, name, subdomain, email, category FROM companies WHERE subdomain = ? LIMIT 1`;
  const [rows] = await mySqlConnection.query(sql, [subdomain]);
  return rows[0]; // return single company or undefined
};


const addCompanyModel = async (data) => {
  const sql = `
    INSERT INTO companies (name, email, phone, category, password, subdomain, tin_number)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  await mySqlConnection.query(sql, [
    data.name,
    data.email,
    data.phone,
    data.category,
    data.password,
    data.subdomain,
    data.tin_number || null // Handle cases where tin_number might be undefined
  ]);
};

const updateCompanyModel = async (id, data) => {
  let sql, params;

  if (data.password) {
    sql = `
      UPDATE companies
      SET name = ?, email = ?, phone = ?, category = ?, password = ?, subdomain = ?
      WHERE company_id = ?
    `;
    params = [data.name, data.email, data.phone, data.category, data.password, data.subdomain, id];
  } else {
    sql = `
      UPDATE companies
      SET name = ?, email = ?, phone = ?, category = ?, subdomain = ?
      WHERE company_id = ?
    `;
    params = [data.name, data.email, data.phone, data.category, data.subdomain, id];
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