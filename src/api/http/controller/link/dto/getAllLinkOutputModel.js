const BaseLinkOutputModel = require('./baseLinkOutputModel');

class GetAllLinkOutputModel {
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
   * @param {Array<LinkModel>} models
   * @return {Array<Object>}
   */
  getOutput(models) {
    const baseLinkOutputModel = new BaseLinkOutputModel(this.#dateTime);

    return models.map((v) => {
      const model = baseLinkOutputModel.getOutput(v);

      delete model.userId;
      delete model.username;

      return model;
    });
  }
}

module.exports = GetAllLinkOutputModel;
