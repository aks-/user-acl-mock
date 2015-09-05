var db = require('../lib/db');
var organizationsDocs = require('../fixtures/docs/organizations');
var packagesDocs = require('../fixtures/docs/packages');
var usersDocs = require('../fixtures/docs/users');
var teamsDocs = require('../fixtures/docs/teams');
var Promise = require('bluebird');

var bulkInsert = db.getDb().bulk;

module.exports = function() {
  return db.reset()
  .then(function() {
    return bulkInsert(organizationsDocs);
  })
  .then(function() {
    return bulkInsert(packagesDocs);
  })
  .then(function() {
    return bulkInsert(usersDocs);
  })
  .then(function() {
    return bulkInsert(teamsDocs);
  });
};
