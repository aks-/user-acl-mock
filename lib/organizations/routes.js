var express = require('express');
var handlers = require('./handlers');
var app = module.exports = express();
var validate = require('express-validation');
var validators = require('./validators');

for (var key in handlers) {
  switch (key) {
    case 'addUser':
      method = 'put';
      validatorForRoute = validators[key];
      path = '/org/:id/user';
      break;
    case 'removeUser':
      method = 'delete';
      validatorForRoute = validators[key];
      path = '/org/:id/user/:userId';
      break;
    case 'createOrganization':
      method = 'put';
      validatorForRoute = validators[key];
      path = '/org';
      break;
    case 'addTeam':
      method = 'put';
      validatorForRoute = validators[key];
      path = '/org/:id/team';
      break;
    case 'getAllPackages':
      method = 'get';
      path = '/org/:id/package';
      break;
    case 'getAllTeams':
      method = 'get';
      path = '/org/:id/team';
      break;
    case 'update':
      method = 'post';
      validatorForRoute = validators[key];
      path = '/org/:id';
      break;
  }

  var handler = handlers[key];
  if (handlers.before && validatorForRoute) {
    var validator = validate(validatorForRoute);
    app[method](path, handlers.before, validator, handler);
  } else if (handlers.before) {
    app[method](path, handlers.before, handler);
  } else if (validatorForRoute) {
    var validator = validate(validatorForRoute);
    app[method](path, validator, handler);
  } else {
    app[method](path, handler);
  }
}
