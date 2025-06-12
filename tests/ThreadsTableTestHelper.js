/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'Default Title',
    body = 'Default Body',
    userId = 'user-123',
    createdAt = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO threads (id, title, body, user_id, created_at) VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, userId, createdAt],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads');
  },
};

module.exports = ThreadsTableTestHelper;
