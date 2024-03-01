const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/comments endpoint', () => {
  const registerUser = async () => {
    const requestPayload = {
      username: 'username',
      password: 'secret',
      fullname: 'ini fullname',
    };

    const server = await createServer(container);

    // Add a new user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });
  };

  beforeAll(async () => {
    await registerUser();
  });

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should return response code 201 and add a new comment', async () => {
      const server = await createServer(container);

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'username',
          password: 'secret',
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'ini title',
          body: 'ini body',
        },
        headers: {
          authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);

      const requestPayload = {
        content: 'ini content',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should respond with 400 when payload does not contain all properties', async () => {
      const server = await createServer(container);

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'username',
          password: 'secret',
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'ini title',
          body: 'ini body',
        },
        headers: {
          authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);

      const requestPayload = {
        content: '',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should respond with 400 when payload has invalid data types', async () => {
      const server = await createServer(container);

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'username',
          password: 'secret',
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'ini title',
          body: 'ini body',
        },
        headers: {
          authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);

      const requestPayload = {
        content: true,
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
    });

    it('should respond with 401 when missing authorization', async () => {
      const server = await createServer(container);

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'username',
          password: 'secret',
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'ini title',
          body: 'ini body',
        },
        headers: {
          authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);

      const requestPayload = {
        content: 'ini content',
      };

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should return response code 200', async () => {
      const server = await createServer(container);

      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'username',
          password: 'secret',
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'ini title',
          body: 'ini body',
        },
        headers: {
          authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      const responseThreadJson = JSON.parse(responseThread.payload);

      const requestPayload = {
        content: 'ini content',
      };

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      const responseCommentJson = JSON.parse(responseComment.payload);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}`,
        headers: {
          authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
