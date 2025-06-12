const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-456';
    const userId = 'user-abc';

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockResolvedValue();

    mockCommentRepository.deleteComment = jest.fn()
      .mockResolvedValue();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Act
    await deleteCommentUseCase.execute(threadId, commentId, userId);

    // Assert
    expect(mockCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith(threadId, commentId, userId);

    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(commentId);
  });
});
