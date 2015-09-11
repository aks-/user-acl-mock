var db = require('../../../lib/db');
var getScopeId = require('../../../lib/getOrganizationId');
var paginate = require('../../../lib/paginator');
var Boom = require('boom');

exports.addPackage = function(id, scope, package, permissions) {
  var scope_id = getScopeId(scope);
  return findDocumentByTeamAndScope(id, scope)
  .then(function(doc) {
    var packages = doc.packages;
    if (Object.keys(packages).indexOf(package) > -1) {
      var error = Boom.create(409, "Package already exist in the team.");
      throw error;
    } else {
      var currentTime = new Date().toISOString();
      packages[package] = {
        permissions: permissions,
        created: currentTime,
        updated: currentTime
      };
      return db.save(doc);
    }
  });
};

exports.addUser = function(id, scope, user) {
  //check if the scope is present 
  //if yes then find if given id(name of team) exists for that org
  //if so then find if that user already exists  in the team?
  //if no add 
  var scope_id = scope+'Organization';
  return findDocumentByTeamAndScope(id, scope)
  .then(function(doc) {
    var users = doc.users;
    if (users.indexOf(user) > -1) {
      var error = Boom.create(409, "Username already exists in team.");
      throw error;
    } else {
      doc.users.push(user);
      return db.save(doc);
    }
  });
};

exports.removePackage = function(id, scope, package) {
  //check if scope is present
  //if so then find if team exists in that 
  //if so then find if package is already there
  //if so then remove
  return findDocumentByTeamAndScope(id, scope)
  .then(function(doc) {
    var packages = doc.packages;
    if (Object.keys(packages).indexOf(package) > -1) {
      delete packages[package];
      return db.save(doc);
    } else {
      var error = Boom.create(409, "This package doesn't exist in given team");
      throw error;
    }
  });
};

exports.removeUser = function(id, scope, user) {
  //check if scope is presentt
  //if so then find team 
  //if exists then find user
  //and then remove 
  return findDocumentByTeamAndScope(id, scope)
  .then(function(doc) {
    var users = doc.users;
    var userIndex = users.indexOf(user);
    if (userIndex > -1) {
      doc.users = users.slice(0,userIndex).concat(users.slice(userIndex+1));
      return db.save(doc);
    } else {
      var error = Boom.create(409, "User doesn't exist in this team.");
      throw error;
    }
  });
};

exports.getTeam = function(id, scope) {
  //find if scope exists
  //then if team exists
  //if so then return it
  return findDocumentByTeamAndScope(id, scope)
  .then(function(doc) {
    return {
      name: doc.name,
      scope_id: scope,
      created: doc.created,
      updated: doc.updated,
      deleted: !!doc.deleted
    };
  });
};

exports.remove = function(id, scope) {
  return findDocumentByTeamAndScope(id, scope)
  .then(function(doc) {
    var docId = doc._id;
    var rev = doc._rev;
    return db.destroy(docId, rev)
    .then(function() {
      var created = doc.created;
      var updated = doc.updated;
      var name = doc.name;
      var scope = doc.scope_id.slice(0, -12);
      return {
        name: name,
        scope_id: scope,
        created: created,
        updated: updated,
        deleted: true
      };
    });
  });
};

//TODO heh what are we updating here? it's more like get team
exports.update = function(id, scope) {
  //find the team and org if they exists as above if  so update!!
  var design = 'organizations';
  var view = 'getAllPackages';

  paginate({couch: db, design: design, query: {startkey: 'npmOrganization', endkey: 'npmOrganization'},view: view, page: 2, perPage: 1})
  .then(function(items) {
    console.log(items);
  })
  .catch(function(error) {
    console.log(error.stack);
  });
};

var findDocumentByTeamAndScope = function(team, scope) {
  var scope_id = getScopeId(scope);

  return db.get(scope_id)
  .catch(function(err) {
    var error = Boom.create(409, "Organization doesn't exist.");
    throw error;
  })
  .then(function() {
    var design = 'teams';
    var view = 'byTeamAndScope';
    return db.findBy(design, view, {key: [team, scope_id]})
    .then(function(body) {
      var rows = body[0].rows;
      if (rows.length > 0) {
        var obj = rows[0];
        var doc = obj.value;
        return doc;
      } else {
        var error = Boom.create(409, "Team doesn't exist in this organization.");
        throw error;
      }
    });
  });
};
