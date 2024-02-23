const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetDetailThreadUseCase = require("../GetDetailThreadUseCase");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DetailComment = require("../../../Domains/comments/entities/DetailComment");

describe("GetDetailThreadUseCase", () => {
  it("harus orchestrating fitur get detail thread dengan benar", async () => {
    // Arrange
    const threadId = "thread-123";

    const payload = {
      username: "alvin",
      title: "Ini contoh title",
      body: "Ini contoh body",
      content: "Ini contoh comment",
      date: new Date().toISOString(),
    };

    const mockDetailThread = new DetailThread({
      id: threadId,
      title: payload.title,
      username: payload.username,
      body: payload.body,
      date: payload.date,
    });

    const mockFirstComment = {
      id: "comment-123",
      username: payload.username,
      date: payload.date,
      content: payload.content,
      is_delete: false,
    };

    const mockSecondComment = {
      id: "comment-321",
      username: "yusuf",
      date: payload.date,
      content: payload.content,
      is_delete: true,
    };

    const comments = [mockFirstComment, mockSecondComment];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(comments));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(detailThread).toEqual({
      id: threadId,
      title: payload.title,
      username: payload.username,
      body: payload.body,
      date: payload.date,
      comments: [new DetailComment(mockFirstComment), new DetailComment({ ...mockSecondComment, content: "**komentar telah dihapus**" })],
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
  });

  it("harus orchestrating fitur get detail thread tanpa comment dengan benar", async () => {
    // Arrange
    const threadId = "thread-123";

    const payload = {
      username: "alvin",
      title: "Ini contoh title",
      body: "Ini contoh body",
      content: "Ini contoh comment",
      date: new Date().toISOString(),
    };

    const mockDetailThread = new DetailThread({
      id: threadId,
      title: payload.title,
      username: payload.username,
      body: payload.body,
      date: payload.date,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([]));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(threadId);

    // Assert
    expect(detailThread).toEqual({
      id: threadId,
      title: payload.title,
      username: payload.username,
      body: payload.body,
      date: payload.date,
      comments: [],
    });
  });
});
