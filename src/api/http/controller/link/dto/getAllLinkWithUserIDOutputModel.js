const BaseLinkOutputModel = require('./baseLinkOutputModel');

class GetAllLinkWithUserIDOutputModel {
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
    
    return models.map((v) => baseLinkOutputModel.getOutput(v));
  }
}

module.exports = GetAllLinkWithUserIDOutputModel;
