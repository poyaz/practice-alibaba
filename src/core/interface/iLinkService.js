/**
 * Created by pooya on 8/23/21.
 */

class ILinksService {
  /**
   *
   * @param {string} id
   * @return {Promise<(Error|LinkModel)[]>}
   */
   async getById(id) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { id };
    throw error;
  }

  /**
   *
   * @param {Object} [options]
   * @param {number} [options.page=1]
   * @param {number} [options.limit=10]
   * @return {Promise<(Error|Array<LinkModel>|number)[]>}
   */
  async getAll({page = 1, limit = 10} = {}) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { page, limit };
    throw error;
  }

  /**
   *
   * @param {LinkModel} model
   * @return {Promise<(Error|LinkModel)[]>}
   */
  async add(model) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { model };
    throw error;
  }

  /**
   *
   * @param {LinkModel} model
   * @return {Promise<(Error|boolean)[]>}
   */
   async update(model) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { model };
    throw error;
  }

  /**
   *
   * @param {string} id
   * @return {Promise<(Error|boolean)[]>}
   */
   async delete(id) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { model };
    throw error;
  }
}

module.exports = ILinksService;
