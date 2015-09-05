var db = require('../lib/db');
var organizationsDocs = require('../fixtures/docs/organizations');
var packagesDocs = require('../fixtures/docs/packages');
var usersDocs = require('../fixtures/docs/users');
var teamsDocs = require('../fixtures/docs/teams');

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
  //Throw error and fail
  .catch(function(error) {
    throw error;
  });
};

//load the data in db
loadData();
