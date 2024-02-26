const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const CommentDetail = require("../../../Domains/comments/entities/CommentDetail");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ReplyDetail = require("../../../Domains/replies/entities/ReplyDetail");

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

    const mockComment1 = new CommentDetail({
      id: "comment-123",
      username: payload.username,
      date: payload.date,
      content: payload.content,
      is_deleted: false,
    });

    const mockComment2 = new CommentDetail({
      id: "comment-1234",
      username: "username2",
      date: payload.date,
      content: payload.content,
      is_deleted: true,
    });

    const mockReply1 = new ReplyDetail({
      id: "reply-123",
      username: payload.username,
      date: payload.date,
      content: payload.content,
      is_deleted: false,
    });

    const mockReply2 = new ReplyDetail({
      id: "reply-1234",
      username: "username2",
      date: payload.date,
      content: payload.content,
      is_deleted: true,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThreadDetail));
    mockCommentRepository.getAllCommentsByThreadId = jest.fn(() => Promise.resolve([mockComment1, mockComment2]));
    mockReplyRepository.getAllRepliesByCommentId = jest.fn().mockImplementation((commentId) => {
      if (commentId === "comment-123") {
        return Promise.resolve([mockReply1, mockReply2]);
      }
      return Promise.resolve([]);
    });

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute("thread-123");

    expect(threadDetail).toEqual(threadDetail);
    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-123");
    expect(mockCommentRepository.getAllCommentsByThreadId).toBeCalledWith("thread-123");
    expect(mockReplyRepository.getAllRepliesByCommentId).toBeCalledWith("comment-123");
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

  it("Should orchestrate the feature of retrieving thread details, comment details without replies correctly", async () => {
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

    const mockCommentDetail = new CommentDetail({
      id: "comment-123",
      username: payload.username,
      date: payload.date,
      content: payload.content,
      is_deleted: false,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThreadDetail));
    mockCommentRepository.getAllCommentsByThreadId = jest.fn(() => Promise.resolve([mockCommentDetail]));
    mockReplyRepository.getAllRepliesByCommentId = jest.fn(() => Promise.resolve([]));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute("thread-123");

    expect(threadDetail).toEqual({
      id: "thread-123",
      title: payload.title,
      username: payload.username,
      body: payload.body,
      date: payload.date,
      comments: [{ ...mockCommentDetail, replies: [] }],
    });
  });
});
