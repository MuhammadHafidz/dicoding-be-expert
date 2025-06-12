const Comment = require('../../Domains/comments/entities/Comment');
const Reply = require('../../Domains/replies/entities/Reply');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadExists(threadId);
    const thread = await this._threadRepository.findThreadById(threadId);
    
    const commentsDto = await this._commentRepository.getCommentsByThreadId(threadId);
    const commentIds = commentsDto.map(comment => comment.id);

    const repliesDto = await this._replyRepository.getRepliesByCommentIds(commentIds);
    const repliesGrouped = {};
    
    for (const reply of repliesDto) {
      
      const formattedReply = new Reply({
        id: reply.id,
        content: reply.isDeleted ? '**balasan telah dihapus**' : reply.content,
        created_at: reply.date.toISOString(),
        username: reply.username,
      });

      if (!repliesGrouped[reply.commentId]) {
        repliesGrouped[reply.commentId] = [];
      }
      repliesGrouped[reply.commentId].push(formattedReply);
    }
    
    const formattedComments = commentsDto.map((comment) => new Comment({
      id: comment.id,
      username: comment.username,
      created_at: comment.date.toISOString(),
      content: comment.isDeleted ? '**komentar telah dihapus**' : comment.content,
      replies: repliesGrouped[comment.id] || [],
    }));

    thread.setComments(formattedComments);

    return thread;
  }
}

module.exports = GetThreadUseCase;
