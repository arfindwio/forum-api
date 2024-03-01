const DeleteComment = require('../DeleteComment');

describe('a DeleteComment entities', () => {
  it('Should return an error when required data is missing', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      thread_id: 'thread-123',
    };

    // Action dan Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('Should raise an error when the required data type is not met', () => {
    // Arrange
    const payload = {
      id: true,
      owner: [],
      thread_id: {},
    };

    // Action dan Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('Should create a new comment accordingly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      thread_id: 'thread-123',
    };

    // Action
    const deleteComment = new DeleteComment(payload);

    // Assert
    expect(deleteComment.id).toEqual(payload.id);
    expect(deleteComment.owner).toEqual(payload.owner);
    expect(deleteComment.thread_id).toEqual(payload.thread_id);
  });
});
