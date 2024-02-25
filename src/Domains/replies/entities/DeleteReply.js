class DeleteReply {
  constructor(payload) {
    this.verifyPayload(payload);

    const { id, owner, comment_id } = payload;

    this.id = id;
    this.owner = owner;
    this.comment_id = comment_id;
  }

  verifyPayload({ id, owner, comment_id }) {
    if (!id || !owner || !comment_id) {
      throw new Error("DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof id !== "string" || typeof owner !== "string" || typeof comment_id !== "string") {
      throw new Error("DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DeleteReply;
