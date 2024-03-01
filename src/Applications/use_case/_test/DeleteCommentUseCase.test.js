const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
      thread_id: 'thread-123',
    };

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.checkAvailabilityComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(payload);

    // Assert
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(payload.id, payload.thread_id);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(payload.id, payload.owner);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(payload);
  });
});
