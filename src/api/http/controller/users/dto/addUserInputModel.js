/**
 * Created by pooya on 8/23/21.
 */

const UsersModel = require('~src/core/model/usersModel');

class AddUserInputModel {
  /**
   *
   * @param body
   * @return {UsersModel}
   */
  getModel(body) {
    const model = new UsersModel();
    model.username = body.username;
    model.password = body.password;

    return model;
  }
}

module.exports = AddUserInputModel;
