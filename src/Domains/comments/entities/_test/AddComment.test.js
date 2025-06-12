const AddComment = require('../AddComment');

describe('AddComment entity', () => {

  it('should throw error when required properties are missing', () => {
    const payload = {
      content: 'komentar',
    };

    expect(() => new AddComment(payload, 'user-123')).toThrow('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data types do not match', () => {
    const payload = {
      content: 123,
      threadId: {}, 
    };

    expect(() => new AddComment(payload, 456)).toThrow('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddComment object correctly', () => {
    const payload = {
      content: 'komentar valid',
      threadId: 'thread-abc',
    };
    const userId = 'user-ada';

    const addComment = new AddComment(payload, userId);

    expect(addComment.content).toEqual(payload.content);
    expect(addComment.threadId).toEqual(payload.threadId);
    expect(addComment.userId).toEqual(userId);
  });
});