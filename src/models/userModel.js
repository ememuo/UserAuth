const pool = require("../utils/db");

class User {
  static async create(userData) {
    const { firstName, lastName, email, password, phone } = userData;
    const query = `
      INSERT INTO users (firstName, lastName, email, password, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [firstName, lastName, email, password, phone];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(userId) {
    const query = "SELECT * FROM users WHERE userId = $1";
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = User;
