var Joi = require('joi');

exports.getPackages = {
  query: {
    sort: Joi.string().optional(),
    count: Joi.string().optional(),
    author: Joi.string().optional(),
    scope: Joi.string().optional(),
    keyword: Joi.string().optional(),
    dependencts: Joi.string().optional(),
    name: Joi.string().optional(),
    created: Joi.string().optional(),
    modified: Joi.string().optional(),
    dependents: Joi.string().optional(),
    starts: Joi.string().optional(),
    downloads: Joi.string().optional(),
  },
  headers: {
    bearer: Joi.string().required()
  }
};
