var express = require('express');
var handlers = require('./handlers');
var app = module.exports = express();
var validate = require('express-validation');
var validators = require('./validators');

for (var key in handlers) {
  switch (key) {
    case 'addUser':
      method = 'put';
      path = '/org/:id/user';
      break;
    case 'removeUser':
      method = 'delete';
      path = '/org/:id/user/:userId';
      break;
    case 'createOrganization':
      method = 'put';
      path = '/org';
      break;
    case 'addTeam':
      method = 'put';
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
      path = '/org/:id';
      break;
  }

  var handler = handlers[key];
  var validatorForRoute = (validators[key] || {});

  //NOTE: Can add middlewares like validators if needed
  if (validatorForRoute) {
    var validator = validate(validatorForRoute);
    app[method](path, validator, handler);
  }
}
