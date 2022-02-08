/**
 * Created by pooya on 2/8/22.
 */

const IRunner = require('~interface/iRunner');

const expressApi = require('express');

const router = expressApi.Router();

const LinkController = require('~src/api/http/controller/link/linkController');

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
    router.get(
      '/',
      async (req, res, next) => {
        try {
          const linkController = new LinkController(req, res, this._dependency.linkService, this._dependency.dateTime);

          res.locals.output = await linkController.getAll();

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
