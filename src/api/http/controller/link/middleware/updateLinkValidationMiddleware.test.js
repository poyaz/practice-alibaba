/**
 * Created by pooya on 8/23/21.
 */

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const { createRequest, createResponse } = require('node-mocks-http');

const SchemaValidatorException = require('~src/core/exception/schemaValidatorException');

chai.should();
chai.use(dirtyChai);
chai.use(sinonChai);
chai.use(chaiAsPromised);

const UpdateLinkValidationMiddleware = require('~src/api/http/controller/link/middleware/updateLinkValidationMiddleware');

/**
 * @property eventually
 * @property rejectedWith
 */
const expect = chai.expect;
const container = {};

suite(`AddLinkValidation`, () => {
  setup(() => {
    const req = new createRequest();
    const res = new createResponse();

    const updateLinkValidationMiddleware = new UpdateLinkValidationMiddleware(req, res);

    container.req = req;
    container.res = res;
    container.updateLinkValidationMiddleware = updateLinkValidationMiddleware;
  });

  test(`Should error for add new link if send empty body`, async () => {
    container.req.body = {};

    const badCall = container.updateLinkValidationMiddleware.act();

    await expect(badCall)
      .to.eventually.have.rejectedWith(SchemaValidatorException)
      .and.have.property('httpCode', 400)
      .and.have.nested.property('additionalInfo[0].message', `"url" is required`);
  });

  test(`Should error for add new link if redirectTo not exits`, async () => {
    container.req.body = { url: 'http://example.com' };

    const badCall = container.updateLinkValidationMiddleware.act();

    await expect(badCall)
      .to.eventually.have.rejectedWith(SchemaValidatorException)
      .and.have.property('httpCode', 400)
      .and.have.nested.property('additionalInfo[0].message', `"redirectTo" is required`);
  });

  test(`Should error for add new link if username invalid`, async () => {
    container.req.body = { url: '123', redirectTo: '123456' };

    const badCall = container.updateLinkValidationMiddleware.act();

    await expect(badCall)
      .to.eventually.have.rejectedWith(SchemaValidatorException)
      .and.have.property('httpCode', 400)
      .and.have.nested.property(
        'additionalInfo[0].message',
        `"url" must be a valid uri`,
      );
  });

  test(`Should error for add new link if password invalid`, async () => {
    container.req.body = { url: 'http://example.com', redirectTo: '15%#@' };

    const badCall = container.updateLinkValidationMiddleware.act();

    await expect(badCall)
      .to.eventually.have.rejectedWith(SchemaValidatorException)
      .and.have.property('httpCode', 400)
      .and.have.nested.property(
        'additionalInfo[0].message',
        `"redirectTo" with value "15%#@" fails to match the required pattern: /^[a-zA-Z0-9]{4,20}$/`,
      );
  });

  test(`Should successfully for add new link`, async () => {
    container.req.body = { url: 'http://example.com', redirectTo: 'H255Ssh4' };

    await container.updateLinkValidationMiddleware.act();
  });
});
