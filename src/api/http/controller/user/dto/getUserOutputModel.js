/**
 * Created by pooya on 8/23/21.
 */

class GetUserOutputModel {
  /**
   * @type {IDateTime}
   */
  #dateTime;

  /**
   *
   * @param {IDateTime} dateTime
   */
  constructor(dateTime) {
    this.#dateTime = dateTime;
  }

  /**
   *
   * @param {UserModel} model
   * @return {{}}
   */
  getOutput(model) {
    const obj = {};
    obj.id = model.id;
    obj.username = model.username;
    obj.insertDate = this.#dateTime.gregorianWithTimezoneString(model.insertDate);

    return obj;
  }
}

module.exports = GetUserOutputModel;
