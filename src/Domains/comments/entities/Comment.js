class Comment {
  constructor({ id, username, created_at, content, replies, likeCount}) {
    this._verifyPayload({ id, username, created_at, content, replies, likeCount });

    this.id = id;
    this.username = username;
    this.date = created_at;
    this.content = content;
    this.replies = replies;
    this.likeCount = likeCount;
  }

  _verifyPayload({ id, username, created_at, content, replies, likeCount }) {
    if (
      id === undefined ||
      username === undefined ||
      created_at === undefined ||
      content === undefined ||
      replies === undefined ||
      likeCount === undefined
    ) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof created_at !== 'string' ||
      typeof content !== 'string' ||
      !Array.isArray(replies) ||
      typeof likeCount !== 'number'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
