class AddedComment {
  constructor({ id, content, user_id }) {
    this._verifyPayload({ id, content, user_id });

    this.id = id;
    this.content = content;
    this.owner = user_id;
  }

  _verifyPayload({ id, content, user_id }) {
    if (!id || !content || !user_id) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof user_id !== 'string'
    ) {
      throw new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedComment;
