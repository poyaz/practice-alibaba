class LoginException extends Error {
  constructor() {
    super('Username or password incorrect.');

    this.name = 'LoginError';
    this.isOperation = true;
    this.httpCode = 401;
  }
}

module.exports = LoginException;
