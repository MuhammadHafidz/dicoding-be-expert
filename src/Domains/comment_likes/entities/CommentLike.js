class CommentLike {
  constructor(commentId, userId) {
    this._verifyPayload(commentId, userId);

    this.commentId = commentId;
    this.userId = userId;
  }

  _verifyPayload(commentId, userId) {
    if (!commentId || !userId) {
      throw new Error('COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof commentId !== 'string' ||
      typeof userId !== 'string'
    ) {
      throw new Error('COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentLike;