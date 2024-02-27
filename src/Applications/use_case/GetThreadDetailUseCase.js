const CommentDetail = require("../../Domains/comments/entities/CommentDetail");
const ReplyDetail = require("../../Domains/replies/entities/ReplyDetail");

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(thread_id) {
    const threadDetail = await this._threadRepository.getThreadById(thread_id);
    const comments = await this._commentRepository.getAllCommentsByThreadId(thread_id);

    const allCommentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getAllRepliesByCommentId(comment.id);

        const formattedReplies = replies.map((reply) => ({
          id: reply.id,
          username: reply.username,
          content: reply.is_deleted ? "**balasan telah dihapus**" : reply.content,
          date: reply.date,
        }));

        const formattedComment = {
          id: comment.id,
          username: comment.username,
          content: comment.is_deleted ? "**komentar telah dihapus**" : comment.content,
          date: comment.date,
        };

        formattedComment.replies = formattedReplies;

        return formattedComment;
      })
    );

    allCommentsWithReplies.sort((a, b) => new Date(a.date) - new Date(b.date));

    threadDetail.comments = allCommentsWithReplies;

    return threadDetail;
  }
}

module.exports = GetThreadDetailUseCase;
