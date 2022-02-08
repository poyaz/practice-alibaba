/**
 * Created by pooya on 2/8/22.
 */

const { Op } = require('sequelize');
const LinkModel = require('~src/core/model/linkModel');
const ILinkRepository = require('~src/core/interface/iLinkRepository');
const DatabaseExecuteException = require('~src/core/exception/databaseExecuteException');

class LinkRepository extends ILinkRepository {
  #identifierGenerator;
  #linkEntity;
  #userEntity;

  constructor(identifierGenerator, linkEntity, userEntity) {
    super();

    this.#identifierGenerator = identifierGenerator;
    this.#linkEntity = linkEntity;
    this.#userEntity = userEntity;
  }

  async getAll(filter, { page = 1, limit = 10 } = {}) {
    const limitCount = limit;
    const offsetCount = (page - 1) * limit;

    const options = {
      offset: offsetCount,
      limit: limitCount,
      order: [
        ['createAt', 'DESC'],
      ],
      include: this.#userEntity,
    };
    if (filter) {
      if (filter.operation === 'eq' && filter.key === 'userId') {
        options.where = { userId: filter.value.toString() };
      }
    }

    try {
      const data = await this.#linkEntity.findAll(options);

      const result = data.map((v) => this._fillModel(v));

      return [null, result];
    } catch (error) {
      return [new DatabaseExecuteException(error)];
    }
  }

  async getCount(filter) {
    const options = {};
    if (filter) {
      if (filter.operation === 'eq' && filter.key === 'userId') {
        options.where = { userId: filter.value.toString() };
      }
    }

    try {
      const data = await this.#linkEntity.count(options);

      return [null, data];
    } catch (error) {
      return [new DatabaseExecuteException(error)];
    }
  }

  async getById(id) {
    try {
      const data = await this.#linkEntity.findAll({ where: { id } });
      if (data.length === 0) {
        return [null, null];
      }

      const result = this._fillModel(data[0]);

      return [null, result];
    } catch (error) {
      return [new DatabaseExecuteException(error)];
    }
  }

  async checkRedirectUrl(list) {
    try {
      const data = await this.#linkEntity.findAll({
        attributes: ['redirectTo'],
        where: { redirectTo: { [Op.in]: list } },
      });

      const result = data.map((v) => v.redirectTo);

      return [null, result];
    } catch (error) {
      return [new DatabaseExecuteException(error)];
    }
  }

  async add(model) {
    try {
      const entity = {
        id: this.#identifierGenerator.generateId(),
        userId: model.userId,
        url: model.url,
        redirectTo: model.redirectTo,
      };

      const data = await this.#linkEntity.create(entity);

      const result = this._fillModel(data);

      return [null, result];
    } catch (error) {
      return [new DatabaseExecuteException(error)];
    }
  }

  async update(model) {
    try {
      const entity = {
        url: model.url,
        redirectTo: model.redirectTo,
      };

      const data = await this.#linkEntity.update(entity, { where: { id: model.id } });

      return [null, data === 1];
    } catch (error) {
      return [new DatabaseExecuteException(error)];
    }
  }

  async delete(id) {
    try {
      const data = await this.#linkEntity.destroy({ where: { id } });

      return [null, data === 1];
    } catch (error) {
      return [new DatabaseExecuteException(error)];
    }
  }

  _fillModel(row) {
    const model = new LinkModel();
    model.id = row['id'];
    model.userId = row['user']['id'];
    model.username = row['user']['username'];
    model.url = row['url'];
    model.redirectTo = row['redirectTo'];
    model.insertDate = row['createdAt'];
    model.updateDate = row['updatedAt'];

    return model;
  }
}

module.exports = LinkRepository;
