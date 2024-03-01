const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreateReply = require('../../../Domains/replies/entities/CreateReply');
const CreatedReply = require('../../../Domains/replies/entities/CreatedReply');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist create reply and return created reply correctly', async () => {
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

      const createReply = new CreateReply({
        owner: 'user-123',
        thread_id: 'thread-123',
        comment_id: 'comment-123',
        content: 'ini content',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(createThread);
      await commentRepositoryPostgres.addComment(createComment);
      await replyRepositoryPostgres.addReply(createReply);

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(1);
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

      const createReply = new CreateReply({
        owner: 'user-123',
        thread_id: 'thread-123',
        comment_id: 'comment-123',
        content: 'ini content',
      });

      const fakeIdGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);
      await threadRepositoryPostgres.addThread(createThread);
      await commentRepositoryPostgres.addComment(createComment);
      const createdReply = await replyRepositoryPostgres.addReply(createReply);

      // Assert
      expect(createdReply).toStrictEqual(
        new CreatedReply({
          id: 'reply-123',
          owner: 'user-123',
          content: 'ini content',
        }),
      );
    });
  });

  describe('checkAvailabilityReply function', () => {
    it("It should raise a 'notFound' error when the item is not found", async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action dan Assert
      await expect(replyRepository.checkAvailabilityReply('reply-123', 'comment-123')).rejects.toThrow(NotFoundError);
    });

    it('Do not raise an error when a reply is found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });

      // Action & Assert
      await expect(replyRepository.checkAvailabilityReply('reply-123', 'comment-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it("It should raise a 'AuthorizationError' error when the item is AuthorizationError", async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action dan Assert
      await expect(replyRepository.verifyReplyOwner('reply-123', 'user-1234')).rejects.toThrow(AuthorizationError);
    });

    it("Don't raise an error when the comment is the owner", async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123' });

      // Action & Assert
      await expect(replyRepository.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReply dan verifyReplyOwner function', () => {
    it('It should raise an AuthorizationError when the owner and the user do not match', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      // Action dan Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-1234')).rejects.toThrowError(AuthorizationError);
    });

    it('Must raise an invariant error', async () => {
      // Arrange
      const payload = {
        id: 'reply-123',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      // Action dan Assert
      await expect(replyRepositoryPostgres.deleteReply(payload)).rejects.toThrowError(NotFoundError);
    });

    it('Should successfully delete reply', async () => {
      // Arrange
      const payload = {
        id: 'reply-123',
        owner: 'user-123',
        comment_id: 'comment-123',
      };
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      // Action
      await replyRepositoryPostgres.deleteReply(payload);

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById(payload.id);
      expect(replies[0].is_deleted).toEqual(true);
    });
  });

  describe('getAllRepliesByThreadId function', () => {
    it('Should be able to display multiple replies', async () => {
      // Arrange

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({ date: '27 Februari 2024' });

      // Action
      const replies = await replyRepositoryPostgres.getAllRepliesByThreadId('thread-123');

      // Assert
      expect(replies).toHaveLength(1);
      expect(replies).toEqual([
        {
          id: 'reply-123',
          username: 'dicoding',
          date: '27 Februari 2024',
          content: 'ini content',
          is_deleted: false,
          comment_id: 'comment-123',
        },
      ]);
    });
  });
});
