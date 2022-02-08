const LinkModel = require('~src/core/model/linkModel');

class AddLinkInputModel {
 /**
   *
   * @param userId
   * @param body
   * @return {LinkModel}
   */
  getModel(userId, body) {
    const model = new LinkModel();
    model.userId = userId;
    model.url = body.url;
    model.redirectTo = body.redirectTo || null;

    return model;
  }
}

module.exports = AddLinkInputModel;
