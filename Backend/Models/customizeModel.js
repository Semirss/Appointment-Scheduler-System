import mySqlConnection from "../Config/db.js";

const getCustomizationsModel = async () => {
  const sql = `SELECT * FROM company_customization`;
  const [result] = await mySqlConnection.query(sql);
  return result;
};

const getCustomizationByCompanyIdModel = async (companyId) => {
  const sql = `SELECT * FROM company_customization WHERE company_id = ?`;
  const [result] = await mySqlConnection.query(sql, [companyId]);
  return result.length > 0 ? result[0] : null;
};

const addCustomizationModel = async (data) => {
  const sql = `
    INSERT INTO company_customization 
    (company_id, bg_color, text_color, btn_color, card_color, sidebar_bg_color, sidebar_text_color, header_bg_color, header_text_color, logo_url, banner_image, font_family, font_size_base, font_heading)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await mySqlConnection.query(sql, [
    data.company_id,
    data.bg_color,
    data.text_color,
    data.btn_color,
    data.card_color,
    data.sidebar_bg_color,
    data.sidebar_text_color,
    data.header_bg_color,
    data.header_text_color,
    data.logo_url,
    data.banner_image,
    data.font_family,
    data.font_size_base,
    data.font_heading
  ]);
};

const updateCustomizationModel = async (companyId, data) => {
  // First check if customization exists for this company
  const existing = await getCustomizationByCompanyIdModel(companyId);
  
  if (existing) {
    // Update existing record
    const sql = `
      UPDATE company_customization
      SET bg_color = ?, text_color = ?, btn_color = ?, card_color = ?,
          sidebar_bg_color = ?, sidebar_text_color = ?,
          header_bg_color = ?, header_text_color = ?,
          logo_url = ?, banner_image = ?, font_family = ?, font_size_base = ?, font_heading = ?
      WHERE company_id = ?
    `;
    await mySqlConnection.query(sql, [
      data.bg_color,
      data.text_color,
      data.btn_color,
      data.card_color,
      data.sidebar_bg_color,
      data.sidebar_text_color,
      data.header_bg_color,
      data.header_text_color,
      data.logo_url,
      data.banner_image,
      data.font_family,
      data.font_size_base,
      data.font_heading,
      companyId
    ]);
  } else {
    // Insert new record
    await addCustomizationModel({
      company_id: companyId,
      bg_color: data.bg_color,
      text_color: data.text_color,
      btn_color: data.btn_color,
      card_color: data.card_color,
      sidebar_bg_color: data.sidebar_bg_color,
      sidebar_text_color: data.sidebar_text_color,
      header_bg_color: data.header_bg_color,
      header_text_color: data.header_text_color,
      logo_url: data.logo_url,
      banner_image: data.banner_image,
      font_family: data.font_family,
      font_size_base: data.font_size_base,
      font_heading: data.font_heading,
    });
  }
};

const deleteCustomizationModel = async (id) => {
  const sql = `DELETE FROM company_customization WHERE customization_id = ?`;
  await mySqlConnection.query(sql, [id]);
};

const requestUnlockModel = async (company_id) => {
  const sql = `UPDATE company_customization SET status = 'unlock_requested' WHERE company_id = ?`;
  await mySqlConnection.query(sql, [company_id]);
};

const unlockCustomizationModel = async (company_id) => {
  const sql = `UPDATE company_customization SET status = 'unlocked' WHERE company_id = ?`;
  await mySqlConnection.query(sql, [company_id]);
};

const lockCustomizationModel = async (company_id) => {
  const sql = `UPDATE company_customization SET status = 'locked' WHERE company_id = ?`;
  await mySqlConnection.query(sql, [company_id]);
};

export {
  getCustomizationsModel,
  getCustomizationByCompanyIdModel,
  addCustomizationModel,
  updateCustomizationModel,
  deleteCustomizationModel,
  requestUnlockModel,
  unlockCustomizationModel,
  lockCustomizationModel
};