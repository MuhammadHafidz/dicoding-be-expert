class Thread {
  constructor({ id, title, body, created_at, username, comments = [] }) {
    this._verifyPayload({ id, title, body, created_at, username, comments });

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = created_at;
    this.username = username;
    this.comments = comments;
  }

  _verifyPayload({ id, title, body, created_at, username, comments }) {
    if (!id || !title || !body || !created_at || !username || !comments) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof created_at !== 'string' ||
      typeof username !== 'string' ||
      !Array.isArray(comments)
    ) {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  setComments(comments) {
    if (!Array.isArray(comments)) {
      throw new Error('THREAD.SET_COMMENTS_MUST_BE_ARRAY');
    }
    this.comments = comments;
  }
}

module.exports = Thread;
