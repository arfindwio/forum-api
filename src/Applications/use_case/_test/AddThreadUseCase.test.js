const CreateThread = require("../../../Domains/threads/entities/CreateThread");
const CreatedThread = require("../../../Domains/threads/entities/CreatedThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      owner: "user-123",
      title: "ini title",
      body: "ini body",
    };

    const mockCreatedThread = new CreatedThread({
      id: "thread-123",
      owner: useCasePayload.owner,
      title: useCasePayload.title,
      body: useCasePayload.body,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockCreatedThread));

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(createdThread).toStrictEqual(
      new CreatedThread({
        id: "thread-123",
        owner: useCasePayload.owner,
        title: useCasePayload.title,
        body: useCasePayload.body,
      })
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new CreateThread({
        owner: useCasePayload.owner,
        title: useCasePayload.title,
        body: useCasePayload.body,
      })
    );
  });
});
