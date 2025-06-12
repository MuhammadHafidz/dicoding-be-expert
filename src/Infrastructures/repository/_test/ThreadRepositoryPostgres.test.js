const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const Thread = require('../../../Domains/threads/entities/Thread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');


describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread', () => {
    it('should persist thread and return AddedThread correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });

      const newThread = {
        title: 'Sebuah judul',
        body: 'Sebuah body',
        userId: 'user-123',
      };

      // Act
      const addedThread = await threadRepository.addThread(newThread);

      // Assert
      const threadInDb = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threadInDb).toHaveLength(1);
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: newThread.title,
        user_id: newThread.userId,
      }));
    });
  });

  describe('verifyThreadExists', () => {
    it('should not throw error when thread exists', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-1' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-001', userId: 'user-1' });

      const repo = new ThreadRepositoryPostgres(pool, () => '001');

       // Act
       let thrownError = null;
       try {
         await repo.verifyThreadExists('thread-001')
       } catch (error) {
         thrownError = error;
       }
     
       // Assert
       expect(thrownError).toBeNull(); // Tidak ada error yang dilempar
       expect(thrownError).not.toBeInstanceOf(NotFoundError);
    });

    it('should throw NotFoundError when thread does not exist', async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, () => '999');

      await expect(threadRepository.verifyThreadExists('thread-999')).rejects.toThrow(NotFoundError);
    });
  });

  describe('findThreadById', () => {
    it('should return Thread entity correctly when thread exists', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-randomId', username: 'dicoding' });

      const threadData = {
        id: 'thread-randomId',
        title: 'Judul',
        body: 'Isi thread',
        createdAt: new Date(),
        userId: 'user-randomId',
      };
      await ThreadsTableTestHelper.addThread(threadData);

      const threadRepository = new ThreadRepositoryPostgres(pool, () => 'randomId');
      const thread = await threadRepository.findThreadById('thread-randomId');

      expect(thread).toBeInstanceOf(Thread);
      expect(thread.id).toBe('thread-randomId');
      expect(thread.title).toBe(threadData.title);
      expect(thread.body).toBe(threadData.body);
      expect(thread.date).toBe(threadData.createdAt.toISOString());
      expect(thread.username).toBe('dicoding');
    });

    it('should throw NotFoundError when thread is not found', async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, () => 'notfound');

      await expect(threadRepository.findThreadById('thread-notfound')).rejects.toThrow(NotFoundError);
    });
    
  });
});