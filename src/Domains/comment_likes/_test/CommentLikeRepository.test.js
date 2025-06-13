const CommentLikeRepository = require('../CommentLikeRepository');
 
describe('CommentLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const replyRepository = new CommentLikeRepository();
 
    // Action and Assert
    await expect(replyRepository.existsByCommentLike({})).rejects.toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.add({})).rejects.toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.delete({})).rejects.toThrow('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});