const AddedThread = require('../AddedThread');

describe('AddedThread entity', () => {
  it('should throw error when required property is missing', () => {
    const payload = {
      id: 'thread-123131',
      title: 'judul',
      // missing user_id
    };

    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data types are incorrect', () => {
    const payload = {
      id: 123,
      title: {},
      user_id: [],
    };

    expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread object correctly and map user_id to owner', () => {
    const payload = {
      id: 'thread-1232131',
      title: 'judul thread',
      user_id: 'user-zcxzcz',
    };

    const addedThread = new AddedThread(payload);

    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.user_id);
  });
});
