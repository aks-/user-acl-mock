var express = require('express');
var handlers = require('./handlers.js');
var app = module.exports = express();

for (var key in handlers) {
  switch (handler) {
    case 'addPackage':
      method = 'put';
      path = '/team/:scope/:id/package';
      break;
    case 'addUser':
      method = 'put';
      path = '/team/:scope/:id/user';
      break;
    case 'listAllPackages':
      method = 'get'
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
  if (handlers.before) {
    app[method](path, handlers.before, handler);
  } else {
    app[method](path, handler);
  }
}
