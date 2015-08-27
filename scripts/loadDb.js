var db = require('../db');
var organizationsDocs = require('../fixtures/docs/organizations');
var packagesDocs = require('../fixtures/docs/packages');
var usersDocs = require('../fixtures/docs/users');
var teamsDocs = require('../fixtures/docs/teams');
var organizationPackages = require('../fixtures/docs/organizationPackages');
var userOrganizations = require('../fixtures/docs/userOrganizations');
var userPackages = require('../fixtures/docs/userPackages');

var bulkInsert = db.getDb().bulk;

var loadData = function() {
  db.destroyDb()
  .then(function() {
    return insertData();
  })
  .catch(function(error) {
    return insertData();
  });
};

var insertData = function() {
  db.createDb()
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
  })
  //add relationship documents
  .then(function() {
    return bulkInsert(userOrganizations);
  })
  .then(function() {
    return bulkInsert(userPackages);
  })
  .then(function() {
    return bulkInsert(organizationPackages);
  })
  //Throw error and fail
  .catch(function(error) {
    throw error;
  });
};

//load the data in db
loadData();
