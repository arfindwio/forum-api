const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");

describe("/threads endpoint", () => {
  let accessToken;

  // Function to add a user and get access token
  async function addUserAndGetAccessToken({ username = "username", password = "secret", fullname = "fullname" }) {
    const request = {
      username,
      password,
    };

    const server = await createServer(container);

    // Add a new user
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username,
        password,
        fullname,
      },
    });

    // Perform login to get access token
    const response = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: request,
    });

    const responseJson = JSON.parse(response.payload);
    return `Bearer ${responseJson.data.accessToken}`;
  }

  beforeAll(async () => {
    // Get access token before all tests
    accessToken = await addUserAndGetAccessToken({});
  });

  afterAll(async () => {
    // Clean up tables and close database connection after all tests
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("when POST /threads", () => {
    it("should return response code 201 and add a new thread", async () => {
      // Arrange
      const request = {
        title: "example title",
        body: "example body",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: request,
        headers: {
          authorization: accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it("should respond with 400 when payload does not contain all properties", async () => {
      // Arrange
      const request = {
        title: "example title",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: request,
        headers: {
          authorization: accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada");
    });

    it("should respond with 400 when payload has invalid data types", async () => {
      // Arrange
      const request = {
        title: true,
        body: {},
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: request,
        headers: {
          authorization: accessToken,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("tidak dapat membuat user baru karena tipe data tidak sesuai");
    });

    it("should respond with 401 when missing authorization", async () => {
      // Arrange
      const request = {
        title: "example title",
        body: "example body",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: request,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual("Missing authentication");
    });
  });
});
