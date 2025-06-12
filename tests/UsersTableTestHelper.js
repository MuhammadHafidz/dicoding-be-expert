/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const pool = require('../src/Infrastructures/database/postgres/pool');
const JwtTokenManager = require('../src/Infrastructures/security/JwtTokenManager');

const UsersTableTestHelper = {
  async addUser({
    id = 'user-123', username = `user-${Math.random()}`, password = 'secret', fullname = 'Dicoding Indonesia',
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
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
    username = `user-${Math.random()}`,
    password = 'secret',
  } = {}) {
    // Ensure user exists
    await this.addUser({ id, username, password });

    // Generate token using JwtTokenManager
    const jwtTokenManager = new JwtTokenManager(Jwt.token);
    const accessToken = await jwtTokenManager.createAccessToken({ id, username });

    return accessToken;
  },

  async cleanTable() {
    await pool.query('DELETE FROM users WHERE 1=1');
  },
};

module.exports = UsersTableTestHelper;
