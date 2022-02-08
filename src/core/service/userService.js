/**
 * Created by pooya on 2/7/22.
 */

const IUserService = require('~src/core/interface/iUserService');
const AuthException = require('~src/core/exception/authException');
const NotFoundException = require('~src/core/exception/notFoundException');

class UserService extends IUserService {
  /**
   * @type {IUserRepository}
   */
  #usersRepository;

  /**
   *
   * @param {IUserRepository} userRepository
   */
  constructor(userRepository) {
    super();

    this.#usersRepository = userRepository;
  }

  async getById(id) {
    const [error, data] = await this.#usersRepository.getById(id);
    if (error) {
      return [error];
    }
    if (!data) {
      return [new NotFoundException()];
    }

    return [null, data];
  }

  async add(model) {
    return this.#usersRepository.add(model);
  }

  async auth(username, password) {
    const [error, data] = await this.#usersRepository.getUserByUsernameAndPassword(username, password);
    if (error) {
      return [error];
    }
    if (!data) {
      return [new AuthException()];
    }

    return [null, data];
  }
}

module.exports = UserService;
