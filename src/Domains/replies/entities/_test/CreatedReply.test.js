const CreatedReply = require('../CreatedReply');

describe('a CreatedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      content: 'ini content',
    };

    // Action and Assert
    expect(() => new CreatedReply(payload)).toThrowError('CREATED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      owner: 'user-123',
      content: [],
    };

    // Action and Assert
    expect(() => new CreatedReply(payload)).toThrowError('CREATED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create createdReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      owner: 'user-123',
      content: 'ini content',
    };

    // Action
    const createdReply = new CreatedReply(payload);

    // Assert
    expect(createdReply.id).toEqual(payload.id);
    expect(createdReply.owner).toEqual(payload.owner);
    expect(createdReply.content).toEqual(payload.content);
  });
});
