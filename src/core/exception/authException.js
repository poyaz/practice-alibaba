class AuthException extends Error {
  constructor() {
    super('Authenticate failed.');

    this.name = 'AuthError';
    this.isOperation = true;
    this.httpCode = 401;
  }
}

module.exports = AuthException;
