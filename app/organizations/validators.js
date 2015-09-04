var Joi = require('joi');

exports.addUser = {
  params: {
    id: Joi.string().required()
  },
  body: {
    user: Joi.string().required(),
    role: Joi.string().required()
  },
  headers: {
    bearer: Joi.string().required(),
  }
};

exports.createOrganization = {
  body: {
    name: Joi.string().required(),
    description: Joi.string().required(),
    resource: Joi.object().required()
  },
  headers: {
    bearer: Joi.string().required(),
  }
};

exports.addTeam = {
  params: {
    id: Joi.string().required()
  },
  body: {
    scope: Joi.string().required(),
    name: Joi.string().required()
  },
  headers: {
    bearer: Joi.string().required(),
  }
};

exports.removeUser = {
  params: {
    id: Joi.string().required(),
    userId: Joi.string().required()
  },
  headers: {
    bearer: Joi.string().required()
  }
};

exports.getAllPackages = {
  params: {
    id: Joi.string().required(),
  }
};

exports.getAllTeams = {
  params: {
    id: Joi.string().required(),
  }
};

exports.update = {
  params: {
    id: Joi.string().required()
  },
  body: {
    description: Joi.string().required(),
    resource: Joi.string().required()
  },
  headers: {
    bearer: Joi.string().required(),
  }
};
