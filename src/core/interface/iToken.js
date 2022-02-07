/**
 * Created by pooya on 8/23/21.
 */

class IToken {
  /**
   *
   * @param {Object} data
   * @return {string}
   */
  sign(data) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { data };
    throw error;
  }

  /**
   *
   * @param {string} token
   * @return {{}}
   */
  verify(token) {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { token };
    throw error;
  }

  /**
   *
   * @return {Date}
   */
  gregorianCurrentDateWithTimezone() {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = {};
    throw error;
  }

  /**
   *
   * @param {string} [format='YYYY-MM-DD HH:mm:ss']
   * @return {string}
   */
  gregorianCurrentDateWithTimezoneString(format = 'YYYY-MM-DD HH:mm:ss') {
    const error = new Error('The method has to be overridden by subclasses.');
    error['args'] = { format };
    throw error;
  }
}

module.exports = IToken;
