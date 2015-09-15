var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Paginator = function Paginator(options) {
  EventEmitter.call(this);
  this.init(options);
};

util.inherits(Paginator, EventEmitter);

Paginator.prototype.init = function(options) {
  this.couch = options.couch;
  this.design = options.design;
  this.view = options.view;
  this.query = (options.query || {});
  this.query.limit = options.perPage + 1 || options.query.limit + 1 || 11;
  this.pageSize = this.query.limit;
  this._done = false;
  this._startkey = this.query.startkey || 0;
  this._endkey = this.query.endkey || 0;
  this._startkey_docid = this.query.startkey_docid || 0;
};

Paginator.prototype.end = function() {
  this.couch = null;
  this.removeAllListeners();
};

Paginator.prototype.next = function(options) {
  if (options && options.stop || this._done) {
    this.emit('end');
    return;
  }

  var count = this.pageSize - 1;

  this.query.startkey_docid = this._startkey_docid;
  this.query.startkey = this._startkey;

  this.couch.findBy(this.design, this.view, this.query)
    .bind(this)
    .then(function(body) {

      var docs = body[0];
      var rows = docs.rows.length;
      if (rows < count + 1) {
        this._done = true;
        this.emit('rows', docs.rows);
      } else {
        var nextStartDoc = docs.rows[rows - 1];
        this._startkey_docid = nextStartDoc.id;
        this._startkey = nextStartDoc.key;
        this.emit('rows', docs.rows.slice(0, count));
      }
      docs.rows = [];
    })
    .catch(function(error) {
      this.emit('error', 'db error occured ' + error);
    });
};

module.exports = require('bluebird').promisify(function(options, cb) {
  if (options && typeof options != 'object')
    throw new Error('input parameter is not an object');
  if (!options.couch)
    throw new Error('property couch is not defined');
  if (typeof options.couch != 'object')
    throw new TypeError('couch is not an object');
  if (!options.design)
    throw new Error('property design is not defined');
  if (typeof options.design != 'string')
    throw new TypeError('given design name is not a string');
  if (!options.view)
    throw new Error('property view is not defined');
  if (typeof options.view != 'string')
    throw new TypeError('given view name is not a string');
  if (options.query && typeof options.query != 'object')
    throw new TypeError('given query type is not object');
  if (options.page && typeof options.page != 'number')
    throw new TypeError('type of page is not a number');
  if (options.perPage && typeof options.perPage != 'number')
    throw new TypeError('type of perPage is not a number');
  var paginator = new Paginator(options);

  var pages = [];
  var pageCount = 0;
  var pageRequested = options.page || 1;

  paginator.on('error', function(error) {
    cb(error);
  });

  paginator.on('end', function() {
    paginator.end();
    cb(null, pages);
  });

  paginator.on('rows', function(_rows) {
    var rows = _rows.map(function(row) {
      return row.value;
    });
    var count = rows.length;
    pages.push({
      "count": count,
      "items": rows
    });
    pageCount += 1;
    if (pageCount < pageRequested)
      paginator.next();
    else
      paginator.next({
        stop: true
      });
  });

  paginator.next();
});
