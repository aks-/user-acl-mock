var Joi = require('joi');

exports.addPackage = {
  params: {
    id: Joi.string().required(),
    scope: Joi.string().required()
  },
  body: {
    package: Joi.string().required(),
    permissions: Joi.string().required()
  },
  headers: {
    bearer: Joi.string().required(),
  }
};

exports.addUser = {
  params: {
    id: Joi.string().required(),
    scope: Joi.string().required()
  },
  body: {
    user: Joi.string().required(),
  },
  headers: {
    bearer: Joi.string().required(),
  }
};

//TODO
exports.listAllPackages = {};

exports.listAllUsers = {};

exports.removePackage = {
  params: {
    id: Joi.string().required(),
    scope: Joi.string().required()
  },
  body: {
    package: Joi.string().required(),
  },
  headers: {
    bearer: Joi.string().required(),
  }
};

exports.removeUser = {
  params: {
    id: Joi.string().required(),
    scope: Joi.string().required()
  },
  body: {
    user: Joi.string().required(),
  },
  headers: {
    bearer: Joi.string().required(),
  }
};

exports.getTeam = {
  params: {
    id: Joi.string().required(),
    scope: Joi.string().required()
  },
  headers: {
    bearer: Joi.string().required(),
  }
};

exports.remove = {
  params:   {
    id:     Joi.string().required(),
    scope:  Joi.string().required()
  },
  headers:  {
    bearer: Joi.string().required(),
  }
};

exports.update = {
  params:   {
    id:     Joi.string().required(),
    scope:  Joi.string().required()
  },
  headers:  {
    bearer: Joi.string().required(),
  }
};
