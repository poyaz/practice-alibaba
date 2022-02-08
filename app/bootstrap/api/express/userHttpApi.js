/**
 * Created by pooya on 2/8/22.
 */

const IRunner = require('~interface/iRunner');

const expressApi = require('express');

const router = expressApi.Router();

const LoginUserValidationMiddleware = require('~src/api/http/controller/user/middleware/loginUserValidationMiddleware');
const AddUserValidationMiddleware = require('~src/api/http/controller/user/middleware/addUserValidationMiddleware');
const UserController = require('~src/api/http/controller/user/userController');
const TokenMiddleware = require('~src/api/http/middleware/tokenMiddleware');

class UserHttpApi extends IRunner {
  /**
   *
   * @param {IConfig} config
   * @param {Object} options
   * @param {*} dependency
   */
  constructor(config, options, dependency) {
    super();

    this._config = config;
    this._options = options;
    this._dependency = dependency;
  }

  async start() {
    router.post(
      '/',
      async (req, res, next) => {
        try {
          const addUserValidationMiddleware = new AddUserValidationMiddleware(req, res);

          await addUserValidationMiddleware.act();
          next();
        } catch (error) {
          next(error);
        }
      },
      async (req, res, next) => {
        try {
          const userController = new UserController(req, res, this._dependency.userService, this._dependency.dateTime, this._dependency.jwtToken);

          res.locals.output = await userController.addUser();

          next();
        } catch (error) {
          next(error);
        }
      },
    );

    router.post(
      '/auth',
      async (req, res, next) => {
        try {
          const loginUserValidationMiddleware = new LoginUserValidationMiddleware(req, res);

          await loginUserValidationMiddleware.act();

          next();
        } catch (error) {
          next(error);
        }
      },
      async (req, res, next) => {
        try {
          const userController = new UserController(req, res, this._dependency.userService, this._dependency.dateTime, this._dependency.jwtToken);

          res.locals.output = await userController.loginUser();

          next();
        } catch (error) {
          next(error);
        }
      },
    );

    router.get(
      '/:userId',
      async (req, res, next) => {
        try {
          const tokenMiddleware = new TokenMiddleware(req, res);

          await tokenMiddleware.act();

          next();
        } catch (error) {
          next(error);
        }
      },
      async (req, res, next) => {
        try {
          const userController = new UserController(req, res, this._dependency.userService, this._dependency.dateTime, this._dependency.jwtToken);

          res.locals.output = await userController.getById();

          next();
        } catch (error) {
          next(error);
        }
      },
    );

    return router;
  }
}

module.exports = UserHttpApi;
