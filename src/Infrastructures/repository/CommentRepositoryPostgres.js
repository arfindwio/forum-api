const InvariantError = require("../../Commons/exceptions/InvariantError");
const CreatedComment = require("../../Domains/comments/entities/CreatedComment");
const CommentRepository = require("../../Domains/comments/CommentRepository");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(createComment) {
    const { owner, thread_id, content } = createComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: "INSERT INTO comments(id, owner, thread_id, content, date) VALUES($1, $2, $3, $4, $5) RETURNING id, owner, content",
      values: [id, owner, thread_id, content, date],
    };

    const result = await this._pool.query(query);

    return new CreatedComment({ ...result.rows[0] });
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, users.username, comments.date,
        comments.content, comments.is_deleted FROM comments
        INNER JOIN users ON comments.owner = users.id
        WHERE thread_id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
