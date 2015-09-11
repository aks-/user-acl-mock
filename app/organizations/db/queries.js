var db = require('../../../lib/db');
var getOrganizationId = require('../../../lib/getOrganizationId');
var paginate = require('../../../lib/paginator');
var Boom = require('boom');
var path = require('path');

exports.addUser = function(id, bearer, user, role) {
  var currentTime = new Date().toISOString();
  var organizationId = getOrganizationId(id);

  //Check if user and organization both exists?
  return db.get(user)
    .then(function(result) {
      return result[0];
    })
    .then(function(userInfo) {
      var organizationInfo;
      return db.get(organizationId)
        .then(function() {
          var organizations = Object.keys(userInfo.organizations);
          if (organizations.indexOf(organizationId) > -1) {
            var error = Boom.create(409, 'This user has already been added to this organization.', {
              timestamp: Date.now()
            });
            throw error;
          }
          return userInfo;
        });
    })
    .then(function(result) {
      var orgId = getOrganizationId(id);
      var orgs = result.organizations;
      orgs[orgId] = {};
      var org = orgs[orgId];
      org.role = role;
      org.created = currentTime;
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
  var orgId = getOrganizationId(name);

  //If organization already exists throw an error
  return db.get(orgId)
    .then(function() {
      var error = Boom.create(409, 'Organization with same name already exists!', {
        timestamp: Date.now()
      });
      throw error;
    })
    .catch(function(error) {
      //if org is missing create new one
      if (error.reason == 'missing') {
        return db.save({
          type: 'organization',
          _id: orgId,
          name: name,
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
        throw Boom.wrap(error);
      }
    });
};

exports.addTeam = function(id, scope, name) {
  var design = 'organizations';
  var scope_id = getOrganizationId(scope);
  return db.get(scope_id)
    .catch(function(err) {
      var error = Boom.create(409, "Organization doesn't exist.");
      throw error;
    })
    .then(function() {
      var view = 'byTeamAndScope';
      return db.findBy(design, view, {
        key: [name, scope_id]
      })
        .then(function(body) {
          var rows = body[0].rows;
          if (rows && rows.length > 0) {
            var error = Boom.create(409, 'Team already exists in the organization', {
              timestamp: Date.now()
            });
            throw error;
          }
        })
        .then(function() {
          var currentTime = new Date().toISOString();
          return db.save({
            "name": name,
            "scope_id": scope_id,
            "users": [],
            "packages": {},
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
            "name": name,
            "scope_id": scope_id,
            "created": currentTime,
            "updated": currentTime,
            "deleted": false
          };
        });
    });
};

exports.removeUser = function(id, userId) {
  var currentTime = new Date().toISOString();
  var orgId = getOrganizationId(id);
  var role, created;
  return db.get(userId)
    .catch(function(err) {
      var error = Boom.create(409, "User doesn't exist.");
      throw error;
    })
    .then(function(result) {
      var userInfo = result[0];
      var orgs = userInfo.organizations;
      var org = orgs[orgId];
      if (org) {
        role = org.role;
        created = org.created;
        delete orgs[orgId]
        ;
      } else {
        throw Boom.create(409, "User is not a member of this organization.");
      }
      return userInfo;
    })
    .then(function(result) {
      return db.save(result)
        .then(function() {
          return {
            user_id: result._id,
            org_id: orgId,
            role: role,
            created: created,
            updated: currentTime,
            deleted: true
          };
        });
    });
};

exports.getAllPackages = function(id, page, perPage) {
  var orgId = getOrganizationId(id);
  var design = 'organizations';
  var view = 'getAllPackages';
  return paginate({
    couch: db,
    design: design,
    view: view,
    query: {
      startkey: orgId,
      endkey: orgId
    },
    page: page,
    perPage: perPage
  });
};

//TODO ask if API is correct?
exports.getAllTeams = function(id) {
  var design = 'organizations';
  var scope_id = getOrganizationId(id);
  var view = "getAllTeams";
  return db.get(scope_id)
    .catch(function(err) {
      var error = Boom.create(409, "Organization doesn't exist.");
      throw error;
    })
    .then(function() {
      return db.findBy(design, view, {
        key: [scope_id]
      })
        .then(function(body) {
          var rows = body[0].rows;
          var teams = [];
          rows.forEach(function(row, rowIndex) {
            teams.push(row.value);
          });
          return teams;
        });
    });
};

exports.update = function(id, description, resource) {
  //get the current id and add new one
  var currentTime = new Date().toISOString();
  var orgId = getOrganizationId(id);
  return db.get(orgId)
    .catch(function(err) {
      var error = Boom.create(409, "Organization doesn't exist.");
      throw error;
    })
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
