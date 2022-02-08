/**
 * Created by pooya on 2/8/22.
 */

const os = require('os');
const cluster = require('cluster');
const Config = require('~config');

const MysqlDb = require('./bootstrap/db/mysqlDb');
const HttpServer = require('./bootstrap/server/httpServer');

const DateTime = require('~src/infrastructure/system/dateTime');
const JwtToken = require('~src/infrastructure/system/jwtToken');
const IdentifierGenerator = require('~src/infrastructure/system/identifierGenerator');

const UserService = require('~src/core/service/userService');
const LinkService = require('~src/core/service/linkService');

const UserController = require('~src/api/http/controller/user/userController');
const LinkController = require('~src/api/http/controller/link/linkController');

class Loader {
  constructor({ cwd = '', name = '', version = '' } = {}) {
    this._options = {};
    this._options.cwd = cwd;
    this._options.name = name;
    this._options.version = version;
    this._dependency = {};

    this._config = new Config();
  }

  async start() {
    const { mysqlDb } = await this._db();

    const jwtToken = new JwtToken(this._config.getStr('custom.jwt.secret'));
    const identifierGenerator = new IdentifierGenerator();
    const dateTime = new DateTime(
      this._config.getStr('custom.timezone.locales'),
      this._config.getStr('custom.timezone.zone'),
    );

    const userService = new UserService(null);
    const linkService = new LinkService(null, '');

    this._dependency = {
      jwtToken,
      identifierGenerator,
      dateTime,
      userService,
      linkService,
    };

    await this._webserver();
  }

  async _db() {
    const mysqlDb = new MysqlDb(this._config, this._options, {});

    return { mysqlDb: await mysqlDb.start() };
  }

  async _webserver() {
    const httpServer = new HttpServer(this._config, this._options, this._dependency);

    await httpServer.start();
  }
}

module.exports = Loader;
