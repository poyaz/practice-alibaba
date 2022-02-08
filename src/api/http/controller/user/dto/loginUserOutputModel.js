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
   * @param {UserModel} model
   * @return {{}}
   */
  getOutput(model) {
    return {
      token: this.#jwt.sign({ userId: model.id }),
    };
  }
}

module.exports = LoginUserOutputModel;
