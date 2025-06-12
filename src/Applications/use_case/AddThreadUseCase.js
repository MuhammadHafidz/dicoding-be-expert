const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(payload, userId) {
    const addThread = new AddThread(payload, userId);
    return await this._threadRepository.addThread(addThread);
  }
}

module.exports = AddThreadUseCase;
