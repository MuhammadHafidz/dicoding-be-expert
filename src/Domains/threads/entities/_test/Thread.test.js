const Comment = require('../../../comments/entities/Comment');
const Thread = require('../Thread');

describe('Thread entity', () => {
  it('should throw error when required property is missing', () => {
    const payload = {
      id: 'thread-123',
      title: 'Judul Thread',
      body: 'Isi Thread',
      username: 'dicoding',
      comments: [],
    };

    expect(() => new Thread(payload)).toThrow('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data types do not match', () => {
    const payload = {
      id: 123,
      title: true,
      body: {},
      created_at: 456,
      username: [],
      comments: 'not-an-array',
    };

    expect(() => new Thread(payload)).toThrow('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Thread entity correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'Judul Thread',
      body: 'Isi lengkap thread',
      created_at: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };

    const thread = new Thread(payload);

    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.date).toEqual(payload.created_at);
    expect(thread.username).toEqual(payload.username);
    expect(thread.comments).toEqual(payload.comments);
  });

  it('should throw error when set comments data types do not match', () => {
    const payload = {
      id: 'thread-123',
      title: 'Judul Thread',
      body: 'Isi lengkap thread',
      created_at: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };

    const thread = new Thread(payload);
  
    expect(() => thread.setComments('not-an-array')).toThrow('THREAD.SET_COMMENTS_MUST_BE_ARRAY');
  });

  it('should set comments correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'Judul Thread',
      body: 'Isi lengkap thread',
      created_at: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    };

    const thread = new Thread(payload);

    const newComment = new Comment({
      id: 'comment-123',
      username: 'dicoding',
      created_at: '2021-08-08T07:19:09.775Z',
      content: 'komentar valid',
      replies: [],
      likeCount: 0
    })


    thread.setComments([
      newComment
    ]);
  
    expect(thread.comments).toEqual([newComment]);
  });

  it('should throw error when created_at is not a string', () => {
    const payload = {
      id: 'thread-1',
      title: 'Judul',
      body: 'Isi',
      created_at: 123, // invalid type
      username: 'userA',
      comments: [],
    };

    expect(() => new Thread(payload)).toThrow('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
