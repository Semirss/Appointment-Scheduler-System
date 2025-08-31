import mySqlConnection from "../Config/db.js";

const getRatingsModel = async ({ user_id, appointment_id }) => {
  let sql = `SELECT * FROM satisfaction_ratings WHERE 1=1`;
  const params = [];

  if (user_id) {
    sql += ` AND user_id = ?`;
    params.push(user_id);
  }

  if (appointment_id) {
    sql += ` AND appointment_id = ?`;
    params.push(appointment_id);
  }

  const [rows] = await mySqlConnection.query(sql, params);
  return rows;
};


const addRatingModel = async (data) => {
  const sql = `
    INSERT INTO satisfaction_ratings (user_id, appointment_id, rating, comments)
    VALUES (?, ?, ?, ?)
  `;
  await mySqlConnection.query(sql, [
    data.user_id,
    data.appointment_id || null,
    data.rating,
    data.comments || null
  ]);
};

export {
    getRatingsModel,
    addRatingModel
}
