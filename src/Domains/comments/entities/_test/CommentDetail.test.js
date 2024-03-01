const CommentDetail = require('../CommentDetail');

describe('a CommentDetail entities', () => {
  it('Should throw an error when there is an empty property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
    };

    // Action dan Assert
    expect(() => new CommentDetail(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('It should raise an error when there is a mismatched data type', () => {
    // Arrange
    const payload = {
      id: [],
      username: 123,
      content: true,
      date: {},
    };

    // Action dan Assert
    expect(() => new CommentDetail(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('Should successfully display comment details accurately', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      content: 'ini content',
      date: '2024-02-24T05:09:27.935Z',
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.content).toEqual(payload.content);
    expect(commentDetail.date).toEqual(payload.date);
  });
});
