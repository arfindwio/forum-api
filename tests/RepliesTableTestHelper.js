/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

/* eslint-disable camelcase */
const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', comment_id = 'comment-123', owner = 'user-123', content = 'ini content', date = new Date().toISOString,
  }) {
    const query = {
      text: 'INSERT INTO replies(id, owner, comment_id, content, date) VALUES($1, $2, $3, $4, $5)',
      values: [id, owner, comment_id, content, date],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
