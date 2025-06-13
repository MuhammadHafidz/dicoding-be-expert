const Comment = require('../Comment');
const Reply = require('../../../replies/entities/Reply');

describe('Comment entity', () => {
  it('should throw error when required property is missing', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      created_at: '2021-08-08T00:00:00.000Z',
      replies: [],
    };

    expect(() => new Comment(payload)).toThrow('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data types do not match', () => {
    const payload = {
      id: 123,
      username: 456,
      created_at: {},
      content: [],
      replies: 'not-an-array',
      likeCount: 'not-a-number'
    };

    expect(() => new Comment(payload)).toThrow('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment entity correctly', () => {
    const reply1 = new Reply({
      id: 'reply-001',
      content: '**balasan telah dihapus**',
      created_at: '2021-08-08T00:01:00.000Z',
      username: 'johndoe',
    });

    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      created_at: '2021-08-08T00:00:00.000Z',
      content: 'komentar valid',
      replies: [reply1],
      likeCount: 10
    };

    const comment = new Comment(payload);

    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.created_at);
    expect(comment.content).toEqual(payload.content);
    expect(comment.likeCount).toEqual(payload.likeCount);
    expect(comment.replies).toHaveLength(1);
    expect(comment.replies[0]).toBeInstanceOf(Reply);
  });
});
