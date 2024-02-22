const ThreadDetail = require("../ThreadDetail");

describe("ThreadDetail entities", () => {
  it("should throw error when payload does not contain needed property", () => {
    // Arrange
    const payload = {
      title: "ini title",
    };

    // Action & Assert
    expect(() => new ThreadDetail(payload)).toThrowError("THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY");
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      title: {},
      body: [],
      date: {},
    };

    // Action & Assert
    expect(() => new ThreadDetail(payload)).toThrowError("THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION");
  });

  it("should create ThreadDetail entities correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      username: "username",
      title: "ini title",
      body: "ini body",
      date: "2021-08-08T07:19:09.775Z",
    };

    // Action
    const threadDetail = new ThreadDetail(payload);

    // Assert
    expect(threadDetail).toBeInstanceOf(ThreadDetail);
    expect(threadDetail.id).toEqual(payload.id);
    expect(threadDetail.username).toEqual(payload.username);
    expect(threadDetail.title).toEqual(payload.title);
    expect(threadDetail.body).toEqual(payload.body);
    expect(threadDetail.date).toEqual(payload.date);
  });
});
