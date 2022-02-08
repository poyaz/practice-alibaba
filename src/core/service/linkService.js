/**
 * Created by pooya on 2/7/22.
 */

const ILinkService = require('~src/core/interface/iLinkService');
const NotFoundException = require('~src/core/exception/notFoundException');
const GenerateLinkException = require('~src/core/exception/generateLinkException');

class LinkService extends ILinkService {
  /**
   * @type {ILinkRepository}
   */
  #linkRepository;
  /**
   * @type {string}
   */
  #baseUrlPrefix;

  /**
   *
   * @param {ILinkRepository} linkRepository
   * @param {string} baseUrlPrefix
   */
  constructor(linkRepository, baseUrlPrefix) {
    super();

    this.#linkRepository = linkRepository;
    this.#baseUrlPrefix = baseUrlPrefix.substr(-1, 1) !== '/' ? `${baseUrlPrefix}/` : baseUrlPrefix;
  }

  async getById(id) {
    const [error, data] = await this.#linkRepository.getById(id);
    if (error) {
      return [error];
    }
    if (!data) {
      return [new NotFoundException()];
    }

    this._convertRedirectUrl(data);

    return [null, data];
  }

  async getAll(filter, { page = 1, limit = 10 } = {}) {
    const [
      [errorCount, dataCount],
      [errorFetch, dataFetch],
    ] = await Promise.all([
      this.#linkRepository.getCount(filter),
      this.#linkRepository.getAll(filter, { page, limit }),
    ]);
    if (errorCount || errorFetch) {
      return [errorCount || errorFetch];
    }

    dataFetch.map((v) => (this._convertRedirectUrl(v)));

    return [null, dataFetch, dataCount];
  };

  async add(model) {
    if (!model.redirectTo) {
      const [error, link] = await this._generateRedirectUrl();
      if (error) {
        return [error];
      }

      model.redirectTo = link;
    }

    const [error, data] = await this.#linkRepository.add(model);
    if (error) {
      return [error];
    }

    this._convertRedirectUrl(data);

    return [null, data];
  }

  async update(model) {
    const [errorExist] = await this.getById(model.id);
    if (errorExist) {
      return [errorExist];
    }

    return this.#linkRepository.update(model);
  }

  async delete(id) {
    const [errorExist] = await this.getById(id);
    if (errorExist) {
      return [errorExist];
    }

    return this.#linkRepository.delete(id);
  }

  _convertRedirectUrl(model) {
    model.redirectTo = `${this.#baseUrlPrefix}${model.redirectTo}`;
  }

  async _generateRedirectUrl() {
    const list = new Array(10).fill(null).map(() => this._generateRandomString());

    const [error, data] = await this.#linkRepository.checkRedirectUrl(list);
    if (error) {
      return [error];
    }
    if (data.length === list.length) {
      return [new GenerateLinkException()];
    }

    const link = list.filter((n) => data.findIndex((m) => n === m) === -1)[0];

    return [null, link];
  }

  _generateRandomString() {
    const length = Math.floor(Math.random() * 10) + 4;

    return Buffer.from(Math.random().toString()).toString('base64').substr(10, length);
  }
}

module.exports = LinkService;
