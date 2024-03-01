const CreateThread = require('../CreateThread');

describe('a CreateThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      title: 'ini title',
    };

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      owner: 123,
      title: true,
      body: {},
    };

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create createThread object correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      title: 'ini title',
      body: 'ini body',
    };

    // Action
    const { owner, title, body } = new CreateThread(payload);

    // Assert
    expect(owner).toEqual(payload.owner);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
