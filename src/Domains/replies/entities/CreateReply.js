class CreateReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { owner, comment_id, content } = payload;

    this.owner = owner;
    this.comment_id = comment_id;
    this.content = content;
  }

  _verifyPayload({ owner, comment_id, content }) {
    if (!owner || !comment_id || !content) {
      throw new Error("CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof owner !== "string" || typeof comment_id !== "string" || typeof content !== "string") {
      throw new Error("CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CreateReply;
