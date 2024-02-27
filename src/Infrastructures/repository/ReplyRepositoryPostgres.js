const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CreatedReply = require("../../Domains/replies/entities/CreatedReply");
const ReplyRepository = require("../../Domains/replies/ReplyRepository");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(createReply) {
    const { owner, comment_id, content } = createReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: "INSERT INTO replies(id, owner, comment_id, content, date) VALUES($1, $2, $3, $4, $5) RETURNING id, owner, content",
      values: [id, owner, comment_id, content, date],
    };
    ``;

    const result = await this._pool.query(query);

    return new CreatedReply({ ...result.rows[0] });
  }

  async getReplyDetail(id, comment_id) {
    const query = {
      text: "SELECT * FROM replies WHERE comment_id = $1 AND id = $2",
      values: [comment_id, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("reply tidak ditemukan ");
    }
  }

  async getReplyOwner(id, owner) {
    const query = {
      text: "SELECT owner FROM replies WHERE id = $1 AND owner = $2",
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new AuthorizationError("Anda bukan pemilik balasan ini");
    }
  }

  async deleteReply({ id, owner, comment_id }) {
    const query = {
      text: "UPDATE replies SET is_deleted = true WHERE id = $1 AND owner = $2 AND comment_id = $3",
      values: [id, owner, comment_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("id tidak ditemukan");
    }
  }

  async getAllRepliesByCommentId(comment_id) {
    const query = {
      text: `SELECT replies.id, users.username, replies.date,
        replies.content, replies.is_deleted FROM replies
        INNER JOIN users ON replies.owner = users.id
        WHERE comment_id = $1`,
      values: [comment_id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
