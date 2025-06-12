const AddThreadUseCase = require('../AddThreadUseCase');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');


describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly and return AddedThread instance', async () => {
    // Arrange
    const useCasePayload = {
      title: 'judul thread',
      body: 'isi thread',
    };
    const userId = 'user-123';

    const mockAddedThread = new AddedThread({
      id: 'thread-abc',
      title: useCasePayload.title,
      user_id: userId,
    });

    const expectedAddedThread = new AddedThread({
      id: 'thread-abc',
      title: useCasePayload.title,
      user_id: userId,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn().mockResolvedValue(mockAddedThread);

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Act
    const result = await addThreadUseCase.execute(useCasePayload, userId);

    // Assert
    expect(result).toStrictEqual(expectedAddedThread);
    expect(result).toBeInstanceOf(AddedThread);
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith(new AddThread(useCasePayload, userId));
  });
});