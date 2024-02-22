class ThreadDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, title, body, date } = payload;

    this.id = id;
    this.username = username;
    this.title = title;
    this.body = body;
    this.date = date;
  }

  _verifyPayload({ id, title, username, body, date }) {
    if (!id || !username || !title || !body || !date) {
      throw new Error("THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof id !== "string" || typeof username !== "string" || typeof title !== "string" || typeof body !== "string" || typeof date !== "string") {
      throw new Error("THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = ThreadDetail;
