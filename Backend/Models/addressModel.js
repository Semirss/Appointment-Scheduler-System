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

const getAddressId = async (company_id, branch_name, location) => {
  try {
    const sql = `
      SELECT address_id FROM company_addresses
      WHERE company_id = ? AND branch_name = ? AND location = ?
      LIMIT 1
    `;
    
    console.log("Querying for address with:", { company_id, branch_name, location });
    
    const [rows] = await mySqlConnection.query(sql, [company_id, branch_name, location]);
    
    console.log("Query result:", rows);
    
    if (rows.length > 0) {
      return rows[0].address_id;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting address ID:", error);
    return null;
  }
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
  getAddressId,
  getAddressesByCompanyModel,
  addAddressModel,
  updateAddressModel,
  deleteAddressModel
};