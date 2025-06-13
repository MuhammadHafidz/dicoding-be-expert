const createServer = require('../createServer');
const container = require('../../container');

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  const userId = 'user-123';
  const threadId = 'thread-321';
  const commentId = 'comment-321';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({
      id: threadId,
      title: 'thread test',
      body: 'ini body',
      userId,
    });
    await CommentTableTestHelper.addComment({
      id: commentId,
      content: 'ini komentar',
      userId,
      threadId,
    });
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  it('should respond 200 when like is added', async () => {
    const accessToken = await UsersTableTestHelper.getAccessToken({ id: userId });
    const server = await createServer(container);

    const response = await server.inject({
      method: 'PUT',
      url: `/threads/${threadId}/comments/${commentId}/likes`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toBe(200);
    expect(responseJson.status).toBe('success');
  });

  it('should respond 200 when like is removed (toggle behavior)', async () => {
    const accessToken = await UsersTableTestHelper.getAccessToken({ id: userId });
    const server = await createServer(container);

    // Like first
    await server.inject({
      method: 'PUT',
      url: `/threads/${threadId}/comments/${commentId}/likes`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Then unlike
    const response = await server.inject({
      method: 'PUT',
      url: `/threads/${threadId}/comments/${commentId}/likes`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toBe(200);
    expect(responseJson.status).toBe('success');
  });

  it('should respond 401 when no access token provided', async () => {
    const server = await createServer(container);

    const response = await server.inject({
      method: 'PUT',
      url: `/threads/${threadId}/comments/${commentId}/likes`,
    });

    expect(response.statusCode).toBe(401);
  });

  it('should respond 404 when thread not found', async () => {
    const accessToken = await UsersTableTestHelper.getAccessToken({ id: userId });
    const server = await createServer(container);

    const response = await server.inject({
      method: 'PUT',
      url: `/threads/random-thread-id/comments/${commentId}/likes`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toBe(404);
    expect(responseJson.status).toBe('fail');
  });

  it('should respond 404 when comment not found', async () => {
    const accessToken = await UsersTableTestHelper.getAccessToken({ id: userId });
    const server = await createServer(container);

    const response = await server.inject({
      method: 'PUT',
      url: `/threads/${threadId}/comments/random-comment-id-not-exist/likes`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toBe(404);
    expect(responseJson.status).toBe('fail');
  });
});
