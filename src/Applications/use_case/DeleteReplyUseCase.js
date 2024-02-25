const DeleteReply = require("../../Domains/replies/entities/DeleteReply");

class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(payload) {
    const deleteReply = new DeleteReply(payload);
    await this._replyRepository.getReplyDetail(payload.id, payload.comment_id);
    await this._replyRepository.getReplyOwner(payload.id, payload.owner);
    return this._replyRepository.deleteReply(deleteReply);
  }
}

module.exports = DeleteReplyUseCase;
