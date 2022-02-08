/**
 * Created by pooya on 8/23/21.
 */

class IUserService {
  /**
   *
   * @param {string} id
   * @return {Promise<(Error|UserModel)[]>}
   */
  async getById(id) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { id };
    throw error;
  }

  /**
   *
   * @param {UserModel} model
   * @return {Promise<(Error|UserModel)[]>}
   */
  async add(model) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { model };
    throw error;
  }

  /**
   *
   * @param {UserModel} username
   * @param {UserModel} password
   * @return {Promise<(Error|UserModel)[]>}
   */
  async auth(username, password) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { username, password };
    throw error;
  }
}

module.exports = IUserService;
