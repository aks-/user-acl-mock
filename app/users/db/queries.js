var db = require('../../../lib/db');
var Boom = require('boom');

//TODO what's that bearer permission thing?
exports.getAllOrganizations = function(username) {
  var design = "users";
  var view = "getOrganizationsById";
  return db.get(username)
  .catch(function(err) {
    var error = Boom.create(409, "This username doesn't exist");
    throw error;
  })
  .then(function() {
    db.findBy(design, view, {key: username})
    .then(function(body) {
      var rows = body[0].rows;
      if (rows.length > 0) {
        
      } else {
        var error = Boom.create(409, "There are no organizations for this user");
        throw error; 
      }
    });
  });
};
