class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(thread_id) {
    const threadDetail = await this._threadRepository.getThreadById(thread_id);
    const comments = await this._commentRepository.getAllCommentsByThreadId(thread_id);
    const replies = await this._replyRepository.getAllRepliesByThreadId(thread_id);

    const allCommentsWithReplies = comments.map((comment) => {
      const commentReplies = replies.filter((reply) => reply.comment_id === comment.id);
      return {
        id: comment.id,
        username: comment.username,
        content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
        date: comment.date,
        replies: commentReplies.map((reply) => ({
          id: reply.id,
          username: reply.username,
          content: reply.is_deleted ? '**balasan telah dihapus**' : reply.content,
          date: reply.date,
        })),
      };
    });

    const sortedCommentsWithReplies = allCommentsWithReplies.sort((a, b) => new Date(a.date) - new Date(b.date));

    threadDetail.comments = sortedCommentsWithReplies;

    return threadDetail;
  }
}

module.exports = GetThreadDetailUseCase;
