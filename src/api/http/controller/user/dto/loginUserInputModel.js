/**
 * Created by pooya on 8/23/21.
 */

const crypto = require('crypto');
const UserModel = require('~src/core/model/userModel');

class LoginUserInputModel {
  /**
   *
   * @param body
   * @return {UserModel}
   */
  getModel(body) {
    const hasPassword = crypto.createHash('sha1');
    hasPassword.update(body.password);

    const model = new UserModel();
    model.username = body.username;
    model.password = hasPassword.digest('hex');

    return model;
  }
}

module.exports = LoginUserInputModel;
