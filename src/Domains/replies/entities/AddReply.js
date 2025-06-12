class AddReply {
  constructor(payload, userId) {
    this._verifyPayload(payload, userId);

    const { content, commentId } = payload;

    this.content = content;
    this.commentId = commentId;
    this.userId = userId;
  }

  _verifyPayload({ content, commentId }, userId) {
    if (!content || !commentId || !userId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof content !== 'string' ||
      typeof commentId !== 'string' ||
      typeof userId !== 'string'
    ) {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
