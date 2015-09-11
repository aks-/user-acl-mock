var dbQuery = require('./db/queries');
var Boom = require('boom');
var util = require('util');

//TODO what's return type
exports.getAllOrganizations = function(req, res, next) {
  var id = req.params.id;

  dbQuery.getAllOrganizations(id)
  .then(function() {
    res.status(200).json({});
  })
  .catch(function(error) {
    if (!error.isBoom) {
      error = Boom.wrap(error, 400);
    }
    res.status(error.output.statusCode).json({
      error: error,
      message: "Couldn't get packages for given user."
    });
  });
};

//TODO, how to check the permissions where is that defined? Is it same as checking the permission of read and write for bearer and then show if he has permisssions?
exports.listAllPackages = function(req, res, next) {};
