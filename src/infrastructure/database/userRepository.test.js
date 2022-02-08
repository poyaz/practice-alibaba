/**
 * Created by pooya on 2/7/22.
 */

const chai = require('chai');
const sinon = require('sinon');
const dirtyChai = require('dirty-chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

chai.should();
chai.use(dirtyChai);
chai.use(sinonChai);
chai.use(chaiAsPromised);

const UserRepository = require('~src/infrastructure/database/userRepository');
const DatabaseExecuteException = require('~src/core/exception/databaseExecuteException');
const UserExistException = require('~src/core/exception/userExistException');
const UserModel = require('~src/core/model/userModel');

const IIdentifierGenerator = require('~src/core/interface/iIdentifierGenerator');

const expect = chai.expect;
const container = {};

suite(`UserRepository`, () => {
  setup(() => {
    const identifierGenerator = sinon.createStubInstance(IIdentifierGenerator);
    identifierGenerator.generateId.returns('00000000-0000-0000-0000-000000000000');
    const userEntity = {
      findAll: sinon.stub(),
      create: sinon.stub(),
    };

    const userRepository = new UserRepository(identifierGenerator, userEntity);

    container.identifierGenerator = identifierGenerator;
    container.userEntity = userEntity;
    container.userRepository = userRepository;
  });

  suite(`Get user by id`, () => {
    test(`Should error get user by id`, async () => {
      const inputId = '00000000-0000-0000-0000-000000000000';
      const errorObj = new Error('query');
      container.userEntity.findAll.throws(errorObj);

      const [error] = await container.userRepository.getById(inputId);

      container.userEntity.findAll.should.have.callCount(1);
      expect(error).to.be.an.instanceof(DatabaseExecuteException);
    });

    test(`Should successfully get user by id when user not found`, async () => {
      const inputId = '00000000-0000-0000-0000-000000000000';
      container.userEntity.findAll.resolves([]);

      const [error, result] = await container.userRepository.getById(inputId);

      container.userEntity.findAll.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result).to.be.a('null');
    });

    test(`Should successfully get user by id`, async () => {
      const inputId = '00000000-0000-0000-0000-000000000000';
      const outputObj = {
        id: '00000000-0000-0000-0000-000000000000',
        username: 'username',
        password: 'password',
        createdAt: new Date(),
      };
      container.userEntity.findAll.resolves([outputObj]);

      const [error, result] = await container.userRepository.getById(inputId);

      container.userEntity.findAll.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result).to.be.an.instanceof(UserModel);
      expect(result).to.have.include({
        id: outputObj.id,
        username: outputObj.username,
        password: outputObj.password,
      });
    });
  });

  suite(`Get user by username and password`, () => {
    test(`Should error get user by username and password`, async () => {
      const inputUsername = 'username';
      const inputPassword = 'password';
      const errorObj = new Error('query');
      container.userEntity.findAll.throws(errorObj);

      const [error] = await container.userRepository.getUserByUsernameAndPassword(inputUsername, inputPassword);

      container.userEntity.findAll.should.have.callCount(1);
      expect(error).to.be.an.instanceof(DatabaseExecuteException);
    });

    test(`Should successfully get user by username and password when user not found`, async () => {
      const inputUsername = 'username';
      const inputPassword = 'password';
      container.userEntity.findAll.resolves([]);

      const [error, result] = await container.userRepository.getUserByUsernameAndPassword(inputUsername, inputPassword);

      container.userEntity.findAll.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result).to.be.a('null');
    });

    test(`Should successfully get user by username and password`, async () => {
      const inputUsername = 'username';
      const inputPassword = 'password';
      const outputObj = {
        id: '00000000-0000-0000-0000-000000000000',
        username: 'username',
        password: 'password',
        createdAt: new Date(),
      };
      container.userEntity.findAll.resolves([outputObj]);

      const [error, result] = await container.userRepository.getUserByUsernameAndPassword(inputUsername, inputPassword);

      container.userEntity.findAll.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result).to.be.an.instanceof(UserModel);
      expect(result).to.have.include({
        id: outputObj.id,
        username: outputObj.username,
        password: outputObj.password,
      });
    });
  });

  suite(`Add new user`, () => {
    test(`Should error add new user`, async () => {
      const inputModel = new UserModel();
      inputModel.username = 'username';
      inputModel.password = 'password';
      const errorObj = new Error('query');
      container.userEntity.create.throws(errorObj);

      const [error] = await container.userRepository.add(inputModel);

      container.identifierGenerator.generateId.should.have.callCount(1);
      container.userEntity.create.should.have.callCount(1);
      expect(error).to.be.an.instanceof(DatabaseExecuteException);
    });

    test(`Should error add new user when username exist`, async () => {
      const inputModel = new UserModel();
      inputModel.username = 'username';
      inputModel.password = 'password';
      const errorObj = new Error('query');
      errorObj.name = 'SequelizeUniqueConstraintError';
      container.userEntity.create.throws(errorObj);

      const [error] = await container.userRepository.add(inputModel);

      container.identifierGenerator.generateId.should.have.callCount(1);
      container.userEntity.create.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UserExistException);
    });

    test(`Should successfully add new user`, async () => {
      const inputModel = new UserModel();
      inputModel.username = 'username';
      inputModel.password = 'password';
      const outputObj = {
        id: '00000000-0000-0000-0000-000000000000',
        username: 'username',
        password: 'password',
        createdAt: new Date(),
      };
      container.userEntity.create.resolves(outputObj);

      const [error, result] = await container.userRepository.add(inputModel);

      container.identifierGenerator.generateId.should.have.callCount(1);
      container.userEntity.create.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result).to.be.an.instanceof(UserModel);
      expect(result).to.have.include({
        id: outputObj.id,
        username: outputObj.username,
        password: outputObj.password,
      });
    });
  });
});
