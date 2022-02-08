/**
 * Created by pooya on 8/29/21.
 */

/**
 * @property builtins
 * @property builtins.NUMERIC
 */
const mysql = require('mysql');

const IRunner = require('~interface/iRunner');

class MysqlDb extends IRunner {
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
  }

  async start() {

    const dbOption = {
      host: this._config.getStr('database.mysql.host'),
      port: this._config.getNum('database.mysql.port'),
      database: this._config.getStr('database.mysql.db'),
      user: this._config.getStr('database.mysql.username'),
      password: this._config.getStr('database.mysql.password'),
      connectionLimit: this._config.getNum('database.mysql.max'),
    };

    const db = mysql.createPool(dbOption);

    db.on('error', (error) => {
      throw error;
    });

    return db;
  }
}

module.exports = MysqlDb;
