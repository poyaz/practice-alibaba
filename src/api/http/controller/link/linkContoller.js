/**
 * Created by pooya on 2/7/22.
 */

const GetAllLinksOutputModel = require('./dto/getAllLinkOutputModel');
const AddLinkInputModel = require('./dto/addLinkInputModel');
const BaseLinkOutputModel = require('./dto/baseLinkOutputModel');
const UpdateLinkInputModel = require('./dto/updateLinkInputModel');

class LinksController {
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
    }

    const [error, data, count] = await this.#linksService.getAll(options);
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

    return [null, {change: data}];
  }

  async deleteLink() {
    const { linkId } = this.#req.params;

    const [error, data] = await this.#linksService.delete(linkId);
    if (error) {
      return [error];
    }

    return [null];
  }
}