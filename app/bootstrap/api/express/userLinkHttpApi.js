/**
 * Created by pooya on 2/8/22.
 */

const IRunner = require('~interface/iRunner');

const expressApi = require('express');

const router = expressApi.Router();

const LinkController = require('~src/api/http/controller/link/linkController');
const TokenMiddleware = require('~src/api/http/middleware/tokenMiddleware');

class UserLinkHttpApi extends IRunner {
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
    router.use(async (req, res, next) => {
      try {
        const tokenMiddleware = new TokenMiddleware(req, res);

        await tokenMiddleware.act();

        next();
      } catch (error) {
        next(error);
      }
    });

    router.get(
      '/:userId/links',
      async (req, res, next) => {
        try {
          const linkController = new LinkController(req, res, this._dependency.linkService, this._dependency.dateTime);

          res.locals.output = await linkController.getAllWithUserId();

          next();
        } catch (error) {
          next(error);
        }
      },
    );

    router.post(
      '/:userId/links',
      async (req, res, next) => {
        try {
          const linkController = new LinkController(req, res, this._dependency.linkService, this._dependency.dateTime);

          res.locals.output = await linkController.addLink();

          next();
        } catch (error) {
          next(error);
        }
      },
    );

    router.put(
      '/:userId/links/:linkId',
      async (req, res, next) => {
        try {
          const linkController = new LinkController(req, res, this._dependency.linkService, this._dependency.dateTime);

          res.locals.output = await linkController.updateLink();

          next();
        } catch (error) {
          next(error);
        }
      },
    );

    router.delete(
      '/:userId/links/:linkId',
      async (req, res, next) => {
        try {
          const linkController = new LinkController(req, res, this._dependency.linkService, this._dependency.dateTime);

          res.locals.output = await linkController.deleteLink();

          next();
        } catch (error) {
          next(error);
        }
      },
    );

    return router;
  }
}

module.exports = UserLinkHttpApi;
