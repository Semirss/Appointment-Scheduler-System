import mySqlConnection from "../Config/db.js";

const getCustomizationsModel = async () => {
  const sql = `SELECT * FROM company_customization`;
  const [result] = await mySqlConnection.query(sql);
  return result;
};

const addCustomizationModel = async (data) => {
  const sql = `
    INSERT INTO company_customization (company_id, theme_color, logo_url, banner_image, description)
    VALUES (?, ?, ?, ?, ?)
  `;
  await mySqlConnection.query(sql, [
    data.company_id,
    data.theme_color,
    data.logo_url,
    data.banner_image,
    data.description
  ]);
};

const updateCustomizationModel = async (id, data) => {
  const sql = `
    UPDATE company_customization
    SET theme_color = ?, logo_url = ?, banner_image = ?, description = ?
    WHERE customization_id = ?
  `;
  await mySqlConnection.query(sql, [
    data.theme_color,
    data.logo_url,
    data.banner_image,
    data.description,
    id
  ]);
};

const deleteCustomizationModel = async (id) => {
  const sql = `DELETE FROM company_customization WHERE customization_id = ?`;
  await mySqlConnection.query(sql, [id]);
};


export {
  getCustomizationsModel,
  addCustomizationModel,
  updateCustomizationModel,
  deleteCustomizationModel
};