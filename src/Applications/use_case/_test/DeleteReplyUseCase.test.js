const DeleteReplyUseCase = require("../DeleteReplyUseCase");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");

describe("DeleteReplyUseCase", () => {
  it("should orchestrating the delete reply action correctly", async () => {
    // Arrange
    const payload = {
      id: "reply-123",
      owner: "user-123",
      comment_id: "comment-123",
    };

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.getReplyDetail = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.getReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(payload);

    // Assert
    expect(mockReplyRepository.getReplyDetail).toBeCalledWith(payload.id, payload.comment_id);
    expect(mockReplyRepository.getReplyOwner).toBeCalledWith(payload.id, payload.owner);
    expect(mockReplyRepository.deleteReply).toBeCalledWith(payload);
  });
});
