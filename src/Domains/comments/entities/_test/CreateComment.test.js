const CreateComment = require('../CreateComment');

describe('a CreateComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 123,
      thread_id: {},
      content: true,
    };

    // Action and Assert
    expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create createComment object correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      thread_id: 'thread-123',
      content: 'ini content',
    };

    // Action
    const { owner, thread_id, content } = new CreateComment(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(thread_id).toEqual(payload.thread_id);
    expect(content).toEqual(payload.content);
  });
});
