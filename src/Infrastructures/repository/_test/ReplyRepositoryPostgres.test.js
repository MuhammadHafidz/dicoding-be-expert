const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

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

  describe('addReply', () => {
    it('should persist reply and return AddedReply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', userId: 'user-123' });
    
      const repo = new ReplyRepositoryPostgres(pool, () => 'xyz');
      const newReply = {
        content: 'ini balasan',
        commentId: 'comment-123',
        userId: 'user-123',
      };
    
      // Act
      const result = await repo.addReply(newReply);
    
      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-xyz');
      expect(replies).toHaveLength(1);
    
      const savedReply = replies[0];
      expect(savedReply.id).toBe('reply-xyz');
      expect(savedReply.content).toBe('ini balasan');
      expect(savedReply.comment_id).toBe('comment-123');
      expect(savedReply.user_id).toBe('user-123');
    
      expect(result).toStrictEqual(new AddedReply({
        id: 'reply-xyz',
        content: 'ini balasan',
        user_id: 'user-123',
      }));
    });
  });

  describe('getRepliesByCommentIds', () => {
    it('should return replies grouped by comment ids', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1', userId: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-1', userId: 'user-123' });

      await RepliesTableTestHelper.addReply({ id: 'reply-1', commentId: 'comment-1', userId: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-2', commentId: 'comment-1', userId: 'user-123', deletedAt: new Date() });

      const repo = new ReplyRepositoryPostgres(pool, () => 'dummy');

      const result = await repo.getRepliesByCommentIds(['comment-1']);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('content');
      expect(result[0]).toHaveProperty('username');
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('commentId');
      expect(result[0]).toHaveProperty('isDeleted');
    });

    it('should return empty array if no comment ids are provided', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-1', userId: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-1', userId: 'user-123' });

      await RepliesTableTestHelper.addReply({ id: 'reply-1', commentId: 'comment-1', userId: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-2', commentId: 'comment-1', userId: 'user-123', deletedAt: new Date() });

      const repo = new ReplyRepositoryPostgres(pool, () => 'dummy');

      const result = await repo.getRepliesByCommentIds([]);
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });

  describe('verifyReplyOwner', () => {
    it('should not throw Error if user is the owner of the reply', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-abc' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-abc', userId: 'user-abc' });
      await CommentsTableTestHelper.addComment({ id: 'comment-abc', threadId: 'thread-abc', userId: 'user-abc' });
      await RepliesTableTestHelper.addReply({ id: 'reply-abc', commentId: 'comment-abc', userId: 'user-abc' });
    
      const repo = new ReplyRepositoryPostgres(pool, () => 'dummy');
    
      // Act
      let thrownError = null;
      try {
        await repo.verifyReplyOwner('thread-abc', 'comment-abc', 'reply-abc', 'user-abc');
      } catch (error) {
        thrownError = error;
      }
    
      // Assert
      expect(thrownError).toBeNull();
      expect(thrownError).not.toBeInstanceOf(AuthorizationError);
      expect(thrownError).not.toBeInstanceOf(NotFoundError);
    });
    

    it('should throw AuthorizationError if user is not the owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-x' });
      await UsersTableTestHelper.addUser({ id: 'user-y' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-y', userId: 'user-x' });
      await CommentsTableTestHelper.addComment({ id: 'comment-y', threadId: 'thread-y', userId: 'user-x' });
      await RepliesTableTestHelper.addReply({ id: 'reply-y', commentId: 'comment-y', userId: 'user-x' });

      const repo = new ReplyRepositoryPostgres(pool, () => 'dummy');

      await expect(repo.verifyReplyOwner('thread-y', 'comment-y', 'reply-y', 'user-y')).rejects.toThrow(AuthorizationError);
    });

    it('should throw NotFoundError if reply does not exist', async () => {
      const repo = new ReplyRepositoryPostgres(pool, () => 'dummy');

      await expect(repo.verifyReplyOwner('thread-x', 'comment-x', 'reply-x', 'user-x')).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteReplyById', () => {
    it('should soft delete the reply by setting deleted_at', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-del' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-del', userId: 'user-del' });
      await CommentsTableTestHelper.addComment({ id: 'comment-del', threadId: 'thread-del', userId: 'user-del' });
      await RepliesTableTestHelper.addReply({ id: 'reply-del', commentId: 'comment-del', userId: 'user-del' });

      const repo = new ReplyRepositoryPostgres(pool, () => 'del');

      await repo.deleteReplyById('reply-del');

      const reply = await RepliesTableTestHelper.findReplyById('reply-del');
      expect(reply[0].deleted_at).not.toBeNull();
    });
  });
});
