const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const CommentDetail = require("../../../Domains/comments/entities/CommentDetail");

describe("GetThreadDetailUseCase", () => {
  it("Must orchestrate the feature of getting thread details correctly", async () => {
    const payload = {
      username: "username",
      title: "ini title",
      body: "ini body",
      content: "ini content",
      date: new Date().toISOString(),
    };

    const mockThreadDetail = new ThreadDetail({
      id: "thread-123",
      title: payload.title,
      username: payload.username,
      body: payload.body,
      date: payload.date,
    });

    const mockComment1 = {
      id: "comment-123",
      username: payload.username,
      date: payload.date,
      content: payload.content,
      is_delete: true,
    };

    const mockComment2 = {
      id: "comment-123",
      username: "username2",
      date: payload.date,
      content: payload.content,
      is_deleted: true,
    };

    const comments = [mockComment1, mockComment2];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThreadDetail));
    mockCommentRepository.getAllCommentsByThreadId = jest.fn(() => Promise.resolve(comments));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute("thread-123");

    expect(threadDetail).toEqual({
      id: "thread-123",
      title: payload.title,
      username: payload.username,
      body: payload.body,
      date: payload.date,
      comments: [new CommentDetail(mockComment1), new CommentDetail({ ...mockComment2, content: "**komentar telah dihapus**" })],
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-123");
    expect(mockCommentRepository.getAllCommentsByThreadId).toBeCalledWith("thread-123");
  });

  it("Should orchestrate the feature of retrieving thread details without comments correctly", async () => {
    const payload = {
      username: "username",
      title: "ini title",
      body: "ini body",
      content: "ini content",
      date: new Date().toISOString(),
    };

    const mockThreadDetail = new ThreadDetail({
      id: "thread-123",
      title: payload.title,
      username: payload.username,
      body: payload.body,
      date: payload.date,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThreadDetail));
    mockCommentRepository.getAllCommentsByThreadId = jest.fn(() => Promise.resolve([]));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute("thread-123");

    expect(threadDetail).toEqual({
      id: "thread-123",
      title: payload.title,
      username: payload.username,
      body: payload.body,
      date: payload.date,
      comments: [],
    });
  });
});
