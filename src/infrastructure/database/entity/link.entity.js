/**
 * Created by pooya on 2/8/22.
 */

module.exports = (sequelize, Sequelize) => {
  return sequelize.define('link', {
    id: {
      type: Sequelize.STRING(200),
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    url: {
      type: Sequelize.STRING,
    },
    redirectTo: {
      type: Sequelize.STRING(100),
      unique: true,
    },
  });
};
