const ReplyRepository = require("../ReplyRepository");

describe("ReplyRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action and Assert
    await expect(replyRepository.addReply({})).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(replyRepository.getReplyDetail({})).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(replyRepository.getReplyOwner({})).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(replyRepository.deleteReply({})).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(replyRepository.getAllRepliesByCommentId({})).rejects.toThrowError("REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
