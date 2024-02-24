const CommentDetail = require("../../Domains/comments/entities/CommentDetail");

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(thread_id) {
    const threadDetail = await this._threadRepository.getThreadById(thread_id);

    const comments = await this._commentRepository.getAllCommentsByThreadId(thread_id);

    const commentDetail = [];
    comments.forEach((comment) => {
      commentDetail.push(
        new CommentDetail({
          id: comment.id,
          username: comment.username,
          content: comment.is_deleted ? "**komentar telah dihapus**" : comment.content,
          date: comment.date,
        })
      );
    });

    commentDetail.sort((a, b) => new Date(a.date) - new Date(b.date));

    threadDetail.comments = commentDetail;
    return threadDetail;
  }
}

module.exports = GetThreadDetailUseCase;
