const pool = require("../utils/db");

class UserOrganisation {
  static async create(userId, orgId) {
    const query = `
      INSERT INTO user_organisation (userId, orgId)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, orgId]);
    return result.rows[0];
  }
  static async findByUserId(userId) {
    const query = `
      SELECT * FROM user_organisations
      WHERE userId = $1;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findByOrgId(orgId) {
    const query = `
      SELECT * FROM user_organisations
      WHERE orgId = $1;
    `;
    const result = await pool.query(query, [orgId]);
    return result.rows;
  }
  static async delete(userId, orgId) {
    const query = `
      DELETE FROM user_organisation
      WHERE userId = $1 AND orgId = $2
    `;
    await pool.query(query, [userId, orgId]);
  }
}

module.exports = UserOrganisation;
