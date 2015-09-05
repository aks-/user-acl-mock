var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

module.exports = function(path) {
  return fs.readFileAsync(path)
  .then(JSON.parse);
};
