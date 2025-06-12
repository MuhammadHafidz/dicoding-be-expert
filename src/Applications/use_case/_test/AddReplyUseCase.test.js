const AddReplyUseCase = require('../AddReplyUseCase');
const AddReply = require('../../../../src/Domains/replies/entities/AddReply');
const AddedReply = require('../../../../src/Domains/replies/entities/AddedReply');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrate the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'ini balasan',
      commentId: 'comment-123',
    };
    const threadId = 'thread-abc';
    const userId = 'user-randomId';

    const mockAddedReply = new AddedReply({
      id: 'reply-999',
      content: useCasePayload.content,
      user_id: userId,
    });
    
    const expectedAddedReply = new AddedReply({
      id: 'reply-999',
      content: useCasePayload.content,
      user_id: userId,
    });

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyCommentExist = jest.fn().mockResolvedValue();

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.addReply = jest.fn().mockResolvedValue(mockAddedReply);

    const addReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Act
    const result = await addReplyUseCase.execute(useCasePayload, threadId, userId);

    // Assert
    expect(mockCommentRepository.verifyCommentExist).toHaveBeenCalledWith(threadId, useCasePayload.commentId);
    expect(mockReplyRepository.addReply).toHaveBeenCalledWith(new AddReply(useCasePayload, userId));
    expect(result).toBeInstanceOf(AddedReply);
    expect(result).toStrictEqual(expectedAddedReply);
  });
});
