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

    const mockThreadDetail = {
      id: "thread-123",
      title: payload.title,
      username: payload.username,
      body: payload.body,
      date: payload.date,
    };

    const mockComment1 = {
      id: "comment-123",
      username: payload.username,
      date: payload.date,
      content: payload.content,
      is_deleted: false,
    };

    const mockComment2 = {
      id: "comment-1234",
      username: "username2",
      date: payload.date,
      content: payload.content,
      is_deleted: true,
    };

    const mockReply1 = {
      id: "reply-123",
      username: payload.username,
      date: payload.date,
      content: payload.content,
      is_deleted: false,
    };

    const mockReply2 = {
      id: "reply-1234",
      username: "username2",
      date: payload.date,
      content: payload.content,
      is_deleted: true,
    };

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

    expect(threadDetail.id).toEqual(mockThreadDetail.id);
    expect(threadDetail.title).toEqual(mockThreadDetail.title);
    expect(threadDetail.username).toEqual(mockThreadDetail.username);
    expect(threadDetail.body).toEqual(mockThreadDetail.body);
    expect(threadDetail.date).toEqual(mockThreadDetail.date);
    expect(threadDetail.comments[0]).toEqual({
      id: mockComment1.id,
      username: mockComment1.username,
      content: mockComment1.content,
      date: mockComment1.date,
      replies: [
        {
          id: mockReply1.id,
          username: mockReply1.username,
          date: mockReply1.date,
          content: mockReply1.content,
        },
        {
          id: mockReply2.id,
          username: mockReply2.username,
          date: mockReply2.date,
          content: "**balasan telah dihapus**",
        },
      ],
    });
    expect(threadDetail.comments[1]).toEqual({
      id: mockComment2.id,
      username: mockComment2.username,
      content: "**komentar telah dihapus**",
      date: mockComment2.date,
      replies: [],
    });
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
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThreadDetail));
    mockCommentRepository.getAllCommentsByThreadId = jest.fn(() => Promise.resolve([]));
    mockReplyRepository.getAllRepliesByThreadId = jest.fn(() => Promise.resolve([]));

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
