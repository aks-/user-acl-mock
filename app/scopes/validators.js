var Joi = require('joi');

exports.getLicense = {
  params: {
    name: Joi.string().required(),
  },
};

