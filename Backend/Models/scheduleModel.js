import mySqlConnection from "../Config/db.js";

const getSchedulesModel = async () => {
  const sql = `SELECT * FROM company_schedules`;
  const [result] = await mySqlConnection.query(sql);
  return result;
};

const getCompanySchedule = async (companyId) => {
  const sql = `
    SELECT schedule_id, company_id, overtime, available_time
    FROM company_schedules
    WHERE company_id = ?
  `;
  const [result] = await mySqlConnection.query(sql, [companyId]);
  return result[0];
};


const addScheduleModel = async (data) => {
  const sql = `INSERT INTO company_schedules (company_id, overtime, available_time) VALUES (?, ?, ?)`;
  await mySqlConnection.query(sql, [data.company_id, data.overtime, data.available_time]);
};

const updateScheduleModel = async (id, data) => {
  const sql = `UPDATE company_schedules SET overtime = ?, available_time = ? WHERE schedule_id = ?`;
  await mySqlConnection.query(sql, [data.overtime, data.available_time, id]);
};

const deleteScheduleModel = async (id) => {
  const sql = `DELETE FROM company_schedules WHERE schedule_id = ?`;
  await mySqlConnection.query(sql, [id]);
};


export {
  getSchedulesModel,
  getCompanySchedule,
  addScheduleModel,
  updateScheduleModel,
  deleteScheduleModel
};