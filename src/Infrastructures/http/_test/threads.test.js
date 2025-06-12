const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');

let accessToken;
let userId = 'user-dummy';

describe('/threads endpoint', () => {
  beforeAll(async () => {
    accessToken = await UsersTableTestHelper.getAccessToken(
      {
        id: userId,
        username: 'dicoding',
        password: 'secret',
      }
    );
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should respond 201 and return added thread', async () => {
      // Arrange
      const server = await createServer(container);
  
      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'judul thread',
          body: 'isi thread',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const responseJson = JSON.parse(response.payload);
      
      // Assert
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual('judul thread');
      expect(responseJson.data.addedThread.owner).toEqual(userId)
    });

    it('should respond 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);
  
      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'judul thread',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const responseJson = JSON.parse(response.payload);
      
      // Assert
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toBeNull();
      expect(responseJson.message).not.toEqual('');
    });

    it('should respond 401 when request not contain access token', async () => {
      // Arrange
      const server = await createServer(container);
  
      // Act
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'judul thread',
          body: 'isi thread',
        }
      });
      // Assert
      expect(response.statusCode).toEqual(401);
    });
    
  });

  describe('when GET /threads', () => {
    it('should respond 200 and return thread detail', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: userId });
  
      const server = await createServer(container);
  
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });
  
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toBe(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual('thread-123');
    });

    it('should respond 404 when thread not found', async () =>{
      const server = await createServer(container);
  
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });
  
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toBe(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toBeNull();
      expect(responseJson.message).not.toEqual('');
    });
  });  
});
