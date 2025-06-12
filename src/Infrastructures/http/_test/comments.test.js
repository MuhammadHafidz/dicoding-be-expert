const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');

let accessTokenA;
let accessTokenB;
let userIdA = 'user-dummy';
let userIdB = 'user-dummy-2';

describe('/threads/{thread-id}/comments endpoint', () => {
  beforeAll(async () => {
    accessTokenA = await UsersTableTestHelper.getAccessToken(
      {
        id: userIdA,
        password: 'secret',
      }
    );

    accessTokenB = await UsersTableTestHelper.getAccessToken(
      {
        id: userIdB,
        password: 'secret',
      }
    );
  });

  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /threads/{thread-id}/comments', () => {
    it('should respond 201 and return added thread', async () => {
      // Arrange
      const server = await createServer(container);
      
      const threadPayload = {
        id: 'thread-1234',
        title: 'judul thread',
        body: 'isi thread',
        userId: userIdA
      }
      
      await ThreadsTableTestHelper.addThread(threadPayload);
  
      // Act
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments`,
        payload: {
          content: 'Komentar',
        },
        headers: {
          Authorization: `Bearer ${accessTokenA}`,
        },
      });
  
      const responseJson = JSON.parse(response.payload);
      
      // Assert
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual('Komentar');
      expect(responseJson.data.addedComment.owner).toEqual(userIdA)
    });
    
    it('should respond 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);

      const threadPayload = {
        id: 'thread-1234',
        title: 'judul thread',
        body: 'isi thread',
        userId: userIdA
      }
      await ThreadsTableTestHelper.addThread(threadPayload);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments`,
        payload: {
        },
        headers: {
          Authorization: `Bearer ${accessTokenA}`,
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
  
      const threadPayload = {
        id: 'thread-1234',
        title: 'judul thread',
        body: 'isi thread',
        userId: userIdA
      }
      await ThreadsTableTestHelper.addThread(threadPayload);
      
      // Act
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments`,
        payload: {
          content: 'Komentar',
        }
      });
      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should respond 404 when thread not found', async () => {
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: `/threads/thread-random/comments`,
        payload: {
          content: 'Komentar',
        },
        headers: {
          Authorization: `Bearer ${accessTokenA}`,
        },
      });
  
      const responseJson = JSON.parse(response.payload);
      
      // Assert
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toBeNull();
      expect(responseJson.message).not.toEqual('');
    });
    
  });

  describe('when DELETE /threads/{thread-id}/comments/{comment-id}', () => {
    it('should respond 200 and return success message', async () => {
      // Arrange
      const threadPayload = {
        id: 'thread-1234',
        title: 'judul thread',
        body: 'isi thread',
        userId: userIdA
      }
      await ThreadsTableTestHelper.addThread(threadPayload);

      const commentPayload = {
        id: 'comment-123',
        content: 'komentar',
        userId: userIdA,
        threadId: threadPayload.id
      }
      await CommentTableTestHelper.addComment(commentPayload);
  
      // Act
      const server = await createServer(container);
  
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadPayload.id}/comments/${commentPayload.id}`,
        headers: {
          Authorization: `Bearer ${accessTokenA}`,
        }
      });
  
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toBe(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should respond 404 when comment not found', async () =>{
      // Arrange
      const threadPayload = {
        id: 'thread-1234',
        title: 'judul thread',
        body: 'isi thread',
        userId: userIdA
      }
      await ThreadsTableTestHelper.addThread(threadPayload);
  
      // Act
      const server = await createServer(container);
  
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadPayload.id}/comments/randomId`,
        headers: {
          Authorization: `Bearer ${accessTokenA}`,
        }
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toBe(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toBeNull();
      expect(responseJson.message).not.toEqual('');
    });

    it('should respond 401 when request not contain access token', async () => {
      // Arrange
      const threadPayload = {
        id: 'thread-1234',
        title: 'judul thread',
        body: 'isi thread',
        userId: userIdA
      }
      await ThreadsTableTestHelper.addThread(threadPayload);

      const commentPayload = {
        id: 'comment-123',
        content: 'komentar',
        userId: userIdA,
        threadId: threadPayload.id
      }
      await CommentTableTestHelper.addComment(commentPayload);
  
      // Act
      const server = await createServer(container);
  
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadPayload.id}/comments/${commentPayload.id}`
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should return 403 when comment not owned by user', async () => {
      // Arrange
      const threadPayload = {
        id: 'thread-1234',
        title: 'judul thread',
        body: 'isi thread',
        userId: userIdA
      }
      await ThreadsTableTestHelper.addThread(threadPayload);

      const commentPayload = {
        id: 'comment-123',
        content: 'komentar',
        userId: userIdA,
        threadId: threadPayload.id
      }
      await CommentTableTestHelper.addComment(commentPayload);

      // Act
      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadPayload.id}/comments/${commentPayload.id}`,
        headers: {
          Authorization: `Bearer ${accessTokenB}`,
        }
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toBe(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toBeNull();
      expect(responseJson.message).not.toEqual('');
    });
  });  
});
