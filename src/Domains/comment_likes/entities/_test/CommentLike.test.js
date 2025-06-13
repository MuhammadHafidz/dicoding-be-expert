const CommentLike = require('../CommentLike');

describe('CommentLike entity', () => {
  it('should throw error when required properties are missing', () => {
    const commentId = 'comment-123';

    expect(() => new CommentLike(commentId)).toThrow('COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when data types are incorrect', () => {
    const commentId = 123;
    const userId = true;

    expect(() => new CommentLike(commentId, userId)).toThrow('COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CommentLike entity correctly', () => {
    const commentId = 'comment-123';
    const userId = 'user-abc';

    const commentLike = new CommentLike(commentId, userId);

    expect(commentLike.commentId).toEqual(commentId);
    expect(commentLike.userId).toEqual(userId);
  });
});