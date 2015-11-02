var express = require('express');
var handlers = require('./handlers.js');
var app = module.exports = express();
var validate = require('express-validation');
var validators = require('./validators');

for (var key in handlers) {
  switch (key) {
    case 'getPackages':
      method = 'get';
      path = '/package';
      break;
    case 'getAllCollaborators':
      method = 'get';
      path = '/package/:id/collaborators';
      break;
    case 'getPackageCount':
      method = 'get';
      path = '/package/-/count';
      break;
  }

  var handler = handlers[key];
  var validatorForRoute = (validators[key] || {});

  if (validatorForRoute) {
    var validator = validate(validatorForRoute);
    app[method](path, validator, handler);
  }
}
