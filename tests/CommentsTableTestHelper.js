/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'Default Comment Content',
    userId = 'user-123',
    threadId = 'thread-123',
    createdAt = new Date(),
    deletedAt = null, 
  }) {
    const query = {
      text: 'INSERT INTO comments (id, content, user_id, thread_id, created_at, deleted_at) VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, userId, threadId, createdAt, deletedAt],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments');
  },
};

module.exports = CommentsTableTestHelper;
