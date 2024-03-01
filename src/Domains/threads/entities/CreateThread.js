class CreateThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { owner, title, body } = payload;

    this.owner = owner;
    this.title = title;
    this.body = body;
  }

  _verifyPayload({ owner, title, body }) {
    if (!owner || !title || !body) {
      throw new Error('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateThread;
