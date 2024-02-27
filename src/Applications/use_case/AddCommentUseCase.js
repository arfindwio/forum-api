const CreateComment = require("../../Domains/comments/entities/CreateComment");

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const createComment = new CreateComment(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(createComment.thread_id);
    return this._commentRepository.addComment(createComment);
  }
}

module.exports = AddCommentUseCase;
