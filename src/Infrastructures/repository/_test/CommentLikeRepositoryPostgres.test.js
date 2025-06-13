const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('CommentLikeRepositoryPostgres', () => {
  const userId = 'user-123';
  const threadId = 'thread-123';
  const commentId = 'comment-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
    await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: userId });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async() => {
    await CommentLikesTableTestHelper.cleanTable();
  });
  

  describe('Add Function', () => {
    it('add like correctly', async () => {
      // Arrange
      const repo = new CommentLikeRepositoryPostgres(pool, () => 'xyz');
      const addLike = {
        commentId: commentId,
        userId: userId,
      };
    
      // Act
      await repo.add(addLike);
    
      // Assert
      const commentLikes = await CommentLikesTableTestHelper.findLikeById('comment_like-xyz');
      expect(commentLikes).toHaveLength(1);
    
      const savedCommentLike = commentLikes[0];
      expect(savedCommentLike.id).toBe('comment_like-xyz');
      expect(savedCommentLike.comment_id).toBe('comment-123');
      expect(savedCommentLike.user_id).toBe('user-123');
    });

    it('should throw InvariantError when like already exists', async () => {

      // Arrange
      const repository = new CommentLikeRepositoryPostgres(pool, () => 'xyz');
      await repository.add({ commentId, userId });

      // Act and Assert
      await expect(repository.add({ commentId, userId })).rejects.toThrow(InvariantError);
    });

  });

  describe('Delete Function', () => {
    it('should delete like from database', async () => {
      // Arrange
      const repository = new CommentLikeRepositoryPostgres(pool, () => 'xyz');
      await CommentLikesTableTestHelper.addLike({ commentId, userId });

      // Act
      await repository.delete({ commentId, userId });

      // Assert
      const result = await CommentLikesTableTestHelper.findLikeByCommentIdUserId(commentId, userId);
      expect(result).toHaveLength(0);
    });

    it('should throw NotFoundError when like does not exist', async () => {
      // Arrange
      const repository = new CommentLikeRepositoryPostgres(pool);
      
      // Assert
      await expect(repository.delete({ commentId, userId })).rejects.toThrow(NotFoundError);
    });
  });

  describe('existsByCommentLike function', () => {
    it('should return true when like exists', async () => {
      const repository = new CommentLikeRepositoryPostgres(pool);
      await CommentLikesTableTestHelper.addLike({ commentId, userId });

      const result = await repository.existsByCommentLike({ commentId, userId });
      expect(result).toBe(true);
    });

    it('should return false when like does not exist', async () => {
      const repository = new CommentLikeRepositoryPostgres(pool);

      const result = await repository.existsByCommentLike({ commentId, userId });
      expect(result).toBe(false);
    });
  });

});
