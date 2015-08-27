var db = require('../../../db.js');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

exports.addUser = function(id, bearer, user, role) {
  return db.save({
    "user_id": user,
    "organization_id": id,
    "type": "user-organization",
    "role": role,
    "created": String(new Date()),
    "updated": String(new Date()),
  }).then(function(doc) {
    return db.get(doc[0].id);
  }).then(function(result) {
    var info = result[0];
    return {
      "user_id": info.user_id,
      "org_id": info.organization_id,
      "role": info.role,
      "created": info.created,
      "updated": info.updated,
      "deleted": !!info.deleted
    };
  });
};

exports.create = function(bearer, name, description, resource) {
  return db.save({type: 'organization',
                 bearer: bearer,
                 _id: name,
                 description: description,
                 resource: resource,
                 created: String(new Date()),
                 updated: String(new Date()),
  })
  .then(function(doc) {
    return db.get(doc[0].id);
  }).then(function(result) {
    var info = result[0];
    return {
      name: info._id,
      description: info.description,
      resource: info.resource,
      created: info.created,
      updated: info.updated,
      deleted: !!info.deleted
    };
  });
};

exports.addTeam = function(bearer, id, scope, name) {};

exports.removeUser = function(id, bearer, userId) {};

exports.update = function(bearer, id, description, resource) {};
