const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const CreateThread = require("../../../Domains/threads/entities/CreateThread");
const RegisterUser = require("../../../Domains/users/entities/RegisterUser");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UserRepositoryPostgres = require("../UserRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist create thread and return created thread correctly", async () => {
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

      const fakeIdGenerator = () => "123"; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(createThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById("thread-123");
      expect(threads).toHaveLength(1);
    });
  });

  describe("getThreadById function", () => {
    it("Must raise a not found error if the ID is not found", async () => {
      // Arrange
      const fakeIdGenerator = () => "123";
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action dan Assert
      expect(threadRepository.getThreadById("thread-123")).rejects.toThrowError(NotFoundError);
    });

    it("Should be able to retrieve a thread based on its ID if the ID is found in the database", async () => {
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

      const fakeIdGenerator = () => "123";
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(createThread);

      // Assert
      const result = await threadRepositoryPostgres.getThreadById("thread-123");
      expect(result.id).toEqual("thread-123");
      expect(result.username).toEqual(registerUser.username);
      expect(result.title).toEqual(createThread.title);
      expect(result.body).toEqual(createThread.body);
      expect(result.date).toBeDefined();
    });
  });
});
