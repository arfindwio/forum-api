const DeleteReply = require('../DeleteReply');

describe('a DeleteReply entities', () => {
  it('Should return an error when required data is missing', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      comment_id: 'comment-123',
    };

    // Action dan Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('Should raise an error when the required data type is not met', () => {
    // Arrange
    const payload = {
      id: true,
      owner: [],
      comment_id: {},
    };

    // Action dan Assert
    expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('Should create a new reply accordingly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      owner: 'user-123',
      comment_id: 'comment-123',
    };

    // Action
    const deleteReply = new DeleteReply(payload);

    // Assert
    expect(deleteReply.id).toEqual(payload.id);
    expect(deleteReply.owner).toEqual(payload.owner);
    expect(deleteReply.comment_id).toEqual(payload.comment_id);
  });
});
