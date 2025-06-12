const AddCommentUseCase = require('../AddCommentUseCase');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah komentar',
    };
    const threadId = 'thread-123';
    const userId = 'user-abc';

    const mockAddedComment = new AddedComment({
      id: 'comment-randomId',
      content: 'sebuah komentar',
      user_id: userId,
    });

    const expectedResult = new AddedComment({
      id: 'comment-randomId',
      content: 'sebuah komentar',
      user_id: userId,
    });


    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadExists = jest.fn().mockResolvedValue();

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.addComment = jest.fn().mockResolvedValue(mockAddedComment);

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act
    const result = await addCommentUseCase.execute(useCasePayload, threadId, userId);

    // Assert
    expect(result).toStrictEqual(expectedResult);
    expect(result).toBeInstanceOf(AddedComment);
    
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
      new AddComment({...useCasePayload, threadId}, userId),
    );
    
  });
});
