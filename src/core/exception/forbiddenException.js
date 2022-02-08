class ForbiddenException extends Error {
  constructor() {
    super('Forbidden.');

    this.name = 'ForbiddenError';
    this.isOperation = true;
    this.httpCode = 403;
  }
}

module.exports = ForbiddenException;
