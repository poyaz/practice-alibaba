/**
 * Created by pooya on 2/8/22.
 */

module.exports = (sequelize, Sequelize) => {
  return sequelize.define('user', {
    id: {
      type: Sequelize.STRING(200),
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING(100),
      unique: true,
    },
    password: {
      type: Sequelize.STRING(225),
    },
  });
};

