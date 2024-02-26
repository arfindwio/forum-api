const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const CreateReply = require("../../../Domains/replies/entities/CreateReply");
const CreatedReply = require("../../../Domains/replies/entities/CreatedReply");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const AddReplyUseCase = require("../AddReplyUseCase");

describe("AddReplyUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      owner: "user-123",
      thread_id: "thread-123",
      comment_id: "comment-123",
      content: "ini title",
    };

    const mockCreatedReply = new CreatedReply({
      id: "reply-123",
      owner: useCasePayload.owner,
      content: useCasePayload.content,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.getCommentById = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(mockCreatedReply));

    /** creating use case instance */
    const getReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
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

    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-123");
    expect(mockCommentRepository.getCommentById).toBeCalledWith("comment-123");

    expect(mockReplyRepository.addReply).toBeCalledWith(
      new CreateReply({
        owner: useCasePayload.owner,
        thread_id: useCasePayload.thread_id,
        comment_id: useCasePayload.comment_id,
        content: useCasePayload.content,
      })
    );
  });
});
