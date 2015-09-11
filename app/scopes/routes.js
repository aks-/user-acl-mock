var express = require('express');
var handlers = require('./handlers');
var app = module.exports = express();
var validate = require('express-validation');
var validators = require('./validators');

for (var key in handlers) {
  switch (key) {
    case 'getLicense':
      method = 'get';
      path = '/scope/:name/license';
      break;
  }

  var handler = handlers[key];
  var validatorForRoute = (validators[key] || {});

  if (validatorForRoute) {
    var validator = validate(validatorForRoute);
    app[method](path, validator, handler);
  }
}
