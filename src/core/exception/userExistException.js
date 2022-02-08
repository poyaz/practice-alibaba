class UserExistException extends Error {
  constructor() {
    super('Your username exist.');

    this.name = 'UserExistError';
    this.isOperation = true;
    this.httpCode = 400;
  }
}

module.exports = UserExistException;
