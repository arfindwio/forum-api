const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      owner: 'user-123',
      comment_id: 'comment-123',
    };

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.checkAvailabilityReply = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(payload);

    // Assert
    expect(mockReplyRepository.checkAvailabilityReply).toBeCalledWith(payload.id, payload.comment_id);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(payload.id, payload.owner);
    expect(mockReplyRepository.deleteReply).toBeCalledWith(payload);
  });
});
