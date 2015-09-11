var Promise = require('bluebird');
var config = require('../config/dbConfig');

var url = 'http://' + config.user + ':' + config.pass + '@' + config.host + ':' + config.port;
var nano = require('nano')(url);
var dbName = config.name;
var db = Promise.promisifyAll(nano.db.use(dbName));

var createDb = exports.createDb = function() {
  return Promise.promisify(nano.db.create)(dbName);
};

var destroyDb = exports.destroyDb = function() {
  return Promise.promisify(nano.db.destroy)(dbName);
};

var reset = exports.reset = function() {
  return destroyDb()
    .then(function() {
      return createDb();
    })
    .catch(function(error) {
      if (error && error.reason == 'missing')
        return createDb(dbName);
    });
};

var getDb = exports.getDb = function() {
  return db;
};

var get = exports.get = function(key, revs_info_obj) {
  return db.getAsync(key, revs_info_obj);
};

var findBy = exports.findBy = function(design, view, params) {
  return db.viewAsync(design, view, params);
};

var save = exports.save = function(doc) {
  return db.insertAsync(doc);
};

var update = exports.update = function(key, updatedDoc) {
  return get(key, {
    revs_info: true
  })
    .then(function() {
      return updatedDoc;
    })
    .then(function(updatedDoc) {
      return save(updatedDoc);
    });
};

var destroy = exports.destroy = function(id, rev) {
  return db.destroyAsync(id, rev);
};

var prepareView = exports.prepareView = function(view, viewName) {
  return db.insertAsync(view, viewName);
};
