const pool = require("../utils/db");

class Organisation {
  static async create(orgData) {
    const { name, description } = orgData;
    const query = `
      INSERT INTO organisations (name, description)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [name, description];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(orgId) {
    const query = "SELECT * FROM organisations WHERE orgId = $1";
    const result = await pool.query(query, [orgId]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT o.*
      FROM organisations o
      INNER JOIN user_organisation uo ON o.orgId = uo.orgId
      WHERE uo.userId = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = Organisation;
