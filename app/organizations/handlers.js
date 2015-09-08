var dbQuery = require('./db/queries.js');
var util = require('util');
var Boom = require('boom');

exports.addUser = function(req, res, next) {
  var bearer = req.get('bearer');
  var user = req.body.user;
  var role = req.body.role;
  var id = req.params.id;
  dbQuery.addUser(id, bearer, user, role)
  .then(function(result) {
    res.json(result);
  })
  //handle the errors on caller side
  .catch(function(error) {
    if (!error.isBoom) {
      error = Boom.wrap(error, 400);
    }
    res.status(error.output.statusCode).json({ 
      error: error,
      message: "Couldn't add user " + user + " to the organization(" + id + ")"
    }); 
  });
};

exports.createOrganization = function(req, res, next) {
  var bearer = req.get('bearer');
  var name = req.body.name;
  var description = req.body.description;
  var resource = req.body.resource;
  dbQuery.create(bearer, name, description, resource)
  .then(function(result) {
    res.json(result);
  })
  .catch(function(error) {
    if (!error.isBoom) {
      error = Boom.wrap(error, 400);
    }
    res.status(error.output.statusCode).json({
      error: error,
      message: "Couldn't create organization"
    });
  });
};

exports.addTeam = function(req, res, next) {
  var bearer = req.get('bearer');
  var id = req.params.id;
  var scope = req.body.scope;
  var name = req.body.name;

  //TODO: call dbQuery.addTeam
  dbQuery.addTeam(id, scope, name)
  .then(function(result) {
    res.json(result);
  })
  .catch(function(error) {
    if (!error.isBoom) {
      error = Boom.wrap(error, 400);
    }
    res.status(error.output.statusCode).json({
      error: error,
      message: "Couldn't add team to this organization."
    });
  });
};

exports.removeUser = function(req, res, next) {
  var bearer = req.get('bearer');
  var id = req.params.id;
  var userId = req.params.userId;

  //TODO: call dbQuery.removeUser
  dbQuery.removeUser(id, userId)
  .then(function(result) {
    res.json(result);
  })
  .catch(function(error) {
    if (!error.isBoom) {
      error = Boom.wrap(error, 400);
    }
    res.status(error.output.statusCode).json({
      error: error,
      message: "Could not remove user" + userId + "from organization" + id
    });
  });
};

exports.getAllPackages = function(req, res, next) {};

exports.getAllTeams = function(req, res, next) {
  var id = req.params.id;
  dbQuery.getAllTeams(id)
  .then(function(result) {
    res.json(result);
  })
  .catch(function(error) {
    if (!error.isBoom) {
      error = Boom.wrap(error, 400);
    }
    res.status(error.output.statusCode).json({
      error: error,
      message: "Couldn't get all teams for this organization."
    });
  });
};

//TODO: invalidate all package permissions for a given org. Get more details on it

exports.update = function(req, res, next) {
  var bearer = req.get('bearer');
  var id = req.params.id;
  var description = req.body.description;
  var resource = req.body.resource;
  
  //TODO
  dbQuery.update(id, description, resource)
  .then(function(result) {
    res.json(result);
  })
  .catch(function(error) {
    if (!error.isBoom) {
      error = Boom.wrap(error, 400);
    }
    res.status(error.output.statusCode).json({
      error: error,
      message: "Couln't update organization " + id
    });
  }); 
};
