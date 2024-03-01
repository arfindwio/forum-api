const ReplyDetail = require('../ReplyDetail');

describe('a ReplyDetail entities', () => {
  it('Should throw an error when there is an empty property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
    };

    // Action dan Assert
    expect(() => new ReplyDetail(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
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
    expect(() => new ReplyDetail(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('Should successfully display reply details accurately', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      content: 'ini content',
      date: '2024-02-24T05:09:27.935Z',
    };

    // Action
    const replyDetail = new ReplyDetail(payload);

    // Assert
    expect(replyDetail.id).toEqual(payload.id);
    expect(replyDetail.username).toEqual(payload.username);
    expect(replyDetail.content).toEqual(payload.content);
    expect(replyDetail.date).toEqual(payload.date);
  });
});
