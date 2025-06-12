const AddedComment = require('../AddedComment');

describe('AddedComment entity', () => {
  it('should throw error when required property is missing', () => {
    const payload = {
      id: 'comment-123',
      content: 'komentar',
      // user_id missing
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data types are incorrect', () => {
    const payload = {
      id: 123,
      content: [],
      user_id: {},
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment object correctly and map user_id to owner', () => {
    const payload = {
      id: 'comment-randomId',
      content: 'komentar baru',
      user_id: 'user-999',
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.user_id);
  });
});
