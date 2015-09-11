var Boom = require('boom');
var util = require('util');
var dbQuery = require('./db/queries');

exports.getLicense = function(req, res, next) {
  var name = req.params.name;

  dbQuery.getLicense(name)
    .then(function(result) {
      res.status(200)
        .json(result);
    })
    .catch(function(error) {
      if (!error.isBoom) {
        error = Boom.wrap(error, 400);
      }
      res.status(error.output.statusCode).json({
        error: error,
        message: "Something went wrong while fetching license."
      });
    });
};

