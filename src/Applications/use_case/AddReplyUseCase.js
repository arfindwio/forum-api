const CreateReply = require('../../Domains/replies/entities/CreateReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const createReply = new CreateReply(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(createReply.thread_id);
    await this._commentRepository.verifyCommentAvailability(createReply.comment_id);
    return this._replyRepository.addReply(createReply);
  }
}

module.exports = AddReplyUseCase;
