/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'Default Reply Content',
    userId = 'user-123',
    commentId = 'comment-123',
    createdAt = new Date(),
    deletedAt = null, 
  }) {
    const query = {
      text: 'INSERT INTO replies (id, content, user_id, comment_id, created_at, deleted_at) VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, userId, commentId, createdAt, deletedAt],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies');
  },
};

module.exports = RepliesTableTestHelper;
