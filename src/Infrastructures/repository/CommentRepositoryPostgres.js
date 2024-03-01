const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const CommentDetail = require('../../Domains/comments/entities/CommentDetail');

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
      text: 'INSERT INTO comments(id, owner, thread_id, content, date) VALUES($1, $2, $3, $4, $5) RETURNING id, owner, content',
      values: [id, owner, thread_id, content, date],
    };

    const result = await this._pool.query(query);

    return new CreatedComment(result.rows[0]);
  }

  async checkAvailabilityComment(id, thread_id) {
    const query = {
      text: 'SELECT * FROM comments WHERE thread_id = $1 AND id = $2',
      values: [thread_id, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan ');
    }
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new AuthorizationError('Anda bukan pemilik komentar ini');
    }
  }

  async deleteComment({ id, owner, thread_id }) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1 AND owner = $2 AND thread_id = $3',
      values: [id, owner, thread_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('id tidak ditemukan');
    }
  }

  async getAllCommentsByThreadId(thread_id) {
    const query = {
      text: `SELECT comments.id, users.username, comments.date,
        comments.content, comments.is_deleted FROM comments
        INNER JOIN users ON comments.owner = users.id
        WHERE thread_id = $1`,
      values: [thread_id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyCommentAvailability(comment_id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [comment_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
