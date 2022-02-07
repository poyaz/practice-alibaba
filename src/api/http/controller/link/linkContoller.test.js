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
 
 const LinkController = require('~src/api/http/controller/links/linkController');
 const UnknownException = require('~src/core/exception/unknownException');
 const LinkModel = require('~src/core/model/linkModel');
 const DateTime = require('~src/infrastructure/system/dateTime');
 
 const ILinkService = require('~src/core/interface/iLinkService');
 
 const expect = chai.expect;
 const container = {};
 
 suite(`LinkController`, () => {
   setup(() => {
     const req = new createRequest();
     const res = new createResponse();
 
     const linkService = sinon.createStubInstance(ILinkService);
     const dateTime = new DateTime();
 
     const linkController = new LinkController(req, res, linkService, dateTime);
 
     container.req = req;
     container.res = res;
     container.linkService = linkService;
     container.linkController = linkController;
     container.dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/;
   });
 
   suite(`Get all link`, () => {
     test(`Should error get all link`, async () => {
       container.req.query = {};
       container.linkService.getAll.resolves([new UnknownException()]);
 
       const [error] = await container.linkController.getAll();
 
       container.linkService.getAll.should.have.callCount(1);
       expect(error).to.be.an.instanceof(UnknownException);
     });
 
     test(`Should successfully get all link`, async () => {
      container.req.query = {};
       const outputModel1 = new LinksModel();
       outputModel1.id = '00000000-0000-0000-0000-000000000000';
       outputModel1.userId = '00000000-0000-0000-0000-000000000000';
       outputModel1.username = 'username';
       outputModel1.url = 'https://google.com';
       outputModel1.redirectTo = 'https://shourtlink.com/a63Hg67';
       outputModel1.insertDate = new Date();
       outputModel1.updateDate = new Date();
       container.linkService.getAll.resolves([null, [outputModel1]]);
 
       const [error, result] = await container.linkController.getAll();
 
       container.linkService.getAll.should.have.callCount(1);
       expect(error).to.be.a('null');
       expect(result.length).to.be.equal(1);
       expect(result[0]).to.be.a('object');
       expect(result[0]).to.have.include({
         id: outputModel1.id,
         userId: outputModel1.id,
         username: outputModel1.id,
         url: outputModel1.url,
         redirectTo: outputModel1.redirectTo,
       });
       expect(result[0].insertDate).to.have.match(container.dateRegex);
       expect(result[0].updateDate).to.have.match(container.dateRegex);
     });

     test(`Should successfully get all link with default page and limit`, async () => {
      container.req.query = {};
       container.linkService.getAll.resolves([null, []]);
 
       const [error, result] = await container.linkController.getAll();
 
       container.linkService.getAll.should.have.callCount(1);
       container.linkService.getAll.should.have.calledWith(
        sinon.match.has('page', 1)
        .and(sinon.match.has('limit', 10)),
      );
       expect(error).to.be.a('null');
       expect(result.length).to.be.equal(0);
     });

     test(`Should successfully get all link with custom page and default limit`, async () => {
      container.req.query = {page: 3};
       container.linkService.getAll.resolves([null, []]);
 
       const [error, result] = await container.linkController.getAll();
 
       container.linkService.getAll.should.have.callCount(1);
       container.linkService.getAll.should.have.calledWith(
        sinon.match.has('page', 3)
        .and(sinon.match.has('limit', 10)),
      );
       expect(error).to.be.a('null');
       expect(result.length).to.be.equal(0);
     });

     test(`Should successfully get all link with default page and custom limit`, async () => {
      container.req.query = {limit: 20};
       container.linkService.getAll.resolves([null, []]);
 
       const [error, result] = await container.linkController.getAll();
 
       container.linkService.getAll.should.have.callCount(1);
       container.linkService.getAll.should.have.calledWith(
        sinon.match.has('page', 1)
        .and(sinon.match.has('limit', 20)),
      );
       expect(error).to.be.a('null');
       expect(result.length).to.be.equal(0);
     });

     test(`Should successfully get all link with custom page and custom limit`, async () => {
      container.req.query = {page: 2, limit: 20};
       container.linkService.getAll.resolves([null, []]);
 
       const [error, result] = await container.linkController.getAll();
 
       container.linkService.getAll.should.have.callCount(1);
       container.linkService.getAll.should.have.calledWith(
        sinon.match.has('page', 2)
        .and(sinon.match.has('limit', 20)),
      );
       expect(error).to.be.a('null');
       expect(result.length).to.be.equal(0);
     });
   });

   suite(`Add new link`, () => {
    test(`Should error add new link`, async () => {
      container.req.params = {userId: '00000000-0000-0000-0000-000000000000'};
      container.req.body = {url: 'https://google.com'};
      container.linkService.add.resolves([new UnknownException()]);

      const [error] = await container.linkController.addLink();

      container.linkService.add.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should successfully add new link`, async () => {
      container.req.params = {userId: '00000000-0000-0000-0000-000000000000'};
      container.req.body = {url: 'https://google.com'};
       const outputModel = new LinksModel();
       outputModel.id = '00000000-0000-0000-0000-000000000000';
       outputModel.userId = '00000000-0000-0000-0000-000000000000';
       outputModel.username = 'username';
       outputModel.url = 'https://google.com';
       outputModel.redirectTo = 'https://shourtlink.com/a63Hg67';
       outputModel.insertDate = new Date();
       outputModel.updateDate = new Date();
       container.linkService.add.resolves([null, outputModel]);
 
       const [error, result] = await container.linkController.addLink();
 
       container.linkService.add.should.have.callCount(1);
       expect(error).to.be.a('null');
       expect(result.length).to.be.equal(1);
       expect(result[0]).to.be.a('object');
       expect(result[0]).to.have.include({
         id: outputModel.id,
         userId: outputModel.id,
         username: outputModel.id,
         url: outputModel.url,
         redirectTo: outputModel.redirectTo,
       });
       expect(result[0].insertDate).to.have.match(container.dateRegex);
       expect(result[0].updateDate).to.have.match(container.dateRegex);
     });
   });

   suite(`Update link`, () => {
    test(`Should error update link`, async () => {
      container.req.params = {
        userId: '00000000-0000-0000-0000-000000000000',
        linkId: '00000000-0000-0000-0000-000000000000',
      };
      container.req.body = {
        url: 'https://google.com', 
        redirectTo: 'https://shourtlink.com/a63Hg67',
      };
      container.linkService.update.resolves([new UnknownException()]);

      const [error] = await container.linkController.updateLink();

      container.linkService.add.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should successfully update link`, async () => {
      container.req.params = {
        userId: '00000000-0000-0000-0000-000000000000',
        linkId: '00000000-0000-0000-0000-000000000000',
      };
      container.req.body = {
        url: 'https://google.com', 
        redirectTo: 'https://shourtlink.com/a63Hg67',
      };
       container.linkService.update.resolves([null, true]);
 
       const [error, result] = await container.linkController.updateLink();
 
       container.linkService.add.should.have.callCount(1);
       expect(error).to.be.a('null');
       expect(result).to.be.a('boolean');
       expect(result).to.be.equal(true);
     });
   });

   suite(`Delete link`, () => {
    test(`Should error delete link`, async () => {
      container.req.params = {
        userId: '00000000-0000-0000-0000-000000000000',
        linkId: '00000000-0000-0000-0000-000000000000',
      };
      container.linkService.delete.resolves([new UnknownException()]);

      const [error] = await container.linkController.deleteLink();

      container.linkService.add.should.have.callCount(1);
      expect(error).to.be.an.instanceof(UnknownException);
    });

    test(`Should successfully add new link`, async () => {
      container.req.params = {
        userId: '00000000-0000-0000-0000-000000000000',
        linkId: '00000000-0000-0000-0000-000000000000',
      };
       container.linkService.delete.resolves([null, true]);
 
       const [error] = await container.linkController.deleteLink();
 
       container.linkService.add.should.have.callCount(1);
       expect(error).to.be.a('null');
     });
   });
 });
 