/**
 * Created by pooya on 8/23/21.
 */

const Joi = require('joi');

const IHttpMiddleware = require('~src/api/interface/iHttpMiddleware');

const SchemaValidatorException = require('~src/core/exception/schemaValidatorException');

class AddLinkValidationMiddleware extends IHttpMiddleware {
  #req;
  #res;

  constructor(req, res) {
    super();

    this.#req = req;
    this.#res = res;
  }

  async act() {
    const { body } = this.#req;

    const redirectPattern = Joi.string()
      .regex(/^[a-zA-Z0-9]{4,20}/)
      .required();

    const schema = Joi.object({
      url: Joi.string().uri().required(),
      redirectTo: redirectPattern,
    });

    const result = schema.validate(body);
    if (result.error) {
      throw new SchemaValidatorException(result.error);
    }
  }
}

module.exports = AddLinkValidationMiddleware;
