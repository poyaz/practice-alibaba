/**
 * Created by pooya on 2/8/22.
 */

const IRunner = require('~interface/iRunner');

const expressApi = require('express');

const router = expressApi.Router();

class InterceptorMiddleware extends IRunner {
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
    router.use((req, res, next) => {
      if (res.locals.end) {
        return;
      }

      console.log(res.locals);
      const [error, data] = res.locals.output;

      if (error) {
        res.status(error.statusCode || 400).json({
          status: 'error',
          reason: error.message.toString(),
        });

        return next();
      }

      let statusCode = 200;
      switch (req.method.toLowerCase()) {
        case 'post':
          statusCode = 201;
          break;
        case 'get':
        case 'put':
          statusCode = 200;
          break;
        case 'delete':
          statusCode = 204;
          break;
      }

      if (statusCode === 204) {
        res.status(statusCode).end();
      } else {
        const obj = {
          status: 'success',
          data: data,
        };

        res.status(statusCode).json(obj);
      }

      next();
    });

    return router;
  }
}

module.exports = InterceptorMiddleware;
