/**
 * Created by pooya on 8/23/21.
 */

class IUserService {
  /**
   *
   * @param {string} id
   * @return {Promise<(Error|UsersModel)[]>}
   */
  async getById(id) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { id };
    throw error;
  }

  /**
   *
   * @param {UsersModel} model
   * @return {Promise<(Error|UsersModel)[]>}
   */
  async add(model) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { model };
    throw error;
  }

  /**
   *
   * @param {UsersModel} username
   * @param {UsersModel} password
   * @return {Promise<(Error|UsersModel)[]>}
   */
  async auth(username, password) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { username, password };
    throw error;
  }
}

module.exports = IUserService;
