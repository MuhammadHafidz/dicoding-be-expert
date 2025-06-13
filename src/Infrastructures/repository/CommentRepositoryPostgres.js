const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentDTO = require('../../Domains/comments/dto/CommentDTO');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, threadId, userId } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments (id, content, thread_id, user_id) VALUES ($1, $2, $3, $4) RETURNING id, content, user_id',
      values: [id, content, threadId, userId],
    };

    const result = await this._pool.query(query);
    return new AddedComment(result.rows[0]);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT 
          comments.id,
          comments.content,
          comments.created_at,
          comments.deleted_at,
          users.username,
          COUNT(comment_likes.comment_id) AS like_count
        FROM comments
        JOIN users ON users.id = comments.user_id
        LEFT JOIN comment_likes ON comment_likes.comment_id = comments.id
        WHERE comments.thread_id = $1
        GROUP BY comments.id, users.username, comments.content, comments.created_at, comments.deleted_at
        ORDER BY comments.created_at ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map(row => new CommentDTO(row));
  }

  async verifyCommentOwner(threadId, commentId, userId) {
    const query = {
      text: `
        SELECT id, user_id FROM comments
        WHERE id = $1 AND thread_id = $2
      `,
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
    

    const comment = result.rows[0];
    if (comment.user_id !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyCommentExist(threadId, commentId) {
    const query = {
      text: `
        SELECT id FROM comments
        WHERE id = $1 AND thread_id = $2
      `,
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
    
  }

  async deleteComment(commentId) {
    const query = {
      text: `
        UPDATE comments SET deleted_at = NOW()
        WHERE id = $1
      `,
      values: [commentId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
