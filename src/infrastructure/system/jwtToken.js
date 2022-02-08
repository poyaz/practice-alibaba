/**
 * Created by pooya on 2/8/22.
 */

const jwt = require('jsonwebtoken');
const IToken = require('~src/core/interface/iToken');

class JwtToken extends IToken {
  /**
   * @type {string}
   */
  #secret;

  /**
   *
   * @param {string} secret
   */
  constructor(secret) {
    super();

    this.#secret = secret;
  }

  sign(data) {
    return jwt.sign(data, this.#secret, {});
  }

  verify(token) {
    return jwt.verify(token, this.#secret);
  }
}

module.exports = JwtToken;
