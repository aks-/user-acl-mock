var Promise = require('bluebird');
var db = require('../lib/db');
var fs = require('fs');
var path = require('path');
var readFile = require('fs-readfile-promise');
var appPath = './app';

var getDesignPath = function(appName) {
  return path.join(appPath, appName, '/db/designDoc.json');
};

//insert views into db
module.exports = function() {
  return Promise.all(fs.readdirSync(appPath)
    .map(function(dirName) {
      return {
        app: dirName,
        file: getDesignPath(dirName)
      };
    }).filter(function(o) {
      return path.extname(o.file) == '.json';
    }).map(function(o) {
      return readFile(o.file)
        .then(JSON.parse)
        .then(function(val) {
            var designName = '_design/' + o.app;
            db.prepareView(val, designName);
        });
    }));
};
