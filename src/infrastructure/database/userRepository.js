/**
 * Created by pooya on 2/8/22.
 */

const UserModel = require('~src/core/model/userModel');
const IUserRepository = require('~src/core/interface/iUserRepository');
const DatabaseExecuteException = require('~src/core/exception/databaseExecuteException');

class UserRepository extends IUserRepository {
  #identifierGenerator;
  #userEntity;

  constructor(identifierGenerator, userEntity) {
    super();

    this.#identifierGenerator = identifierGenerator;
    this.#userEntity = userEntity;
  }

  async getById(id) {
    try {
      const data = await this.#userEntity.findAll({ where: { id } });
      if (data.length === 0) {
        return [null, null];
      }

      const result = this._fillModel(data[0]);

      return [null, result];
    } catch (error) {
      return [new DatabaseExecuteException(error)];
    }
  }

  async getUserByUsernameAndPassword(username, password) {
    try {
      const data = await this.#userEntity.findAll({ where: { username, password } });
      if (data.length === 0) {
        return [null, null];
      }

      const result = this._fillModel(data[0]);

      return [null, result];
    } catch (error) {
      return [new DatabaseExecuteException(error)];
    }
  }

  async add(model) {
    try {
      const entity = {
        id: this.#identifierGenerator.generateId(),
        username: model.username,
        password: model.password,
      };

      const data = await this.#userEntity.create(entity);

      const result = this._fillModel(data);

      return [null, result];
    } catch (error) {console.log(error)
      return [new DatabaseExecuteException(error)];
    }
  }

  _fillModel(row) {
    const model = new UserModel();
    model.id = row['id'];
    model.username = row['username'];
    model.password = row['password'];
    model.insertDate = row['createdAt'];

    return model;
  }
}

module.exports = UserRepository;
