/**
 * Created by pooya on 2/7/22.
 */

const ILinkService = require('~src/core/interface/iLinkService');
const AuthException = require('~src/core/exception/authException');
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
   */
  constructor(linkRepository, baseUrlPrefix) {
    super();

    this.#linkRepository = linkRepository;
    this.#baseUrlPrefix = baseUrlPrefix.substr(0, -1) !== '/' ? `${baseUrlPrefix}/`: baseUrlPrefix;
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

  async getAll({page = 1, limit = 10} = {}) {
    const [
      [errorCount, dataCount],
      [errorFetch, dataFetch],
    ] = await Promise.all([
      this.#linkRepository.getCount(),
      this.#linkRepository.getAll({page, limit}),
    ])
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

    return this.#linkRepository.add(model);
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
    // generate 10 random links
    const list = [];

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
}

module.exports = LinkService;
