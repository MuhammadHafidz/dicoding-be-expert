const ToggleCommentLikeUseCase = require('../ToggleCommentLikeUseCase');
const CommentLike = require('../../../Domains/comment_likes/entities/CommentLike');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentLikeRepository = require('../../../Domains/comment_likes/CommentLikeRepository');

describe('ToggleCommentLikeUseCase', () => {
  it('should like comment if not liked before', async () => {
    // Arrange
    
    const userId = 'user-randomId';

    const useCasePayload = ({
      threadId: 'thread-123',
      commentId: 'comment-123',
    })

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyCommentExist = jest.fn().mockResolvedValue();

    const mockCommentLikeRepository = new CommentLikeRepository();
    mockCommentLikeRepository.existsByCommentLike = jest.fn().mockResolvedValue(false);
    mockCommentLikeRepository.add = jest.fn().mockResolvedValue();
    mockCommentLikeRepository.delete = jest.fn();

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Act
    await toggleCommentLikeUseCase.execute(useCasePayload, userId);

    // Assert
    expect(mockCommentRepository.verifyCommentExist).toHaveBeenCalledWith(useCasePayload.threadId, useCasePayload.commentId);
    expect(mockCommentLikeRepository.existsByCommentLike).toHaveBeenCalledWith(new CommentLike(useCasePayload.commentId, userId));
    expect(mockCommentLikeRepository.add).toHaveBeenCalledWith(new CommentLike(useCasePayload.commentId, userId));
    expect(mockCommentLikeRepository.delete).not.toHaveBeenCalled();
  });

  it('should unlike comment if liked before', async () => {
    // Arrange
    
    const userId = 'user-randomId';

    const useCasePayload = ({
      threadId: 'thread-123',
      commentId: 'comment-123',
    })
    
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyCommentExist = jest.fn().mockResolvedValue();

    const mockCommentLikeRepository = new CommentLikeRepository();
    mockCommentLikeRepository.existsByCommentLike = jest.fn().mockResolvedValue(true);
    mockCommentLikeRepository.delete = jest.fn().mockResolvedValue();

    const toggleCommentLikeUseCase = new ToggleCommentLikeUseCase({
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Act
    await toggleCommentLikeUseCase.execute(useCasePayload, userId);

    // Assert
    expect(mockCommentRepository.verifyCommentExist).toHaveBeenCalledWith(useCasePayload.threadId, useCasePayload.commentId);
    expect(mockCommentLikeRepository.existsByCommentLike).toHaveBeenCalledWith(new CommentLike(useCasePayload.commentId, userId));
    expect(mockCommentLikeRepository.delete).toHaveBeenCalledWith(new CommentLike(useCasePayload.commentId, userId));
    expect(mockCommentLikeRepository.add).not.toHaveBeenCalled();
  });
});
