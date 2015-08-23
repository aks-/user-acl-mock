var Promise = require('bluebird');
var config = require('./dbConfig.js');

var url = config.host + ':' + config.port;
var nano = require('nano')(url);
var db = Promise.promisifyAll(nano.db.use('user-acl'));

var getDb = exports.getDb = function() {
  return db;
};

var get = exports.get = function(key, revs_info_obj) {
  return getDb().getAsync(key);
};

var findBy = exports.findBy = function(design, view, params) {
  return getDb().viewAsync(design, view, params);
};

var save = exports.save = function(docName) {
  return getDb().insertAsync(docName);
};

var update = exports.update = function(key, updateDoc) {
  return get(key, { revs_info: true }) 
  .then(updateDoc)
  .then(function(updatedDoc) {
    return save(updatedDoc);
  });
};

var destroy = exports.destroy = function(docName, rev) {
  return getDb().destroyAsync(id, rev);
};
