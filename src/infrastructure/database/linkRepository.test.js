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

const LinkRepository = require('~src/infrastructure/database/linkRepository');
const DatabaseExecuteException = require('~src/core/exception/databaseExecuteException');
const LinkExistException = require('~src/core/exception/linkExistException');
const LinkModel = require('~src/core/model/linkModel');

const IIdentifierGenerator = require('~src/core/interface/iIdentifierGenerator');

const expect = chai.expect;
const container = {};

suite(`LinkRepository`, () => {
  setup(() => {
    const identifierGenerator = sinon.createStubInstance(IIdentifierGenerator);
    identifierGenerator.generateId.returns('00000000-0000-0000-0000-000000000000');
    const linkEntity = {
      findAll: sinon.stub(),
      count: sinon.stub(),
      create: sinon.stub(),
      update: sinon.stub(),
      destroy: sinon.stub(),
    };
    const userEntity = {};

    const linkRepository = new LinkRepository(identifierGenerator, linkEntity, userEntity);

    container.identifierGenerator = identifierGenerator;
    container.linkEntity = linkEntity;
    container.linkRepository = linkRepository;
  });

  suite(`Get all link`, () => {
    test(`Should error get all link`, async () => {
      const errorObj = new Error('query');
      container.linkEntity.findAll.throws(errorObj);

      const [error] = await container.linkRepository.getAll(null);

      container.linkEntity.findAll.should.have.callCount(1);
      expect(error).to.be.an.instanceof(DatabaseExecuteException);
    });

    test(`Should successfully get all link when not found any record`, async () => {
      container.linkEntity.findAll.resolves([]);

      const [error, result] = await container.linkRepository.getAll(null);

      container.linkEntity.findAll.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result.length).to.be.equal(0);
    });

    test(`Should successfully get all link`, async () => {
      const outputObj = {
        id: '00000000-0000-0000-0000-000000000000',
        userId: '00000000-0000-0000-0000-000000000000',
        user: { username: 'username' },
        url: 'http://google.com',
        redirectTo: 'asd64SH4',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      container.linkEntity.findAll.resolves([outputObj]);

      const [error, result] = await container.linkRepository.getAll(null);

      container.linkEntity.findAll.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result.length).to.be.equal(1);
      expect(result[0]).to.be.an.instanceof(LinkModel);
      expect(result[0]).to.have.include({
        id: outputObj.id,
        userId: outputObj.userId,
        username: outputObj.user.username,
        url: outputObj.url,
        redirectTo: outputObj.redirectTo,
      });
    });
  });

  suite(`Get count`, () => {
    test(`Should error get count link`, async () => {
      const errorObj = new Error('query');
      container.linkEntity.count.throws(errorObj);

      const [error] = await container.linkRepository.getCount(null);

      container.linkEntity.count.should.have.callCount(1);
      expect(error).to.be.an.instanceof(DatabaseExecuteException);
    });

    test(`Should successfully get count link`, async () => {
      container.linkEntity.count.resolves(1);

      const [error, result] = await container.linkRepository.getCount(null);

      container.linkEntity.count.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result).to.be.equal(1);
    });
  });

  suite(`Get link by id`, () => {
    test(`Should error get link by id`, async () => {
      const inputId = '00000000-0000-0000-0000-000000000000';
      const errorObj = new Error('query');
      container.linkEntity.findAll.throws(errorObj);

      const [error] = await container.linkRepository.getById(inputId);

      container.linkEntity.findAll.should.have.callCount(1);
      expect(error).to.be.an.instanceof(DatabaseExecuteException);
    });

    test(`Should successfully get link by id when link not found`, async () => {
      const inputId = '00000000-0000-0000-0000-000000000000';
      container.linkEntity.findAll.resolves([]);

      const [error, result] = await container.linkRepository.getById(inputId);

      container.linkEntity.findAll.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result).to.be.a('null');
    });

    test(`Should successfully get link by id`, async () => {
      const inputId = '00000000-0000-0000-0000-000000000000';
      const outputObj = {
        id: '00000000-0000-0000-0000-000000000000',
        userId: '00000000-0000-0000-0000-000000000000',
        user: { username: 'username' },
        url: 'http://google.com',
        redirectTo: 'asd64SH4',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      container.linkEntity.findAll.resolves([outputObj]);

      const [error, result] = await container.linkRepository.getById(inputId);

      container.linkEntity.findAll.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result).to.be.an.instanceof(LinkModel);
      expect(result).to.have.include({
        id: outputObj.id,
        userId: outputObj.userId,
        username: outputObj.user.username,
        url: outputObj.url,
        redirectTo: outputObj.redirectTo,
      });
    });
  });

  suite(`Add new link`, () => {
    test(`Should error add new link`, async () => {
      const inputModel = new LinkModel();
      inputModel.userId = '00000000-0000-0000-0000-000000000000';
      inputModel.url = 'http://google.com';
      inputModel.redirectTo = 'g25G4S';
      const errorObj = new Error('query');
      container.linkEntity.create.throws(errorObj);

      const [error] = await container.linkRepository.add(inputModel);

      container.identifierGenerator.generateId.should.have.callCount(1);
      container.linkEntity.create.should.have.callCount(1);
      expect(error).to.be.an.instanceof(DatabaseExecuteException);
    });

    test(`Should error add new link when username exist`, async () => {
      const inputModel = new LinkModel();
      inputModel.userId = '00000000-0000-0000-0000-000000000000';
      inputModel.url = 'http://google.com';
      inputModel.redirectTo = 'g25G4S';
      const errorObj = new Error('query');
      errorObj.name = 'SequelizeUniqueConstraintError';
      container.linkEntity.create.throws(errorObj);

      const [error] = await container.linkRepository.add(inputModel);

      container.identifierGenerator.generateId.should.have.callCount(1);
      container.linkEntity.create.should.have.callCount(1);
      expect(error).to.be.an.instanceof(LinkExistException);
    });

    test(`Should successfully add new link`, async () => {
      const inputModel = new LinkModel();
      inputModel.userId = '00000000-0000-0000-0000-000000000000';
      inputModel.url = 'http://google.com';
      inputModel.redirectTo = 'g25G4S';
      const outputObj = {
        id: '00000000-0000-0000-0000-000000000000',
        userId: '00000000-0000-0000-0000-000000000000',
        url: 'http://google.com',
        redirectTo: 'g25G4S',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      container.linkEntity.create.resolves(outputObj);

      const [error, result] = await container.linkRepository.add(inputModel);

      container.identifierGenerator.generateId.should.have.callCount(1);
      container.linkEntity.create.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result).to.be.an.instanceof(LinkModel);
      expect(result).to.have.include({
        id: outputObj.id,
        userId: outputObj.userId,
        url: outputObj.url,
        redirectTo: outputObj.redirectTo,
      });
    });
  });

  suite(`Update exist link`, () => {
    test(`Should error update exist link`, async () => {
      const inputModel = new LinkModel();
      inputModel.id = '00000000-0000-0000-0000-000000000000';
      inputModel.url = 'http://google.com';
      inputModel.redirectTo = 'g25G4S';
      const errorObj = new Error('query');
      container.linkEntity.update.throws(errorObj);

      const [error] = await container.linkRepository.update(inputModel);

      container.linkEntity.update.should.have.callCount(1);
      expect(error).to.be.an.instanceof(DatabaseExecuteException);
    });

    test(`Should error update exist link when username exist`, async () => {
      const inputModel = new LinkModel();
      inputModel.id = '00000000-0000-0000-0000-000000000000';
      inputModel.url = 'http://google.com';
      inputModel.redirectTo = 'g25G4S';
      const errorObj = new Error('query');
      errorObj.name = 'SequelizeUniqueConstraintError';
      container.linkEntity.update.throws(errorObj);

      const [error] = await container.linkRepository.update(inputModel);

      container.linkEntity.update.should.have.callCount(1);
      expect(error).to.be.an.instanceof(LinkExistException);
    });

    test(`Should successfully update exist link`, async () => {
      const inputModel = new LinkModel();
      inputModel.id = '00000000-0000-0000-0000-000000000000';
      inputModel.url = 'http://google.com';
      inputModel.redirectTo = 'g25G4S';
      container.linkEntity.update.resolves([1]);

      const [error, result] = await container.linkRepository.update(inputModel);

      container.linkEntity.update.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result).to.have.equal(true);
    });
  });

  suite(`Delete exist link`, () => {
    test(`Should error delete exist link`, async () => {
      const inputId = '00000000-0000-0000-0000-000000000000';
      const errorObj = new Error('query');
      container.linkEntity.destroy.throws(errorObj);

      const [error] = await container.linkRepository.delete(inputId);

      container.linkEntity.destroy.should.have.callCount(1);
      expect(error).to.be.an.instanceof(DatabaseExecuteException);
    });

    test(`Should successfully delete exist link`, async () => {
      const inputId = '00000000-0000-0000-0000-000000000000';
      container.linkEntity.destroy.resolves(1);

      const [error, result] = await container.linkRepository.delete(inputId);

      container.linkEntity.destroy.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result).to.have.equal(true);
    });
  });
});
