const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
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
      const comments = await CommentsTableTestHelper.getCommentById("comment-123");
      expect(comments).toHaveLength(1);
    });
  });

  describe("getCommentDetail function", () => {
    it("It should raise a 'notFound' error when the item is not found", async () => {
      // Arrange
      const fakeIdGenerator = () => "123";
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action dan Assert
      await expect(commentRepository.getCommentDetail("comment-123", "thread-123")).rejects.toThrow(NotFoundError);
    });

    it("Do not raise an error when a comment is found", async () => {
      // Arrange
      const fakeIdGenerator = () => "123";
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: "comment-123" });

      // Action & Assert
      await expect(commentRepository.getCommentDetail("comment-123", "thread-123")).resolves.not.toThrow(NotFoundError);
    });
  });

  describe("deleteComment dan getCommentOwner function", () => {
    it("It should raise an AuthorizationError when the owner and the user do not match", async () => {
      // Arrange
      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action dan Assert
      await expect(commentRepositoryPostgres.getCommentOwner("comment-123", "user-1234")).rejects.toThrowError(AuthorizationError);
    });

    it("Must raise an invariant error", async () => {
      // Arrange
      const payload = {
        id: "comment-123",
        owner: "user-123",
      };
      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action dan Assert
      await expect(commentRepositoryPostgres.deleteComment(payload)).rejects.toThrowError(NotFoundError);
    });

    it("Should successfully delete comment", async () => {
      // Arrange
      const payload = {
        id: "comment-123",
        owner: "user-123",
        thread_id: "thread-123",
      };
      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      await commentRepositoryPostgres.deleteComment(payload);

      // Assert
      const comments = await CommentsTableTestHelper.getCommentById(payload.id);
      expect(comments).toHaveLength(1);
    });
  });

  describe("getAllCommentsByThreadId function", () => {
    it("Should be able to display multiple comments", async () => {
      // Arrange

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({ id: "comment-1234" });

      // Action
      const comments = await commentRepositoryPostgres.getAllCommentsByThreadId("thread-123");

      // Assert
      expect(comments).toHaveLength(2);
    });
  });
});
