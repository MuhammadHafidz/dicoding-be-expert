/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const pool = require('../src/Infrastructures/database/postgres/pool');
const JwtTokenManager = require('../src/Infrastructures/security/JwtTokenManager');
const bcrypt = require('bcrypt'); // Tambahkan ini jika belum

const UsersTableTestHelper = {
  async addUser({
    id = 'user-123',
    username = `user-${id}`,
    password = 'secret',
    fullname = 'Dicoding Indonesia',
  }) {

    const query = {
      text: `
        INSERT INTO users (id, username, password, fullname)
        VALUES($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING
      `,
      values: [id, username, password, fullname],
    };

    await pool.query(query);
  },

  async findUsersById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async getAccessToken({
    id = 'user-123',
    username,
    password = 'secret',
  } = {}) {
    // Buat username default berdasarkan ID jika tidak disediakan
    const finalUsername = username || `user-${id}`;

    // Tambahkan user jika belum ada
    await this.addUser({ id, username: finalUsername, password });

    // Generate token
    const jwtTokenManager = new JwtTokenManager(Jwt.token);
    return jwtTokenManager.createAccessToken({ id, username: finalUsername });
  },

  async cleanTable() {
    await pool.query('DELETE FROM users');
  },
};

module.exports = UsersTableTestHelper;
