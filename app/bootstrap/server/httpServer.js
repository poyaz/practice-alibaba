/**
 * Created by pooya on 2/8/22.
 */

const IRunner = require('~interface/iRunner');

const expressApi = require('express');
const bodyParser = require('body-parser');

const app = expressApi();
const router = expressApi.Router();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const UserHttpApi = require('../api/express/userHttpApi');
const LinkHttpApi = require('../api/express/linkHttpApi');
const UserLinkHttpApi = require('../api/express/userLinkHttpApi');
const InterceptorMiddleware = require('../api/express/interceptorMiddleware');

class HttpServer extends IRunner {
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
    const host = this._config.get('server.host');
    const port = this._config.getNum('server.http.port');

    app.use('/', router);

    await this._routerApi();

    app.use((error, req, res, next) => {
      console.error(error);

      if (error) {
        res.status(error.statusCode || 400).json({
          status: 'error',
          reason: error.message.toString(),
        });
      }

      next();
    });

    app.listen(port, host, () => {
      process.stdout.write(`API listening at http://${host}:${port}\n`);
    });
  }

  async _routerApi() {
    const userHttpApi = await new UserHttpApi(this._config, this._options, this._dependency).start();
    router.use('/api/v1/users', userHttpApi);

    const linkHttpApi = await new LinkHttpApi(this._config, this._options, this._dependency).start();
    router.use('/api/v1/links', linkHttpApi);

    const userLinkHttpApi = await new UserLinkHttpApi(this._config, this._options, this._dependency).start();
    router.use('/api/v1/users', userLinkHttpApi);

    const interceptorMiddleware = await new InterceptorMiddleware(this._config, this._options, this._dependency).start();
    router.use('/', interceptorMiddleware);
  }
}

module.exports = HttpServer;
