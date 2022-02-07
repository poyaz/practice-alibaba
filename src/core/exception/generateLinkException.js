class GenerateLinkException extends Error {
  constructor() {
    super('Can not generate random link.');

    this.name = 'GenerateLinkError';
    this.isOperation = false;
    this.httpCode = 400;
  }
}

module.exports = GenerateLinkException;
