const CommentLikeRepository = require('../../Domains/comment_likes/CommentLikeRepository');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async existsByCommentLike({ commentId, userId }) {
    const query = {
      text: 'SELECT 1 FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async add({ commentId, userId }) {
    const isAlreadyLiked = await this.existsByCommentLike({ commentId, userId });

    if (isAlreadyLiked) {
      throw new InvariantError('Kamu sudah menyukai komentar ini');
    }

    const id = `comment_like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comment_likes (id, comment_id, user_id) VALUES ($1, $2, $3)',
      values: [id, commentId, userId],
    };

    await this._pool.query(query);
  }

  async delete({ commentId, userId }) {
    const isLiked = await this.existsByCommentLike({ commentId, userId });

    if (!isLiked) {
      throw new NotFoundError('User belum menyukai Komentar ini');
    }

    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentLikeRepositoryPostgres;
