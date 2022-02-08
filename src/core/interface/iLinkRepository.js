/**
 * Created by pooya on 8/23/21.
 */

class ILinkRepository {
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
   * @param {FilterModel|null} filter
   * @param {Object} [options]
   * @param {number} [options.page=1]
   * @param {number} [options.limit=10]
   * @return {Promise<(Error|Array<LinkModel>|number)[]>}
   */
  async getAll(filter, { page = 1, limit = 10 } = {}) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { filter, page, limit };
    throw error;
  }

  /**
   *
   * @param {FilterModel|null} filter
   * @return {Promise<(Error|number)[]>}
   */
  async getCount(filter) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { filter };
    throw error;
  }

  /**
   *
   * @param {Array<string>} list
   * @return {Promise<(Error|Array<string>)[]>}
   */
  async checkRedirectUrl(list) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { list };
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
    error['args'] = { id };
    throw error;
  }
}

module.exports = ILinkRepository;
