var dbQuery = require('./db/queries.js');
var util = require('util');
var Boom = require('boom');

//TODO what are collaborators, teams too? HEH
exports.getAllCollaborators = function(req, res, next) {};

exports.getPackages = function(req, res, next) {
  //  TODO all the bearers, pagination stuff here and in validataions
  //  is it responisbility of caller to
  //  check whether there are not more than
  //  three params sent.
  //  if there are two one of them should be sort?

  var query = req.query;

  switch(Object.keys(query).length) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      //check if one of them is sort? NO? fuck you!
      if (!query.hasOwnProperty('sort') && !query.hasOwnProperty('count')) {
        throw Boom.create(400, 'Incorrect body items');
      }
      break;
    default:
      throw Boom.create(400, 'Incorrect body items.');
  }

  return dbQuery.getPackages(query)
  .then(function(docs) {
    //TODO finish this
    res.status(200).json(docs);
  })
  .catch(function(err) {
    throw err;
  });
};

exports.getPackageCount = function(req, res, next) {
  //TODO
  return res.status(200).json(30);
};
