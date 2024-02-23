const CreateComment = require("../../Domains/comments/entities/CreateComment");

class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const createComment = new CreateComment(useCasePayload);
    return this._commentRepository.addComment(createComment);
  }
}

module.exports = AddCommentUseCase;
