class Reply {
  constructor({ id, content, created_at, username }) {
    this._verifyPayload({ id, content, created_at, username });

    this.id = id;
    this.content = content;
    this.date = created_at;
    this.username = username;
  }

  _verifyPayload({ id, content, created_at, username }) {
    if (!id || !content || !created_at || !username) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof created_at !== 'string' ||
      typeof username !== 'string'
    ) {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Reply;