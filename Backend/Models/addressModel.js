import mySqlConnection from "../Config/db.js";

const getAddressesModel = async () => {
  const sql = `SELECT * FROM company_addresses`;
  const [result] = await mySqlConnection.query(sql);
  return result;
};

const getAddressesByCompanyModel = async (companyId) => {
  const sql = `SELECT * FROM company_addresses WHERE company_id = ?`;
  const [result] = await mySqlConnection.query(sql, [companyId]);
  return result;
};

const addAddressModel = async (data) => {
  const sql = `INSERT INTO company_addresses (company_id, branch_name, location) VALUES (?, ?, ?)`;
  await mySqlConnection.query(sql, [data.company_id, data.branch_name, data.location]);
};

const updateAddressModel = async (id, data) => {
  const sql = `UPDATE company_addresses SET branch_name = ?, location = ? WHERE address_id = ?`;
  await mySqlConnection.query(sql, [data.branch_name, data.location, id]);
};

const deleteAddressModel = async (id) => {
  const sql = `DELETE FROM company_addresses WHERE address_id = ?`;
  await mySqlConnection.query(sql, [id]);
};

export {
  getAddressesModel,
  getAddressesByCompanyModel,
  addAddressModel,
  updateAddressModel,
  deleteAddressModel
};