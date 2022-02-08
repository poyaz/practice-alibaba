/**
 * Created by pooya on 2/8/22.
 */

const FilterModel = require('~src/core/model/filterModel');

class GetAllWithUserIdInputModel {
  /**
   *
   * @param userId
   * @return {FilterModel}
   */
  getModel(userId) {
    const model = new FilterModel();
    model.operation = 'eq';
    model.key = 'userId';
    model.value = userId;

    return model;
  }
}

module.exports = GetAllWithUserIdInputModel;
