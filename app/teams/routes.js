var express = require('express');
var handlers = require('./handlers');
var app = module.exports = express();
var validate = require('express-validation');
var validators = require('./validators');

for (var key in handlers) {
  switch (key) {
    case 'addPackage':
      method = 'put';
      path = '/team/:scope/:id/package';
      break;
    case 'addUser':
      method = 'put';
      path = '/team/:scope/:id/user';
      break;
    case 'listAllPackages':
      method = 'get';
      path = '/team/:scope/:team/package';
      break;
    case 'listAllUsers':
      method = 'get';
      path = '/team/:scope/:team/user';
      break;
    case 'removePackage':
      method = 'delete';
      path = '/team/:scope/:id/package';
      break;
    case 'removeUser':
      method = 'delete';
      path = '/team/:scope/:id/user';
      break;
    case 'getTeam':
      method = 'get';
      path = '/team/:scope/:id';
      break;
    case 'remove':
      method = 'delete';
      path = '/team/:scope/:id';
      break;
    case 'update':
      method = 'post';
      path = '/team/:scope/:id';
      break;
  }

  var handler = handlers[key];
  var validatorForRoute = (validators[key] || {});

  if (validatorForRoute) {
    var validator = validate(validatorForRoute);
    app[method](path, validator, handler);
  }
}
