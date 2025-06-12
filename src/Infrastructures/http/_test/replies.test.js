const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');

let accessTokenA;
let accessTokenB;
let userIdA = 'user-dummy';
let userIdB = 'user-dummy-2';

const threadPayload = {
  id: 'thread-1234',
  title: 'judul thread',
  body: 'isi thread',
  userId: userIdA
}

const commentPayload = {
  id: 'comment-123',
  content: 'komentar',
  userId: userIdA,
  threadId: threadPayload.id
}


describe('/threads/{thread-id}/comments/{comments-id}/replies endpoint', () => {
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

    await ThreadsTableTestHelper.addThread(threadPayload);
    await CommentTableTestHelper.addComment(commentPayload);
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /threads/{thread-id}/comments', () => {
    it('should respond 201 and return added thread', async () => {
      // Arrange
      const server = await createServer(container);
  
      // Act
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments/${commentPayload.id}/replies`,
        payload: {
          content: 'Reply',
        },
        headers: {
          Authorization: `Bearer ${accessTokenA}`,
        },
      });
  
      const responseJson = JSON.parse(response.payload);
      
      // Assert
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toEqual('Reply');
      expect(responseJson.data.addedReply.owner).toEqual(userIdA)
    });
    
    it('should respond 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments/${commentPayload.id}/replies`,
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
      
      // Act
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments/${commentPayload.id}/replies`,
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
        url: `/threads/thread-random/comments/${commentPayload.id}/replies`,
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

    it('should respond 404 when comment not found', async () => {
      const server = await createServer(container);

      // Act
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadPayload.id}/comments/random-id/replies`,
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

  describe('when DELETE /threads/{thread-id}/comments/{comment-id}/replies/{reply-id}', () => {
    it('should respond 200 and return success message', async () => {
      // Arrange
      
      const replyPayload = {
        id: 'reply-123',
        content: 'komentar',
        userId: userIdA,
        commentId: commentPayload.id
      }
      await RepliesTableTestHelper.addReply(replyPayload);
  
      // Act
      const server = await createServer(container);
  
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadPayload.id}/comments/${commentPayload.id}/replies/${replyPayload.id}`,
        headers: {
          Authorization: `Bearer ${accessTokenA}`,
        }
      });
  
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toBe(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should respond 404 when comment not found', async () =>{
  
      // Act
      const server = await createServer(container);
  
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadPayload.id}/comments/${commentPayload.id}/replies/randomId`,
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
      
      const replyPayload = {
        id: 'reply-123',
        content: 'komentar',
        userId: userIdA,
        commentId: commentPayload.id
      }
      await RepliesTableTestHelper.addReply(replyPayload);
  
      // Act
      const server = await createServer(container);
  
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadPayload.id}/comments/${commentPayload.id}/replies/${replyPayload.id}`,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should return 403 when reply not owned by user', async () => {
      // Arrange
      
      const replyPayload = {
        id: 'reply-123',
        content: 'komentar',
        userId: userIdA,
        commentId: commentPayload.id
      }
      await RepliesTableTestHelper.addReply(replyPayload);
  
      // Act
      const server = await createServer(container);
  
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadPayload.id}/comments/${commentPayload.id}/replies/${replyPayload.id}`,
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
