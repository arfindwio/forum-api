const CreateReply = require("../../Domains/replies/entities/CreateReply");

class AddReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const createReply = new CreateReply(useCasePayload);
    await this._commentRepository.getCommentById(createReply.comment_id);
    return this._replyRepository.addReply(createReply);
  }
}

module.exports = AddReplyUseCase;
