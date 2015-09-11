var express = require('express');
var handlers = require('./handlers.js');
var app = module.exports = express();

for (var key in handlers) {
  switch (key) {
    case 'getAllOrganizations':
      method = 'get';
      path = '/user/:id/org';
      break;
  }

  var handler = handlers[key];
  if (handlers.before) {
    app[method](path, handlers.before, handler);
  } else {
    app[method](path, handler);
  }
}
