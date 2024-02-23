class CreateComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { owner, thread_id, content } = payload;

    this.owner = owner;
    this.thread_id = thread_id;
    this.content = content;
  }

  _verifyPayload({ owner, thread_id, content }) {
    if (!owner || !thread_id || !content) {
      throw new Error("CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof owner !== "string" || typeof thread_id !== "string" || typeof content !== "string") {
      throw new Error("CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CreateComment;
