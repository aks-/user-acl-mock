var db = require('../../../lib/db');
var getScopeId = require('../../../lib/getOrganizationId');
var Boom = require('boom');

//TODO: what's the structure?
exports.getLicense = function(name) {
  var design = 'scopes';
  var view = 'byScope';
  var scope_id = getScopeId(name);
  return db.findBy(design, view, {
    key: scope_id
  })
    .then(function(body) {});
};
