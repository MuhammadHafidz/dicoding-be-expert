const Reply = require('../Reply');

describe('Reply entity', () => {
  it('should throw error when required property is missing', () => {
    const payload = {
      id: 'reply-123',
      content: 'balasan',
      created_at: '2021-08-08T00:00:00.000Z'
    };

    expect(() => new Reply(payload)).toThrow('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data types do not match', () => {
    const payload = {
      id: 123,
      content: {},
      created_at: [],
      username: 99,
    };

    expect(() => new Reply(payload)).toThrow('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Reply entity correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'balasan valid',
      created_at: '2021-08-08T00:00:00.000Z',
      username: 'userabc',
    };

    const reply = new Reply(payload);

    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.date).toEqual(payload.created_at);
    expect(reply.username).toEqual(payload.username);
  });
});
