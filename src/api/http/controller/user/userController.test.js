/**
 * Created by pooya on 2/7/22.
 */

const chai = require('chai');
const sinon = require('sinon');
const dirtyChai = require('dirty-chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const { createRequest, createResponse } = require('node-mocks-http');

chai.should();
chai.use(dirtyChai);
chai.use(sinonChai);
chai.use(chaiAsPromised);

const UserController = require('~src/api/http/controller/user/userController');
const UnknownException = require('~src/core/exception/unknownException');
const UserModel = require('~src/core/model/userModel');
const DateTime = require('~src/infrastructure/system/dateTime');

const IUserService = require('~src/core/interface/iUserService');
const IToken = require('~src/core/interface/iToken');

const expect = chai.expect;
const container = {};

suite(`UserController`, () => {
  setup(() => {
    const req = new createRequest();
    const res = new createResponse();

    const userService = sinon.createStubInstance(IUserService);
    const jwt = sinon.createStubInstance(IToken);
    const dateTime = new DateTime();

    const userController = new UserController(req, res, userService, dateTime, jwt);

    container.req = req;
    container.res = res;
    container.userService = userService;
    container.jwt = jwt;
    container.userController = userController;
    container.dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/;
  });

  suite(`Get user by id`, () => {
    test(`Should error get user by id`, async () => {
      container.req.params = { userId: '00000000-0000-0000-0000-000000000000' };
      container.userService.getById.resolves([new UnknownException()]);

      const [error] = await container.userController.getById();

      container.userService.getById.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should successfully get user by id`, async () => {
      container.req.params = { userId: '00000000-0000-0000-0000-000000000000' };
      const outputModel = new UserModel();
      outputModel.id = '00000000-0000-0000-0000-000000000000';
      outputModel.username = container.req.body.username;
      outputModel.insertDate = new Date();
      container.userService.getById.resolves([null, outputModel]);

      const [error, result] = await container.userController.getById();

      container.userService.getById.should.have.callCount(1);
      container.userService.getById.should.have.calledWith(
        sinon.match('00000000-0000-0000-0000-000000000000'),
      );
      expect(error).to.be.a('null');
      expect(result).to.be.a('object');
      expect(result).to.have.include({
        id: outputModel.id,
        username: container.req.body.username,
      });
      expect(result.insertDate).to.have.match(container.dateRegex);
    });
  });

  suite('Add new user', () => {
    test(`Should error when add new user`, async () => {
      container.req.body = { username: 'username', password: 'password' };
      container.userService.add.resolves([new UnknownException()]);

      const [error] = await container.userController.addUser();

      container.userService.add.should.have.callCount(1);
      container.userService.add.should.have.calledWith(
        sinon.match
          .instanceOf(UserModel)
          .and(sinon.match.has('username', sinon.match.string))
          .and(sinon.match.has('password', sinon.match.string)),
      );
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should successfully add new user`, async () => {
      container.req.body = { username: 'username', password: 'password' };
      const outputModel = new UserModel();
      outputModel.id = '00000000-0000-0000-0000-000000000000';
      outputModel.username = container.req.body.username;
      outputModel.insertDate = new Date();
      container.userService.add.resolves([null, outputModel]);

      const [error, result] = await container.userController.addUser();

      container.userService.add.should.have.callCount(1);
      container.userService.add.should.have.calledWith(
        sinon.match
          .instanceOf(UserModel)
          .and(sinon.match.has('username', sinon.match.string))
          .and(sinon.match.has('password', sinon.match.string)),
      );
      expect(error).to.be.a('null');
      expect(result).to.be.a('object');
      expect(result).to.have.include({
        id: outputModel.id,
        username: container.req.body.username,
      });
      expect(result.insertDate).to.have.match(container.dateRegex);
    });
  });

  suite(`Login user`, () => {
    test(`Should error login user`, async () => {
      container.req.body = { username: 'username', password: 'password' };
      container.userService.auth.resolves([new UnknownException()]);

      const [error] = await container.userController.loginUser();

      container.userService.auth.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should successfully login user`, async () => {
      container.req.body = { username: 'username', password: 'password' };
      const outputModel = new UserModel();
      outputModel.id = '00000000-0000-0000-0000-000000000000';
      outputModel.username = container.req.body.username;
      outputModel.insertDate = new Date();
      container.userService.auth.resolves([null, outputModel]);
      container.jwt.sign.returns('token');

      const [error, result] = await container.userController.loginUser();

      container.userService.auth.should.have.callCount(1);
      container.userService.auth.should.have.calledWith(
        sinon.match(container.req.body.username),
        sinon.match(container.req.body.password),
      );
      container.jwt.sign.should.have.calledWith(sinon.match.has('id', outputModel.id));
      expect(error).to.be.a('null');
      expect(result).to.be.a('object');
      expect(result).to.have.include({
        token: 'token',
      });
    });
  });
});
