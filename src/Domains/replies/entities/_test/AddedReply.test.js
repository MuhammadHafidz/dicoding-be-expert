const AddedReply = require('../AddedReply');

describe('AddedReply entity', () => {
  it('should throw error when required properties are missing', () => {
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan',
    };

    expect(() => new AddedReply(payload)).toThrow('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data types are incorrect', () => {
    const payload = {
      id: 123,
      content: true,
      user_id: [],
    };

    expect(() => new AddedReply(payload)).toThrow('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply entity correctly', () => {
    const payload = {
      id: 'reply-randomId',
      content: 'ini balasan',
      user_id: 'user-abc',
    };

    const addedReply = new AddedReply(payload);

    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.user_id);
  });
});
