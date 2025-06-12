const AddReply = require('../../Domains/replies/entities/AddReply');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class AddReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(payload, threadId, userId) {
    await this._commentRepository.verifyCommentExist(threadId, payload.commentId);
    const addReply = new AddReply(payload, userId);

    return await this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
