const AddReply = require('../AddReply');

describe('AddReply entity', () => {
  it('should throw error when required properties are missing', () => {
    const payload = {
      content: 'sebuah balasan',
    };
    const userId = 'user-123';

    expect(() => new AddReply(payload, userId)).toThrow('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data types are incorrect', () => {
    const payload = {
      content: 123,
      commentId: {},
    };
    const userId = 456;

    expect(() => new AddReply(payload, userId)).toThrow('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddReply entity correctly', () => {
    const payload = {
      content: 'ini balasan',
      commentId: 'comment-123',
    };
    const userId = 'user-abc';

    const addReply = new AddReply(payload, userId);

    expect(addReply.content).toEqual(payload.content);
    expect(addReply.commentId).toEqual(payload.commentId);
    expect(addReply.userId).toEqual(userId);
  });
});
