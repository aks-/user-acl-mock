var Promise = require('bluebird');
var config = require('./dbConfig.js');

var url = 'http://' + config.username + ':' + config.password + '@' + config.host + ':' + config.port;
var nano = require('nano')(url);
var dbName = config.dbName;
var db = Promise.promisifyAll(nano.db.use(dbName));

var createDb = exports.createDb = function() {
  return Promise.promisify(nano.db.create)(dbName);
};

var getDb = exports.getDb = function() {
  return db;
};

var get = exports.get = function(key, revs_info_obj) {
  return getDb().getAsync(key);
};

var findBy = exports.findBy = function(design, view, params) {
  return getDb().viewAsync(design, view, params);
};

var save = exports.save = function(doc) {
  return getDb().insertAsync(doc);
};

var update = exports.update = function(key, updatedDoc) {
  return get(key, { revs_info: true }) 
  .then(function() {
    return updatedDoc;
  })
  .then(function(updatedDoc) {
    return save(updatedDoc);
  });
};

var destroy = exports.destroy = function(docName, rev) {
  return getDb().destroyAsync(id, rev);
};

var destroyDb = exports.destroyDb = function() {
  return Promise.promisify(nano.db.destroy)(dbName);
};
