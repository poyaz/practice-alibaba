/**
 * Created by pooya on 2/7/22.
 */

const GetAllLinksOutputModel = require('./dto/getAllLinkOutputModel');
const GetAllLinkWithUserIDOutputModel = require('./dto/getAllLinkWithUserIDOutputModel');
const GetAllWithUserIdInputModel = require('./dto/getAllWithUserIdInputModel');
const AddLinkInputModel = require('./dto/addLinkInputModel');
const BaseLinkOutputModel = require('./dto/baseLinkOutputModel');
const UpdateLinkInputModel = require('./dto/updateLinkInputModel');

class LinkController {
  #req;
  #res;
  /**
   * @type {ILinksService}
   */
  #linksService;
  /**
   * @type {IDateTime}
   */
  #dateTime;

  /**
   *
   * @param req
   * @param res
   * @param {ILinksService} linksService
   * @param {IDateTime} dateTime
   */
  constructor(req, res, linksService, dateTime) {
    this.#req = req;
    this.#res = res;
    this.#linksService = linksService;
    this.#dateTime = dateTime;
  }

  async getAll() {
    const { page, limit } = this.#req.query;

    const options = {
      page: page ? page : 1,
      limit: limit ? limit : 10,
    };

    const [error, data, count] = await this.#linksService.getAll(null, options);
    if (error) {
      return [error];
    }

    const getAllLinksOutputModel = new GetAllLinksOutputModel(this.#dateTime);
    const result = getAllLinksOutputModel.getOutput(data);

    return [null, {
      totalItems: count,
      items: result,
    }];
  }

  async getAllWithUserId() {
    const { page, limit } = this.#req.query;
    const { userId } = this.#req.params;

    const options = {
      page: page ? page : 1,
      limit: limit ? limit : 10,
    };

    const getAllWithUserIdInputModel = new GetAllWithUserIdInputModel();
    const model = getAllWithUserIdInputModel.getModel(userId);

    const [error, data, count] = await this.#linksService.getAll(model, options);
    if (error) {
      return [error];
    }

    const getAllLinkWithUserIDOutputModel = new GetAllLinkWithUserIDOutputModel(this.#dateTime);
    const result = getAllLinkWithUserIDOutputModel.getOutput(data);

    return [null, {
      totalItems: count,
      items: result,
    }];
  }

  async addLink() {
    const { userId } = this.#req.params;
    const body = this.#req;

    const addLinkInputModel = new AddLinkInputModel();
    const model = addLinkInputModel.getModel(userId, body);

    const [error, data] = await this.#linksService.add(model);
    if (error) {
      return [error];
    }

    const baseLinkOutputModel = new BaseLinkOutputModel(this.#dateTime);
    const result = baseLinkOutputModel.getOutput(data);

    return [null, result];
  }

  async updateLink() {
    const { linkId } = this.#req.params;
    const body = this.#req;

    const updateLinkInputModel = new UpdateLinkInputModel();
    const model = updateLinkInputModel.getModel(linkId, body);

    const [error, data] = await this.#linksService.update(model);
    if (error) {
      return [error];
    }

    return [null, { change: data }];
  }

  async deleteLink() {
    const { linkId } = this.#req.params;

    const [error] = await this.#linksService.delete(linkId);
    if (error) {
      return [error];
    }

    return [null];
  }
}

module.exports = LinkController;
