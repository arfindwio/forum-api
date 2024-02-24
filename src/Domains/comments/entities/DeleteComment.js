class DeleteComment {
  constructor(payload) {
    this.verifyPayload(payload);

    const { id, owner, thread_id } = payload;

    this.id = id;
    this.owner = owner;
    this.thread_id = thread_id;
  }

  verifyPayload({ id, owner, thread_id }) {
    if (!id || !owner || !thread_id) {
      throw new Error("DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof id !== "string" || typeof owner !== "string" || typeof thread_id !== "string") {
      throw new Error("DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = DeleteComment;
