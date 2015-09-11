var Boom = require('boom');
var util = require('util');
var dbQuery = require('./db/queries');

exports.addPackage = function(req, res, next) {
  var id = req.params.id;
  var scope = req.params.scope;
  var package = req.body.package;
  var permissions = req.body.permissions;

  dbQuery.addPackage(id, scope, package, permissions)
  .then(function() {
    res.status(200).json({});
  })
  .catch(function(error) {
    if (!error.isBoom) {
      error = Boom.wrap(error, 400);
    }
    res.status(error.output.statusCode).json({
      error: error,
      message: "Couldn't add package " + package + " to team " + id + "("+ scope +")"
    });
  });
};

exports.addUser = function(req, res, next) {
  //TODO: add validator for  this
  var id = req.params.id;
  var scope = req.params.scope;
  var user = req.body.user;

  dbQuery.addUser(id, scope, user)
  .then(function() {
    res.status(200).json({});
  })
  .catch(function(error) {
    if (!error.isBoom) {
      error = Boom.wrap(error, 400);
    }
    res.status(error.output.statusCode).json({
      error: error,
      message: "Could not add user " + user + " to the team " + id + "."
    });
  });
};

//TODO: what's return type and what's where and key thingy
exports.listAllPackages = function(req, res, next) {};

//TODO same as above
exports.listAllUsers = function(req, res, next) {};

exports.removePackage = function(req, res, next) {
  var id = req.params.id;
  var scope = req.params.scope;
  var package = req.body.package;

  dbQuery.removePackage(id, scope, package)
  .then(function() {
    res.status(200).json({});
  })
  .catch(function(error) {
    if (!error.isBoom) {
      error = Boom.wrap(error, 400);
    }
    res.status(error.output.statusCode).json({
      error: error,
      message: "Could not remove  " + package + " from the team " + id + "."
    });
  });
};

exports.removeUser = function(req, res, next) {
  var id = req.params.id;
  var scope = req.params.scope;
  var user = req.body.user;

  dbQuery.removeUser(id, scope, user)
  .then(function() {
    res.status(200).json({});
  })
  .catch(function(error) {
    if (!error.isBoom) {
      error = Boom.wrap(error, 400);
    }
    res.status(error.output.statusCode).json({
      error: error,
      message: "Could not remove  " + user + " from the team " + id + "."
    });
  });
};

exports.getTeam = function(req, res, next) {
  var id = req.params.id;
  var scope = req.params.scope;

  dbQuery.getTeam(id, scope)
  .then(function() {
    res.status(200).json({});
  })
  .catch(function(error) {
    if (!error.isBoom) {
      error = Boom.wrap(error, 400);
    }
    res.status(error.output.statusCode).json({
      error: error,
      message: "Could not get team " + id + "."
    });
  });
};

exports.remove = function(req, res, next) {
  var id = req.params.id;
  var scope = req.params.scope;

  dbQuery.remove(id, scope)
  .then(function() {
    res.status(200).json({});
  })
  .catch(function(error) {
    if (!error.isBoom) {
      error = Boom.wrap(error, 400);
    }
    res.status(error.output.statusCode).json({
      error: error,
      message: "Could not remove team " + id
    });
  });
};

//TODO: remove this test method and update it correctly
exports.update = function(req, res, next) {
  var id = req.params.id;
  var scope = req.params.scope;
  dbQuery.update(id, scope);
};
