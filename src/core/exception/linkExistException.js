class LinkExistException extends Error {
  constructor() {
    super('Your redirect URL exist.');

    this.name = 'LinkExistError';
    this.isOperation = true;
    this.httpCode = 400;
  }
}

module.exports = LinkExistException;
