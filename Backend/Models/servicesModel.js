import mySqlConnection from "../Config/db.js";

const getServicesModel = async () => {
  const sql = `SELECT * FROM company_services`;
  const [result] = await mySqlConnection.query(sql);
  return result;
};

const getServicesByCompanyModel = async (companyId) => {
  const sql = `SELECT * FROM company_services WHERE company_id = ?`;
  const [result] = await mySqlConnection.query(sql, [companyId]);
  return result;
};

const addServiceModel = async (data) => {
  const sql = `INSERT INTO company_services (company_id, name, description, price, duration_time, discount) VALUES (?, ?, ?, ?, ?, ?)`;
  await mySqlConnection.query(sql, [data.company_id, data.name, data.description, data.price, data.duration_time, data.discount]);
};

const updateServiceModel = async (id, data) => {
  const sql = `UPDATE company_services SET name = ?, description = ?, price = ?, duration_time = ?, discount = ? WHERE service_id = ?`;
  await mySqlConnection.query(sql, [data.name, data.description, data.price, data.duration_time, data.discount, id]);
};

const updateServiceByCompanyModel = async (serviceId, companyId, data) => {
  const sql = `
    UPDATE company_services
    SET name = ?, description = ?, price = ?, duration_time = ?, discount = ?
    WHERE service_id = ? AND company_id = ?
  `;
  const [result] = await mySqlConnection.query(sql, [
    data.name,
    data.description,
    data.price,
    data.duration_time,
    data.discount,
    serviceId,
    companyId
  ]);
  return result.affectedRows; // returns 1 if update was successful
};


const deleteServiceModel = async (id) => {
  const sql = `DELETE FROM company_services WHERE service_id = ?`;
  await mySqlConnection.query(sql, [id]);
};

export {
  getServicesModel,
  getServicesByCompanyModel,
  addServiceModel,
  updateServiceModel,
  updateServiceByCompanyModel,
  deleteServiceModel
};