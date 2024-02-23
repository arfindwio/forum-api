const CreatedComment = require("../CreatedComment");

describe("a CreatedComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      owner: "user-123",
      content: "ini content",
    };

    // Action and Assert
    expect(() => new CreatedComment(payload)).toThrowError("CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123,
      owner: "user-123",
      content: [],
    };

    // Action and Assert
    expect(() => new CreatedComment(payload)).toThrowError("CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create createdComment object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      owner: "user-123",
      content: "ini content",
    };

    // Action
    const createdComment = new CreatedComment(payload);

    // Assert
    expect(createdComment.id).toEqual(payload.id);
    expect(createdComment.owner).toEqual(payload.owner);
    expect(createdComment.content).toEqual(payload.content);
  });
});
