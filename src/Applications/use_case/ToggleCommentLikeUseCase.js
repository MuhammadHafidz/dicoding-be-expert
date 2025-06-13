const CommentLike = require('../../Domains/comment_likes/entities/CommentLike');

class ToggleCommentLikeUseCase {
  constructor({ commentRepository, commentLikeRepository }) {
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload, userId) {
    const { threadId, commentId } = useCasePayload;

    // Pastikan komentar valid (dan thread-nya valid)
    await this._commentRepository.verifyCommentExist(threadId, commentId);

    const likeInfo = new CommentLike(commentId, userId);

    const hasLiked = await this._commentLikeRepository.existsByCommentLike(likeInfo);

    if (hasLiked) {
      await this._commentLikeRepository.delete(likeInfo); // batal like
    } else {
      await this._commentLikeRepository.add(likeInfo); // like
    }
  }
}

module.exports = ToggleCommentLikeUseCase;
