const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const ReplyDTO = require('../../Domains/replies/dto/ReplyDTO');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { content, commentId, userId } = newReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: `
        INSERT INTO replies (id, content, comment_id, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, content, user_id
      `,
      values: [id, content, commentId, userId],
    };

    const result = await this._pool.query(query);
    return new AddedReply(result.rows[0]);
  }

  async getRepliesByCommentIds(commentIds) {
    if (!commentIds.length) return [];

    const query = {
      text: `
        SELECT replies.id, replies.content, replies.created_at, replies.deleted_at,
               replies.comment_id, users.username
        FROM replies
        JOIN users ON users.id = replies.user_id
        WHERE replies.comment_id = ANY($1::text[])
        ORDER BY replies.created_at ASC
      `,
      values: [commentIds],
    };

    const result = await this._pool.query(query);
    return result.rows.map(row => new ReplyDTO(row));
  }

  async verifyReplyOwner(threadId, commentId, replyId, userId) {
    const query = {
      text: `
        SELECT replies.user_id
        FROM replies
        JOIN comments ON comments.id = replies.comment_id
        WHERE replies.id = $1 AND replies.comment_id = $2 AND comments.thread_id = $3
      `,
      values: [replyId, commentId, threadId],
    };

    const result = await this._pool.query(query);
    
    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak ditemukan');
    }

    const reply = result.rows[0];
    if (reply.user_id !== userId) {
      throw new AuthorizationError('Anda tidak berhak menghapus balasan ini');
    }
  }

  async deleteReplyById(replyId) {
    const query = {
      text: `
        UPDATE replies SET deleted_at = NOW()
        WHERE id = $1
      `,
      values: [replyId],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
