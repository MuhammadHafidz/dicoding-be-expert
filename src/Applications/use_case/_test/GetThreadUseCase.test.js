const GetThreadUseCase = require('../GetThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const Thread = require('../../../Domains/threads/entities/Thread');
const Comment = require('../../../Domains/comments/entities/Comment');
const Reply = require('../../../Domains/replies/entities/Reply');
const CommentDTO = require('../../../Domains/comments/dto/CommentDTO');
const ReplyDTO = require('../../../Domains/replies/dto/ReplyDTO');

describe('GetThreadUseCase', () => {
  it('should orchestrate the get thread flow correctly using DTO and multiple repositories', async () => {
    // Arrange
    const threadId = 'thread-123';
  
    const mockThread = {
      id: threadId,
      title: 'Judul thread',
      body: 'Isi thread',
      created_at: '2021-08-08T08:20:00.000Z',
      username: 'dicoding',
    };
  
    const mockCommentDtos = [
      new CommentDTO({
        id: 'comment-123',
        username: 'johndoe',
        created_at: new Date('2022-01-01T00:00:00.000Z'),
        content: 'komentar abc',
        deleted_at: null,
      }),
      new CommentDTO({
        id: 'comment-1234',
        username: 'johndoe',
        created_at: new Date('2022-01-02T00:00:00.000Z'),
        content: 'komentar abc',
        deleted_at: new Date('2022-01-02T00:00:00.000Z'),
      }),
    ];
  
    const mockReplyDtos = [
      new ReplyDTO({
        id: 'reply-999',
        comment_id: 'comment-123',
        username: 'dicoding',
        created_at: new Date('2022-01-03T00:00:00.000Z'),
        content: 'sebuah balasan',
        deleted_at: null,
      }),
      new ReplyDTO({
        id: 'reply-del',
        comment_id: 'comment-123',
        username: 'dicoding',
        created_at: new Date('2022-01-04T00:00:00.000Z'),
        content: 'balasan yang dihapus',
        deleted_at: new Date('2022-01-04T00:00:00.000Z'),
      }),
    ];
  
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadExists = jest.fn().mockResolvedValue();
    mockThreadRepository.findThreadById = jest.fn().mockResolvedValue(new Thread(mockThread));
    
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockResolvedValue(mockCommentDtos);
  
    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.getRepliesByCommentIds = jest.fn().mockResolvedValue(mockReplyDtos);
  
    const useCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });
  
    // Act
    const result = await useCase.execute(threadId);
  
    // Assert
    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.findThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentIds).toHaveBeenCalledWith(['comment-123', 'comment-1234']);
  
    expect(result).toBeInstanceOf(Thread);
    expect(result.id).toBe(threadId);
    expect(result.title).toBe('Judul thread');
    expect(result.body).toBe('Isi thread');
    expect(result.date).toBe('2021-08-08T08:20:00.000Z');
    expect(result.username).toBe('dicoding');
  
    expect(result.comments).toBeInstanceOf(Array);
    expect(result.comments).toHaveLength(2);
  
    const [comment1, comment2] = result.comments;
  
    expect(comment1).toBeInstanceOf(Comment);
    expect(comment1.id).toBe('comment-123');
    expect(comment1.username).toBe('johndoe');
    expect(comment1.date).toBe('2022-01-01T00:00:00.000Z');
    expect(comment1.content).toBe('komentar abc');
    expect(comment1.replies).toBeInstanceOf(Array);
    expect(comment1.replies).toHaveLength(2);
    expect(comment2.id).toBe('comment-1234');
    expect(comment2.content).toBe('**komentar telah dihapus**');
    expect(comment2.replies).toBeInstanceOf(Array);
    expect(comment2.replies).toHaveLength(0);
  
    const [reply1, reply2] = comment1.replies;
  
    expect(reply1).toBeInstanceOf(Reply);
    expect(reply1.id).toBe('reply-999');
    expect(reply1.content).toBe('sebuah balasan');
    expect(reply1.date).toBe('2022-01-03T00:00:00.000Z');
    expect(reply1.username).toBe('dicoding');
  
    expect(reply2).toBeInstanceOf(Reply);
    expect(reply2.id).toBe('reply-del');
    expect(reply2.content).toBe('**balasan telah dihapus**');
    expect(reply2.date).toBe('2022-01-04T00:00:00.000Z');
    expect(reply2.username).toBe('dicoding');
  });  
});
