const CreateThread = require('../../Domains/threads/entities/CreateThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const createThread = new CreateThread(useCasePayload);
    return this._threadRepository.addThread(createThread);
  }
}

module.exports = AddThreadUseCase;
