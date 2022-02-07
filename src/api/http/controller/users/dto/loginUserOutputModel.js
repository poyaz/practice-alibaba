/**
 * Created by pooya on 8/23/21.
 */

class LoginUserOutputModel {
  /**
   * @type {IToken}
   */
  #jwt;

  /**
   *
   * @param {IToken} jwt
   */
  constructor(jwt) {
    this.#jwt = jwt;
  }

  /**
   *
   * @param {UsersModel} model
   * @return {{}}
   */
  getOutput(model) {
    return {
      token: this.#jwt.sign({ id: model.id }),
    };
  }
}

module.exports = LoginUserOutputModel;
