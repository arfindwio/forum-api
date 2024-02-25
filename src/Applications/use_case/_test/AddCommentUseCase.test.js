const CreateComment = require("../../../Domains/comments/entities/CreateComment");
const CreatedComment = require("../../../Domains/comments/entities/CreatedComment");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddCommentUseCase = require("../AddCommentUseCase");

describe("AddCommentUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      owner: "user-123",
      thread_id: "thread-123",
      content: "ini title",
    };

    const mockCreatedComment = new CreatedComment({
      id: "comment-123",
      owner: useCasePayload.owner,
      content: useCasePayload.content,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(mockCreatedComment));

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const createdComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(createdComment).toStrictEqual(
      new CreatedComment({
        id: "comment-123",
        owner: useCasePayload.owner,
        content: useCasePayload.content,
      })
    );

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.thread_id);

    expect(mockCommentRepository.addComment).toBeCalledWith(
      new CreateComment({
        owner: useCasePayload.owner,
        thread_id: useCasePayload.thread_id,
        content: useCasePayload.content,
      })
    );
  });
});
