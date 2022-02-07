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

const AddUserValidationMiddleware = require('~src/api/http/controller/users/middleware/addUserValidationMiddleware');

/**
 * @property eventually
 * @property rejectedWith
 */
const expect = chai.expect;
const container = {};

suite(`AddUserValidation`, () => {
  setup(() => {
    const req = new createRequest();
    const res = new createResponse();

    const addUserValidationMiddleware = new AddUserValidationMiddleware(req, res);

    container.req = req;
    container.res = res;
    container.addUserValidationMiddleware = addUserValidationMiddleware;
  });

  test(`Should error for add new user if send empty body`, async () => {
    container.req.body = {};

    const badCall = container.addUserValidationMiddleware.act();

    await expect(badCall)
      .to.eventually.have.rejectedWith(SchemaValidatorException)
      .and.have.property('httpCode', 400)
      .and.have.nested.property('additionalInfo[0].message', `"username" is required`);
  });

  test(`Should error for add new user if password not exits`, async () => {
    container.req.body = { username: 'my_username' };

    const badCall = container.addUserValidationMiddleware.act();

    await expect(badCall)
      .to.eventually.have.rejectedWith(SchemaValidatorException)
      .and.have.property('httpCode', 400)
      .and.have.nested.property('additionalInfo[0].message', `"password" is required`);
  });

  test(`Should error for add new user if username invalid`, async () => {
    container.req.body = { username: 'my$username|', password: '123456' };

    const badCall = container.addUserValidationMiddleware.act();

    await expect(badCall)
      .to.eventually.have.rejectedWith(SchemaValidatorException)
      .and.have.property('httpCode', 400)
      .and.have.nested.property(
        'additionalInfo[0].message',
        `"username" with value "my$username|" fails to match the required pattern: /^[a-zA-Z0-9_.]{3,20}/`,
      );
  });

  test(`Should error for add new user if password invalid`, async () => {
    container.req.body = { username: 'my_username', password: '123' };

    const badCall = container.addUserValidationMiddleware.act();

    await expect(badCall)
      .to.eventually.have.rejectedWith(SchemaValidatorException)
      .and.have.property('httpCode', 400)
      .and.have.nested.property(
        'additionalInfo[0].message',
        `"password" length must be at least 6 characters long`,
      );
  });

  test(`Should error for add new user if repeat_password not exits`, async () => {
    container.req.body = { username: 'my_username', password: '123456' };

    const badCall = container.addUserValidationMiddleware.act();

    await expect(badCall)
      .to.eventually.have.rejectedWith(SchemaValidatorException)
      .and.have.property('httpCode', 400)
      .and.have.nested.property('additionalInfo[0].message', `"repeat_password" is required`);
  });

  test(`Should error for add new user if password and repeat_password not equal`, async () => {
    container.req.body = { username: 'my_username', password: '123456', repeat_password: '1' };

    const badCall = container.addUserValidationMiddleware.act();

    await expect(badCall)
      .to.eventually.have.rejectedWith(SchemaValidatorException)
      .and.have.property('httpCode', 400)
      .and.have.nested
      .property('additionalInfo[0].message', `"repeat_password" must be [ref:password]`);
  });

  test(`Should successfully for add new user`, async () => {
    container.req.body = { username: 'my_username', password: '123456', repeat_password: '123456' };

    await container.addUserValidationMiddleware.act();
  });
});
