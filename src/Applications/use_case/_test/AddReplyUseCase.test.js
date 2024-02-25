const CommentRepository = require("../../../Domains/comments/CommentRepository");
const CreateReply = require("../../../Domains/replies/entities/CreateReply");
const CreatedReply = require("../../../Domains/replies/entities/CreatedReply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const AddReplyUseCase = require("../AddReplyUseCase");

describe("AddCommentUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      owner: "user-123",
      comment_id: "comment-123",
      content: "ini title",
    };

    const mockCreatedReply = new CreatedReply({
      id: "reply-123",
      owner: useCasePayload.owner,
      content: useCasePayload.content,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockCommentRepository.getCommentById = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(mockCreatedReply));

    /** creating use case instance */
    const getReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const createdReply = await getReplyUseCase.execute(useCasePayload);

    // Assert
    expect(createdReply).toStrictEqual(
      new CreatedReply({
        id: "reply-123",
        owner: useCasePayload.owner,
        content: useCasePayload.content,
      })
    );

    expect(mockCommentRepository.getCommentById).toBeCalledWith("comment-123");

    expect(mockReplyRepository.addReply).toBeCalledWith(
      new CreateReply({
        owner: useCasePayload.owner,
        comment_id: useCasePayload.comment_id,
        content: useCasePayload.content,
      })
    );
  });
});
