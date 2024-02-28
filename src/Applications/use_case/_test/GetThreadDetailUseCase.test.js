const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ThreadDetail = require("../../../Domains/threads/entities/ThreadDetail");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const CommentDetail = require("../../../Domains/comments/entities/CommentDetail");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ReplyDetail = require("../../../Domains/replies/entities/ReplyDetail");

describe("GetThreadDetailUseCase", () => {
  it("Must orchestrate the feature of getting thread details correctly", async () => {
    const useCasePayload = {
      username: "username",
      title: "ini title",
      body: "ini body",
      content: "ini content",
      date: new Date().toISOString(),
    };

    const useCasePayloadThread = {
      id: "thread-123",
      title: useCasePayload.title,
      username: useCasePayload.username,
      body: useCasePayload.body,
      date: useCasePayload.date,
    };

    const useCasePayloadComment1 = {
      id: "comment-123",
      username: useCasePayload.username,
      date: useCasePayload.date,
      content: useCasePayload.content,
      is_deleted: false,
    };

    const useCasePayloadComment2 = {
      id: "comment-1234",
      username: "username2",
      date: useCasePayload.date,
      content: useCasePayload.content,
      is_deleted: true,
    };

    const useCasePayloadReply1 = {
      id: "reply-123",
      username: useCasePayload.username,
      date: useCasePayload.date,
      content: useCasePayload.content,
      is_deleted: false,
      comment_id: "comment-123",
    };

    const useCasePayloadReply2 = {
      id: "reply-1234",
      username: "username2",
      date: useCasePayload.date,
      content: useCasePayload.content,
      is_deleted: true,
      comment_id: "comment-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(useCasePayloadThread));
    mockCommentRepository.getAllCommentsByThreadId = jest.fn(() => Promise.resolve([useCasePayloadComment1, useCasePayloadComment2]));
    mockReplyRepository.getAllRepliesByThreadId = jest.fn(() => Promise.resolve([useCasePayloadReply1, useCasePayloadReply2]));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute("thread-123");

    expect(threadDetail.id).toEqual(useCasePayloadThread.id);
    expect(threadDetail.title).toEqual(useCasePayloadThread.title);
    expect(threadDetail.username).toEqual(useCasePayloadThread.username);
    expect(threadDetail.body).toEqual(useCasePayloadThread.body);
    expect(threadDetail.date).toEqual(useCasePayloadThread.date);
    expect(threadDetail.comments[0]).toEqual({
      id: useCasePayloadComment1.id,
      username: useCasePayloadComment1.username,
      content: useCasePayloadComment1.content,
      date: useCasePayloadComment1.date,
      replies: [
        {
          id: useCasePayloadReply1.id,
          username: useCasePayloadReply1.username,
          date: useCasePayloadReply1.date,
          content: useCasePayloadReply1.content,
        },
        {
          id: useCasePayloadReply2.id,
          username: useCasePayloadReply2.username,
          date: useCasePayloadReply2.date,
          content: "**balasan telah dihapus**",
        },
      ],
    });
    expect(threadDetail.comments[1]).toEqual({
      id: useCasePayloadComment2.id,
      username: useCasePayloadComment2.username,
      content: "**komentar telah dihapus**",
      date: useCasePayloadComment2.date,
      replies: [],
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-123");
    expect(mockCommentRepository.getAllCommentsByThreadId).toBeCalledWith("thread-123");
    expect(mockReplyRepository.getAllRepliesByThreadId).toBeCalledWith("thread-123");
  });
});
