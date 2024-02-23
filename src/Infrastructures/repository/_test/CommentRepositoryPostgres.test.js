const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const CreateComment = require("../../../Domains/comments/entities/CreateComment");
const CreateThread = require("../../../Domains/threads/entities/CreateThread");
const RegisterUser = require("../../../Domains/users/entities/RegisterUser");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UserRepositoryPostgres = require("../UserRepositoryPostgres");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist create comment and return created comment correctly", async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: "username",
        password: "secret",
        fullname: "ini fullname",
      });

      const createThread = new CreateThread({
        owner: "user-123",
        title: "ini title",
        body: "ini body",
      });

      const createComment = new CreateComment({
        owner: "user-123",
        thread_id: "thread-123",
        content: "ini content",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(createThread);
      await commentRepositoryPostgres.addComment(createComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById("comment-123");
      expect(comments).toHaveLength(1);
    });
  });

  // describe("getAllCommentsByThreadId function", () => {
  //   it("Should be able to display multiple comments", async () => {
  //     // Arrange
  //     const id = "comment-123";

  //     const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
  //     await UsersTableTestHelper.addUser({});
  //     await ThreadsTableTestHelper.addThread({});
  //     await CommentsTableTestHelper.addComment({});
  //     await CommentsTableTestHelper.addComment({ id });

  //     // Action
  //     const comments = await commentRepositoryPostgres.getAllCommentsByThreadId("thread-123");

  //     // Assert
  //     expect(comments).toHaveLength(2);
  //   });
  // });
});
