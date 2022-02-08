/**
 * Created by pooya on 8/23/21.
 */

class IUserRepository {
  /**
   *
   * @param {string} id
   * @return {Promise<(Error|UserModel|null)[]>}
   */
  async getById(id) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { id };
    throw error;
  }

  /**
   *
   * @param {string} username
   * @param {string} password
   * @return {Promise<(Error|UserModel|null)[]>}
   */
  async getUserByUsernameAndPassword(username, password) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { username, password };
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
}

module.exports = IUserRepository;
