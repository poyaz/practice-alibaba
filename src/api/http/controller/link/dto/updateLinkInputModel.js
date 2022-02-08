const LinkModel = require('~src/core/model/linkModel');

class UpdateLinkInputModel {
 /**
   *
   * @param linkId
   * @param body
   * @return {LinkModel}
   */
  getModel(linkId, body) {
    const model = new LinkModel();
    model.id = linkId;
    model.url = body.url;
    model.redirectTo = body.redirectTo;

    return model;
  }
}

module.exports = UpdateLinkInputModel;
