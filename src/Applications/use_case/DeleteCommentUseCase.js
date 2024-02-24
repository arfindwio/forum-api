const DeleteComment = require("../../Domains/comments/entities/DeleteComment");

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const deleteComment = new DeleteComment(payload);
    await this._commentRepository.getCommentDetail(payload.id, payload.thread_id);
    await this._commentRepository.getCommentOwner(payload.id, payload.owner);
    return this._commentRepository.deleteComment(deleteComment);
  }
}

module.exports = DeleteCommentUseCase;
