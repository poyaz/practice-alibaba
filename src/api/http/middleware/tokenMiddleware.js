/**
 * Created by pooya on 8/23/21.
 */

const IHttpMiddleware = require('~src/api/interface/iHttpMiddleware');

const AuthException = require('~src/core/exception/authException');
const ForbiddenException = require('~src/core/exception/forbiddenException');

class TokenMiddleware extends IHttpMiddleware {
  #req;
  #res;
  #jwtToken;

  constructor(req, res, jwtToken) {
    super();

    this.#req = req;
    this.#res = res;
    this.#jwtToken = jwtToken;
  }

  async act() {
    const authHeader = this.#req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new AuthException();
    }

    let data;

    try {
      data = this.#jwtToken.verify(token);
    } catch (error) {
      throw new ForbiddenException();
    }

    if (Object.hasOwnProperty.call((this.#req.params || {}), 'userId')) {
      if (data.userId !== this.#req.params.userId) {
        throw new ForbiddenException();
      }
    }
  }
}

module.exports = TokenMiddleware;
