class AddThread {
  constructor(payload, userId) {
    this._verifyPayload(payload, userId);

    const { title, body } = payload;

    this.title = title;
    this.body = body;
    this.userId = userId;
  }

  _verifyPayload(payload, userId) {
    const { title, body } = payload;

    if (!title || !body) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!userId || typeof userId !== 'string') {
      throw new Error('ADD_THREAD.AUTH_HEADER_NOT_VALID');
    }
  }
}

module.exports = AddThread;
