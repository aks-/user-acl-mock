var db = require('../../../db.js');
var path = require('path');
var Promise = require('bluebird');
var path = require('path');
var fs = Promise.promisifyAll(require('fs'));
var docPath = __dirname + '/designDoc.json';
var designDoc = fs.readFileSync(docPath);
var designName = designDoc._id;
var VIEWS = designDoc.views;

exports.addUser = function(id, bearer, user, role) {
  var currentTime = new Date().toISOString();
  var organizationId = id+"Organization";

  //Check if user and organization both exists?
  return db.get(user)
  .then(function(result) {
    return result[0];
  })
  .then(function(userInfo) {
    var organizationInfo;
    return db.get(organizationId)
    .then(function() {
      return userInfo;
    });
  })
  .then(function(result) {
    //organization exists
    var orgId = id+"Organization";
    var orgs = result.organizations;
    var org = orgs[orgId];
    org.role = role;
    if (!org.hasOwnProperty('created')) {
      org.created = currentTime;
    }
    org.updated = currentTime;
    return db.save(result)
    .then(function() {
      return {
        user_id: user,
        org_id: orgId,
        role: role,
        created: currentTime,
        updated: currentTime,
        //It has just been added so it is always going to be false anyway
        deleted: false,
      };
    });
  });
};

exports.create = function(bearer, name, description, resource) {
  var currentTime = new Date().toISOString();
  var orgId = name+"Organization"; 

  //If organization already exists throw an error
  return db.get(orgId)
  .then(function() {
    throw new Error("Organization with same name already exists!");
  })
  .catch(function(error) {
    //if org is missing create new one
    if (error.reason == 'missing') {
      return db.save({
        type: 'organization',
        _id: orgId,
        name: id,
        description: description,
        resource: resource,
        created: currentTime,
        updated: currentTime,
        deleted: false
      })
      .then(function() {
        return {
          name: name,
          description: description,
          resource: resource,
          created: currentTime,
          updated: currentTime,
          deleted: false
        };
      });
    } else {
      throw error;
    }
  });
};

exports.addTeam = function(id, scope, name) {
  var viewName = VIEWS.byTeamAndScope;
  return db.getDb()
  .view(designName, viewName)
  .then(function(body) {
    var rows = body.rows;
    if (rows > 0) {
      throw new Error("This team already exists in this organization.");
    } 
    return true;
  })
  .then(function() {
    var currentTime = new Data().toISOString();
    var scope_id = id+"Organization";
    return db.save({
      "name": name,
      "scope_id": scope_id,
      "users": [],
      "packages": [],
      "type": "team",
      "created": currentTime,
      "updated": currentTime,
    })
    .then(function() {
      return currentTime;
    });
  })
  .then(function(currentTime) {
    return {
      "name": id,
      "scope_id": scope_id,
      "created": currentTime,
      "updated": currentTime,
      "deleted": false
    };
  });
};

exports.removeUser = function(id, userId) {
  var currentTime = new Date().toISOString();
  var orgId = id+"Organization";
  var role, created;
  db.get(userId)
  .then(function(result) {
    var userInfo = result[0];
    var orgs = userInfo.organizations;
    var org = orgs[orgId];
    role = org.role;
    created = org.created;
    delete orgs[orgId];
    return {role: role, created: created};
  })
  .then(function(result) {
    return db.save(result)
    .then(function() {
      return {
        user_id: userId,
        org_id: orgId,
        role: result.role,
        created: result.created,
        updated: currentTime,
        deleted: true
      };
    });
  });
};

exports.getAllPackages = function(id, page, perPage) {};

exports.getAllTeams = function(id) {
  var viewName = VIEWS.getAllTeams;
  return db.getDb().view(designName, viewName, {keys: [id]})
  .then(function(body) {
    var rows = body.rows;
    var teams = [];
    rows.forEach(function(row, rowIndex) {
      teams.push(row.value);
    });
    return teams;
  });
};

exports.update = function(id, description, resource) {
  //get the current id and add new one
  var currentTime = new Date().toISOString();
  var orgId = id+'Organization';
  return db.get(orgId)
  .then(function(result) {
    var org = result[0];
    org.description = description;
    org.resource = org.resource;
    org.updated = currentTime;
    return org;
  })
  .then(function(result) {
    return db.save(result);
  })
  .then(function(result) {
    var id = result[0].id;
    return db.get(id);
  })
  .then(function(result) {
    var info = result[0];
    return {
      name: info.name,
      description: info.description,
      resource: info.resource,
      created: info.created,
      updated: info.updated,
      deleted: !!info.deleted
    };
  });
};
