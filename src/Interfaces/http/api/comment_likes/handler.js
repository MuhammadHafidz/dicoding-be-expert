const ToggleCommentLikeUseCase = require("../../../../Applications/use_case/ToggleCommentLikeUseCase");

class CommentLikeHandler {
  constructor(container) {
    this._container = container;

    this.toogleCommentLikeHandler = this.toogleCommentLikeHandler.bind(this);
  }

  async toogleCommentLikeHandler(request, h) {
    
    
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const toggleCommentLikeUseCase = this._container.getInstance(ToggleCommentLikeUseCase.name);

    await toggleCommentLikeUseCase.execute(
      { threadId, commentId },
      userId
    );

    const response = h.response({
      status: 'success'
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentLikeHandler;
