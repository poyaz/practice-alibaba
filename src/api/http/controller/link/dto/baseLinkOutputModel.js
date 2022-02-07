class BaseLinkOutputModel {
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
   * @param {LinkModel} model
   * @return {{}}
   */
  getOutput(model) {
    const obj = {};
    obj.id = model.id;
    obj.userId = model.userId;
    obj.username = model.username;
    obj.url = model.url;
    obj.redirectTo = model.redirectTo;
    obj.insertDate = this.#dateTime.gregorianWithTimezoneString(model.insertDate);
    obj.updateDate = this.#dateTime.gregorianWithTimezoneString(model.updateDate);

    return obj;
  }
}

module.exports = BaseLinkOutputModel;