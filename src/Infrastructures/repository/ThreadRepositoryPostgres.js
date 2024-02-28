const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CreatedThread = require("../../Domains/threads/entities/CreatedThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(createThread) {
    const { owner, title, body } = createThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, owner, title, body",
      values: [id, owner, title, body, date],
    };

    const result = await this._pool.query(query);

    return new CreatedThread(result.rows[0]);
  }

  async getThreadById(thread_id) {
    const query = {
      text: "SELECT threads.id, users.username, threads.title, threads.body, threads.date FROM threads JOIN users ON threads.owner = users.id WHERE threads.id = $1",
      values: [thread_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }

    return result.rows[0];
  }

  async verifyThreadAvailability(thread_id) {
    const query = {
      text: "SELECT id FROM threads WHERE id = $1",
      values: [thread_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }
}

module.exports = ThreadRepositoryPostgres;
