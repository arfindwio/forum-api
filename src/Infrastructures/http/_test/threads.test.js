const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");

describe("/threads endpoint", () => {
  const registerUser = async () => {
    const requestPayload = {
      username: "username",
      password: "secret",
      fullname: "ini fullname",
    };

    const server = await createServer(container);

    // Add a new user
    await server.inject({
      method: "POST",
      url: "/users",
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
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("when POST /threads", () => {
    it("should return response code 201 and add a new thread", async () => {
      const server = await createServer(container);

      const responseAuth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "username",
          password: "secret",
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      // Arrange
      const requestPayload = {
        title: "ini title",
        body: "ini body",
      };

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it("should respond with 400 when payload does not contain all properties", async () => {
      const server = await createServer(container);

      const responseAuth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "username",
          password: "secret",
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      // Arrange
      const requestPayload = {
        body: "ini body",
      };

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada");
    });

    it("should respond with 400 when payload has invalid data types", async () => {
      const server = await createServer(container);

      const responseAuth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "username",
          password: "secret",
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      // Arrange
      const requestPayload = {
        title: true,
        body: {},
      };

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("tidak dapat membuat thread baru karena tipe data tidak sesuai");
    });

    it("should respond with 401 when missing authorization", async () => {
      // Arrange
      const requestPayload = {
        title: "ini title",
        body: "ini body",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual("Missing authentication");
    });
  });

  describe("when GET /threads", () => {
    it("should return response code 200", async () => {
      const server = await createServer(container);

      const responseAuth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "username",
          password: "secret",
        },
      });

      const responseAuthJson = JSON.parse(responseAuth.payload);

      // Arrange
      const requestPayload = {
        title: "ini title",
        body: "ini body",
      };

      // Action
      const responseThread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${responseAuthJson.data.accessToken}`,
        },
      });

      // Assert
      const responseThreadJson = JSON.parse(responseThread.payload);

      const response = await server.inject({
        method: "GET",
        url: `/threads/${responseThreadJson.data.addedThread.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
    });

    it("should respond with 404", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/threads/999",
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan");
    });
  });
});
