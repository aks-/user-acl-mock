var util = require('util');
var dbQuery = require('./db/queries.js');

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
    res.status(error.statusCode).json({ 
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
    res.status(error.status).json({
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
};

exports.removeUser = function(req, res, next) {
  var bearer = req.get('bearer');
  var id = req.body.id;
  var userId = req.body.userId;

  //TODO: call dbQuery.removeUser
};

exports.getAllPackages = function(req, res, next) {};

exports.getAllTeams = function(req, res, next) {};

//TODO: invalidate all package permissions for a given org. Get more details on it

//TODO: to be tested
exports.update = function(req, res, next) {
  var bearer = req.get('bearer');
  var id = req.params.id;
  var description = req.body.description;
  var resource = req.body.resource;

  //TODO
};
