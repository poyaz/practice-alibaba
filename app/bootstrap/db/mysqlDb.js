/**
 * Created by pooya on 8/29/21.
 */

const Sequelize = require('sequelize');

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
      min: this._config.getNum('database.mysql.min'),
      max: this._config.getNum('database.mysql.max'),
    };

    const sequelize = new Sequelize(dbOption.database, dbOption.user, dbOption.password, {
      host: dbOption.host,
      dialect: 'mysql',
      operatorsAliases: false,
      pool: {
        max: dbOption.max,
        min: dbOption.max,
        acquire: 30000,
        idle: 10000,
      },
    });
    const db = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;

    db.user = require('~src/infrastructure/database/entity/user.entity')(sequelize, Sequelize);
    db.link = require('~src/infrastructure/database/entity/link.entity')(sequelize, Sequelize);

    db.link.belongsTo(db.user);

    await db.sequelize.sync();

    return db;
  }
}

module.exports = MysqlDb;
