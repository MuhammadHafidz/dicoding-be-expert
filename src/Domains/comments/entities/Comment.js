class Comment {
  constructor({ id, username, created_at, content, replies }) {
    this._verifyPayload({ id, username, created_at, content, replies });

    this.id = id;
    this.username = username;
    this.date = created_at;
    this.content = content;
    this.replies = replies;
  }

  _verifyPayload({ id, username, created_at, content, replies }) {
    if (!id || !username || !created_at || !content || !replies) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof created_at !== 'string' ||
      typeof content !== 'string' ||
      !Array.isArray(replies)
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
