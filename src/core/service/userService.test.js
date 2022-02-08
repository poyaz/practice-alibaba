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

const UsersService = require('~src/core/service/userService');
const LoginException = require('~src/core/exception/loginException');
const UnknownException = require('~src/core/exception/unknownException');
const NotFoundException = require('~src/core/exception/notFoundException');
const UserModel = require('~src/core/model/userModel');

const IUserRepository = require('~src/core/interface/iUserRepository');

const expect = chai.expect;
const container = {};

suite(`UserService`, () => {
  setup(() => {
    const userRepository = sinon.createStubInstance(IUserRepository);

    const userService = new UsersService(userRepository);

    container.userRepository = userRepository;
    container.userService = userService;
  });

  suite(`Get user by id`, () => {
    test(`Should error get user by id`, async () => {
      const inputId = '00000000-0000-0000-0000-000000000000';
      container.userRepository.getById.resolves([new UnknownException()]);

      const [error] = await container.userService.getById(inputId);

      container.userRepository.getById.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should error get user by id when user not found`, async () => {
      const inputId = '00000000-0000-0000-0000-000000000000';
      container.userRepository.getById.resolves([null, null]);

      const [error] = await container.userService.getById(inputId);

      container.userRepository.getById.should.have.callCount(1);
      expect(error).to.be.an.instanceof(NotFoundException);
    });

    test(`Should successfully get user by id`, async () => {
      const inputId = '00000000-0000-0000-0000-000000000000';
      const outputModel = new UserModel();
      outputModel.id = '00000000-0000-0000-0000-000000000000';
      outputModel.username = 'username';
      outputModel.password = 'password';
      outputModel.insertDate = new Date();
      container.userRepository.getById.resolves([null, outputModel]);

      const [error, result] = await container.userService.getById(inputId);

      container.userRepository.getById.should.have.callCount(1);
      container.userRepository.getById.should.have.calledWith(
        sinon.match('00000000-0000-0000-0000-000000000000'),
      );
      expect(error).to.be.a('null');
      expect(result).to.be.a('object');
      expect(result).to.have.include({
        id: outputModel.id,
        username: 'username',
        password: 'password',
      });
    });
  });

  suite(`Add new user`, () => {
    test(`Should error add new user`, async () => {
      const inputModel = new UserModel();
      inputModel.username = 'username';
      inputModel.password = 'password';
      container.userRepository.add.resolves([new UnknownException()]);

      const [error] = await container.userService.add(inputModel);

      container.userRepository.add.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should successful add new user`, async () => {
      const inputModel = new UserModel();
      inputModel.username = 'username';
      inputModel.password = 'password';
      const outputModel = new UserModel();
      outputModel.id = '00000000-0000-0000-0000-000000000000';
      outputModel.username = 'username';
      outputModel.password = 'password';
      outputModel.insertDate = new Date();
      container.userRepository.add.resolves([null, outputModel]);

      const [error, result] = await container.userService.add(inputModel);

      container.userRepository.add.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result).to.be.a('object');
      expect(result).to.have.include({
        id: outputModel.id,
        username: 'username',
        password: 'password',
      });
    });
  });

  suite(`Authenticate user`, () => {
    test(`Should error authenticate user`, async () => {
      const inputUsername = 'username';
      const inputPassword = 'password';
      container.userRepository.getUserByUsernameAndPassword.resolves([new UnknownException()]);

      const [error] = await container.userService.auth(inputUsername, inputPassword);

      container.userRepository.getUserByUsernameAndPassword.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should error authenticate user when not found any record with username and password`, async () => {
      const inputUsername = 'username';
      const inputPassword = 'password';
      container.userRepository.getUserByUsernameAndPassword.resolves([null, null]);

      const [error] = await container.userService.auth(inputUsername, inputPassword);

      container.userRepository.getUserByUsernameAndPassword.should.have.callCount(1);
      expect(error).to.be.an.instanceof(LoginException);
    });

    test(`Should successful authenticate user`, async () => {
      const inputUsername = 'username';
      const inputPassword = 'password';
      const outputModel = new UserModel();
      outputModel.id = '00000000-0000-0000-0000-000000000000';
      outputModel.username = 'username';
      outputModel.password = 'password';
      outputModel.insertDate = new Date();
      container.userRepository.getUserByUsernameAndPassword.resolves([null, outputModel]);

      const [error, result] = await container.userService.auth(inputUsername, inputPassword);

      container.userRepository.getUserByUsernameAndPassword.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result).to.be.a('object');
      expect(result).to.have.include({
        id: outputModel.id,
        username: 'username',
        password: 'password',
      });
    });
  });
});
