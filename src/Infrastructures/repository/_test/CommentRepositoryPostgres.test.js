const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment', () => {
    it('should persist comment and return AddedComment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });

      const repo = new CommentRepositoryPostgres(pool, () => '123');
      const payload = {
        content: 'sebuah komentar',
        threadId: 'thread-123',
        userId: 'user-123',
      };

      const result = await repo.addComment(payload);

      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
      expect(result).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: payload.content,
        user_id: payload.userId,
      }));
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return all comments for a thread in CommentDTO format', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'johndoe' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', userId: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-123', userId: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-2', threadId: 'thread-123', userId: 'user-123', deletedAt: new Date() });

      const repo = new CommentRepositoryPostgres(pool, () => 'xyz');
      const comments = await repo.getCommentsByThreadId('thread-123');

      expect(comments).toHaveLength(2);
      expect(comments[0]).toHaveProperty('id');
      expect(comments[0]).toHaveProperty('content');
      expect(comments[0]).toHaveProperty('username');
      expect(comments[0]).toHaveProperty('date');
      expect(comments[0]).toHaveProperty('isDeleted');
      expect(comments[0]).toHaveProperty('likeCount');
      expect(comments[1]).toHaveProperty('id');
      expect(comments[1]).toHaveProperty('content');
      expect(comments[1]).toHaveProperty('username');
      expect(comments[1]).toHaveProperty('date');
      expect(comments[1]).toHaveProperty('isDeleted');
      expect(comments[1]).toHaveProperty('likeCount');
    });
  });

  describe('verifyCommentExist', () => {
    it('should not throw error if comment exists', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-abc' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-abc', userId: 'user-abc' });
      await CommentsTableTestHelper.addComment({ id: 'comment-abc', threadId: 'thread-abc', userId: 'user-abc' });

      const repo = new CommentRepositoryPostgres(pool, () => 'abc');
      // Act
      let thrownError = null;
      try {
        await repo.verifyCommentExist('thread-abc', 'comment-abc')
      } catch (error) {
        thrownError = error;
      }
    
      // Assert
      expect(thrownError).toBeNull(); 
      expect(thrownError).not.toBeInstanceOf(NotFoundError);
    });

    it('should throw NotFoundError if comment not exists', async () => {
      const repo = new CommentRepositoryPostgres(pool, () => 'nope');

      await expect(repo.verifyCommentExist('thread-x', 'comment-x')).rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner', () => {
    it('should throw NotFoundError if comment does not exist', async () => {
      const repo = new CommentRepositoryPostgres(pool, () => 'zzz');
    
      await expect(repo.verifyCommentOwner('thread-x', 'comment-x', 'user-x'))
        .rejects.toThrow(NotFoundError);
    });
    
    it('should not throw error if user is the owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-xyz', username: 'johndoe' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-xyz', userId: 'user-xyz' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-xyz',
        threadId: 'thread-xyz',
        userId: 'user-xyz',
      });
  
      const repo = new CommentRepositoryPostgres(pool, () => 'xyz');

       // Act
       let thrownError = null;
       try {
         await repo.verifyCommentOwner('thread-xyz', 'comment-xyz', 'user-xyz');
       } catch (error) {
         thrownError = error;
       }
     
       // Assert
       expect(thrownError).toBeNull(); 
       expect(thrownError).not.toBeInstanceOf(NotFoundError);
       expect(thrownError).not.toBeInstanceOf(AuthorizationError);
  
    });
  
    it('should throw AuthorizationError if user is not the owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-a', username: 'johndoe A' });
      await UsersTableTestHelper.addUser({ id: 'user-b', username: 'johndoe B'  });
      await ThreadsTableTestHelper.addThread({ id: 'thread-abc', userId: 'user-a' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-abc',
        threadId: 'thread-abc',
        userId: 'user-a',
      });
  
      const repo = new CommentRepositoryPostgres(pool, () => 'abc');
  
      await expect(repo.verifyCommentOwner('thread-abc', 'comment-abc', 'user-b')).rejects.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment', () => {
    it('should soft-delete comment by setting deleted_at', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-del' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-del', userId: 'user-del' });
      await CommentsTableTestHelper.addComment({ id: 'comment-del', threadId: 'thread-del', userId: 'user-del' });

      const repo = new CommentRepositoryPostgres(pool, () => 'del');

      await repo.deleteComment('comment-del');

      const comment = await CommentsTableTestHelper.findCommentById('comment-del');
      expect(comment[0].deleted_at).not.toBeNull();
    });
  });
});
