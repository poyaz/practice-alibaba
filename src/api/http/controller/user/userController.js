/**
 * Created by pooya on 2/7/22.
 */

const AddUserInputModel = require('./dto/addUserInputModel');
const GetUserOutputModel = require('./dto/getUserOutputModel');
const LoginUserInputModel = require('./dto/loginUserInputModel');
const LoginUserOutputModel = require('./dto/loginUserOutputModel');

class UserController {
  #req;
  #res;
  /**
   * @type {IUserService}
   */
  #userService;
  /**
   * @type {IDateTime}
   */
  #dateTime;
  /**
   * @type {IToken}
   */
  #jwt;


  /**
   *
   * @param req
   * @param res
   * @param {IUserService} userService
   * @param {IDateTime} dateTime
   * @param {IToken} jwt
   */
  constructor(req, res, userService, dateTime, jwt) {
    this.#req = req;
    this.#res = res;
    this.#userService = userService;
    this.#dateTime = dateTime;
    this.#jwt = jwt;
  }

  async getById() {
    const { userId } = this.#req.params;

    const [error, data] = await this.#userService.getById(userId);
    if (error) {
      return [error];
    }

    const getUserOutputModel = new GetUserOutputModel(this.#dateTime);
    const result = getUserOutputModel.getOutput(data);

    return [null, result];
  }

  async addUser() {
    const { body } = this.#req;

    const addUserInputModel = new AddUserInputModel();
    const model = addUserInputModel.getModel(body);

    const [error, data] = await this.#userService.add(model);
    if (error) {
      return [error];
    }

    const addUserOutputModel = new GetUserOutputModel(this.#dateTime);
    const result = addUserOutputModel.getOutput(data);

    return [null, result];
  }

  async loginUser() {
    const body = this.#req.body;

    const loginUserInputModel = new LoginUserInputModel();
    const model = loginUserInputModel.getModel(body);

    const [error, data] = await this.#userService.auth(model.username, model.password);
    if (error) {
      return [error];
    }

    const loginUserOutputModel = new LoginUserOutputModel(this.#jwt);
    const result = loginUserOutputModel.getOutput(data);

    return [null, result];
  }
}

module.exports = UserController;
