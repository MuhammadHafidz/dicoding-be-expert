const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload, threadId, userId) {
    await this._threadRepository.verifyThreadExists(threadId);
    const addComment = new AddComment({ ...payload, threadId }, userId);
    return await this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
