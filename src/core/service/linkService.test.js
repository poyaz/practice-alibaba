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

const LinkService = require('~src/core/service/linkService');
const UnknownException = require('~src/core/exception/unknownException');
const NotFoundException = require('~src/core/exception/notFoundException');
const LinkModel = require('~src/core/model/linkModel');

const ILinkRepository = require('~src/core/interface/iLinkRepository');

const expect = chai.expect;
const container = {};

suite(`LinkService`, () => {
  setup(() => {
    const linkRepository = sinon.createStubInstance(ILinkRepository);
    const baseUrlPrefix = 'https://shourtlink.com/';

    const linkService = new LinkService(linkRepository, baseUrlPrefix);

    container.linkRepository = linkRepository;
    container.baseUrlPrefix = baseUrlPrefix;
    container.linkService = linkService;
  });

  suite(`Get link by id`, () => {
    test(`Should error get link by id`, async () => {
      const inputId = '00000000-0000-0000-0000-000000000000';
      container.linkRepository.getById.resolves([new UnknownException()]);

      const [error] = await container.linkService.getById(inputId);

      container.linkRepository.getById.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should error get user by id when user not found`, async () => {
      const inputId = '00000000-0000-0000-0000-000000000000';
      container.linkRepository.getById.resolves([null, null]);

      const [error] = await container.linkService.getById(inputId);

      container.linkRepository.getById.should.have.callCount(1);
      expect(error).to.be.an.instanceof(NotFoundException);
    });

    test(`Should successfully get user by id`, async () => {
      const inputId = '00000000-0000-0000-0000-000000000000';
      const outputModel = new LinkModel();
      outputModel.id = '00000000-0000-0000-0000-000000000000';
      outputModel.userId = '00000000-0000-0000-0000-000000000000';
      outputModel.username = 'username';
      outputModel.url = 'https://google.com';
      outputModel.redirectTo = 'a63Hg67';
      outputModel.insertDate = new Date();
      outputModel.updateDate = new Date();
      container.linkRepository.getById.resolves([null, outputModel]);

      const [error, result] = await container.linkService.getById(inputId);

      container.linkRepository.getById.should.have.callCount(1);
      container.linkRepository.getById.should.have.calledWith(
        sinon.match('00000000-0000-0000-0000-000000000000'),
      );
      expect(error).to.be.a('null');
      expect(result).to.be.an.instanceof(LinkModel);
      expect(result).to.have.include({
        id: outputModel.id,
        userId: outputModel.userId,
        username: outputModel.username,
        url: outputModel.url,
        redirectTo: `${outputModel.redirectTo}`,
      });
    });
  });

  suite(`Get all link`, () => {
    test(`Should error get all link when get count has error`, async () => {
      container.linkRepository.getCount.resolves([new UnknownException()]);
      container.linkRepository.getAll.resolves([null]);

      const [error] = await container.linkService.getAll();

      container.linkRepository.getCount.should.have.callCount(1);
      container.linkRepository.getAll.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should error get all link when get all has error`, async () => {
      container.linkRepository.getCount.resolves([null]);
      container.linkRepository.getAll.resolves([new UnknownException()]);

      const [error] = await container.linkService.getAll();

      container.linkRepository.getCount.should.have.callCount(1);
      container.linkRepository.getAll.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should error get all link when get count and get all both has error`, async () => {
      container.linkRepository.getCount.resolves([new UnknownException()]);
      container.linkRepository.getAll.resolves([new UnknownException()]);

      const [error] = await container.linkService.getAll();

      container.linkRepository.getCount.should.have.callCount(1);
      container.linkRepository.getAll.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should successful get all link`, async () => {
      container.linkRepository.getCount.resolves([null, 1]);
      const outputModel1 = new LinkModel();
      outputModel1.id = '00000000-0000-0000-0000-000000000000';
      outputModel1.userId = '00000000-0000-0000-0000-000000000000';
      outputModel1.username = 'username';
      outputModel1.url = 'https://google.com';
      outputModel1.redirectTo = 'a63Hg67';
      outputModel1.insertDate = new Date();
      outputModel1.updateDate = new Date();
      container.linkRepository.getAll.resolves([null, [outputModel1]]);

      const [error, result, count] = await container.linkService.getAll(null);

      container.linkRepository.getCount.should.have.callCount(1);
      container.linkRepository.getAll.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result.length).to.be.equal(1);
      expect(result[0]).to.be.an.instanceof(LinkModel);
      expect(result[0]).to.have.include({
        id: outputModel1.id,
        userId: outputModel1.userId,
        username: outputModel1.username,
        url: outputModel1.url,
        redirectTo: `${outputModel1.redirectTo}`,
      });
      expect(count).to.be.equal(1);
    });
  });

  suite(`Add new link`, () => {
    test(`Should error add new link when check url`, async () => {
      const inputModel = new LinkModel();
      inputModel.userId = '00000000-0000-0000-0000-000000000000';
      inputModel.username = 'username';
      inputModel.url = 'https://google.com';
      container.linkRepository.checkRedirectUrl.resolves([new UnknownException()]);

      const [error] = await container.linkService.add(inputModel);

      container.linkRepository.checkRedirectUrl.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should error add new link`, async () => {
      const inputModel = new LinkModel();
      inputModel.userId = '00000000-0000-0000-0000-000000000000';
      inputModel.username = 'username';
      inputModel.url = 'https://google.com';
      container.linkRepository.checkRedirectUrl.resolves([null, []]);
      container.linkRepository.add.resolves([new UnknownException()]);

      const [error] = await container.linkService.add(inputModel);

      container.linkRepository.checkRedirectUrl.should.have.callCount(1);
      container.linkRepository.add.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should successful add new link (without generate)`, async () => {
      const inputModel = new LinkModel();
      inputModel.userId = '00000000-0000-0000-0000-000000000000';
      inputModel.username = 'username';
      inputModel.redirectTo = 'a63Hg67';
      inputModel.url = 'https://google.com';
      const outputModel = new LinkModel();
      outputModel.id = '00000000-0000-0000-0000-000000000000';
      outputModel.userId = '00000000-0000-0000-0000-000000000000';
      outputModel.username = 'username';
      outputModel.url = 'https://google.com';
      outputModel.redirectTo = 'a63Hg67';
      outputModel.insertDate = new Date();
      outputModel.updateDate = new Date();
      container.linkRepository.add.resolves([null, outputModel]);

      const [error, result] = await container.linkService.add(inputModel);

      container.linkRepository.checkRedirectUrl.should.have.callCount(0);
      container.linkRepository.add.should.have.callCount(1);
      container.linkRepository.add.should.have.calledWith(
        sinon.match.has('redirectTo', 'a63Hg67'),
      );
      expect(error).to.be.a('null');
      expect(result).to.be.an.instanceof(LinkModel);
      expect(result).to.have.include({
        id: outputModel.id,
        userId: outputModel.userId,
        username: outputModel.username,
        url: outputModel.url,
        redirectTo: `${outputModel.redirectTo}`,
      });
    });

    test(`Should successful add new link (with generate)`, async () => {
      const inputModel = new LinkModel();
      inputModel.userId = '00000000-0000-0000-0000-000000000000';
      inputModel.username = 'username';
      inputModel.url = 'https://google.com';
      const outputModel = new LinkModel();
      outputModel.id = '00000000-0000-0000-0000-000000000000';
      outputModel.userId = '00000000-0000-0000-0000-000000000000';
      outputModel.username = 'username';
      outputModel.url = 'https://google.com';
      outputModel.redirectTo = '123HFAf';
      outputModel.insertDate = new Date();
      outputModel.updateDate = new Date();
      container.linkRepository.checkRedirectUrl.resolves([null, []]);
      container.linkRepository.add.resolves([null, outputModel]);

      const [error, result] = await container.linkService.add(inputModel);

      container.linkRepository.checkRedirectUrl.should.have.callCount(1);
      container.linkRepository.add.should.have.callCount(1);
      container.linkRepository.add.should.have.calledWith(
        sinon.match.has('redirectTo', sinon.match.string),
      );
      expect(error).to.be.a('null');
      expect(result).to.be.an.instanceof(LinkModel);
      expect(result).to.have.include({
        id: outputModel.id,
        userId: outputModel.userId,
        username: outputModel.username,
        url: outputModel.url,
        redirectTo: `${outputModel.redirectTo}`,
      });
    });
  });

  suite(`Update link`, () => {
    setup(() => {
      container.linkServiceGetById = sinon.stub(container.linkService, 'getById');
    });

    test(`Should error update link`, async () => {
      const inputModel = new LinkModel();
      inputModel.id = '00000000-0000-0000-0000-000000000000';
      inputModel.id.url = 'https://google.com';
      inputModel.id.redirectTo = 'a63Hg67';
      container.linkServiceGetById.resolves([new UnknownException()]);

      const [error] = await container.linkService.update(inputModel);

      container.linkServiceGetById.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should successfully update link`, async () => {
      const inputModel = new LinkModel();
      inputModel.id = '00000000-0000-0000-0000-000000000000';
      inputModel.id.url = 'https://google.com';
      inputModel.id.redirectTo = 'a63Hg67';
      container.linkServiceGetById.resolves([null]);
      container.linkRepository.update.resolves([null, true]);

      const [error, result] = await container.linkService.update(inputModel);

      container.linkServiceGetById.should.have.callCount(1);
      container.linkRepository.update.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result).to.be.equal(true);
    });
  });

  suite(`Delete link`, () => {
    setup(() => {
      container.linkServiceGetById = sinon.stub(container.linkService, 'getById');
    });

    test(`Should error delete link`, async () => {
      const inputId = '00000000-0000-0000-0000-000000000000';
      container.linkServiceGetById.resolves([new UnknownException()]);

      const [error] = await container.linkService.delete(inputId);

      container.linkServiceGetById.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should successfully delete link`, async () => {
      const inputId = '00000000-0000-0000-0000-000000000000';
      container.linkServiceGetById.resolves([null]);
      container.linkRepository.delete.resolves([null, true]);

      const [error, result] = await container.linkService.delete(inputId);

      container.linkServiceGetById.should.have.callCount(1);
      container.linkRepository.delete.should.have.callCount(1);
      expect(error).to.be.a('null');
      expect(result).to.be.equal(true);
    });
  });
});
