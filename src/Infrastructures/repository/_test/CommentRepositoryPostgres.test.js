const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist create comment and return created comment correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'username',
        password: 'secret',
        fullname: 'ini fullname',
      });

      const createThread = new CreateThread({
        owner: 'user-123',
        title: 'ini title',
        body: 'ini body',
      });

      const createComment = new CreateComment({
        owner: 'user-123',
        thread_id: 'thread-123',
        content: 'ini content',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(createThread);
      await commentRepositoryPostgres.addComment(createComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return created user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'username',
        password: 'secret',
        fullname: 'ini fullname',
      });

      const createThread = new CreateThread({
        owner: 'user-123',
        title: 'ini title',
        body: 'ini body',
      });

      const createComment = new CreateComment({
        owner: 'user-123',
        thread_id: 'thread-123',
        content: 'ini content',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(createThread);
      const createdComment = await commentRepositoryPostgres.addComment(createComment);

      // Assert
      expect(createdComment).toStrictEqual(
        new CreatedComment({
          id: 'comment-123',
          owner: 'user-123',
          content: 'ini content',
        }),
      );
    });
  });

  describe('checkAvailabilityComment function', () => {
    it("It should raise a 'notFound' error when the item is not found", async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action dan Assert
      await expect(commentRepository.checkAvailabilityComment('comment-123', 'thread-123')).rejects.toThrow(NotFoundError);
    });

    it('Do not raise an error when a comment is found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      // Action & Assert
      await expect(commentRepository.checkAvailabilityComment('comment-123', 'thread-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it("It should raise a 'AuthorizationError' error when the item is AuthorizationError", async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action dan Assert
      await expect(commentRepository.verifyCommentOwner('comment-123', 'user-1234')).rejects.toThrow(AuthorizationError);
    });

    it("Don't raise an error when the comment is the owner", async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });

      // Action & Assert
      await expect(commentRepository.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment dan verifyCommentOwner function', () => {
    it('It should raise an AuthorizationError when the owner and the user do not match', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action dan Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-1234')).rejects.toThrowError(AuthorizationError);
    });

    it('Must raise an invariant error', async () => {
      // Arrange
      const payload = {
        id: 'comment-123',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action dan Assert
      await expect(commentRepositoryPostgres.deleteComment(payload)).rejects.toThrowError(NotFoundError);
    });

    it('Should successfully delete comment', async () => {
      // Arrange
      const payload = {
        id: 'comment-123',
        owner: 'user-123',
        thread_id: 'thread-123',
      };
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      await commentRepositoryPostgres.deleteComment(payload);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById(payload.id);
      expect(comments[0].is_deleted).toEqual(true);
    });
  });

  describe('getAllCommentsByThreadId function', () => {
    it('Should be able to display multiple comments', async () => {
      // Arrange

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ date: '27 Februari 2024' });

      // Action
      const comments = await commentRepositoryPostgres.getAllCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments).toEqual([
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '27 Februari 2024',
          content: 'ini content',
          is_deleted: false,
        },
      ]);
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw NotFoundError when thread not available', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread available', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });
});
