const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrate the delete reply flow correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const commentId = 'comment-456';
    const replyId = 'reply-789';
    const userId = 'user-randomId';

    const mockReplyRepository = {
      verifyReplyOwner: jest.fn().mockResolvedValue(),
      deleteReplyById: jest.fn().mockResolvedValue(),
    };

    const useCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Act
    await useCase.execute(threadId, commentId, replyId, userId);

    // Assert
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(threadId, commentId, replyId, userId);
    expect(mockReplyRepository.deleteReplyById).toHaveBeenCalledWith(replyId);
  });
});
