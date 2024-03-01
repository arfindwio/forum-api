const CreateReply = require('../CreateReply');

describe('a CreateReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 123,
      thread_id: [],
      comment_id: {},
      content: true,
    };

    // Action and Assert
    expect(() => new CreateReply(payload)).toThrowError('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create createReply object correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      thread_id: 'thread-123',
      comment_id: 'comment-123',
      content: 'ini content',
    };

    // Action
    const createReply = new CreateReply(payload);

    // Assert
    expect(createReply.owner).toEqual(payload.owner);
    expect(createReply.thread_id).toEqual(payload.thread_id);
    expect(createReply.comment_id).toEqual(payload.comment_id);
    expect(createReply.content).toEqual(payload.content);
  });
});
