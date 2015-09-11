var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Paginator = function Paginator(obj) {
  EventEmitter.call(this);
  this.init(obj);
};

util.inherits(Paginator, EventEmitter);

Paginator.prototype.init = function(obj) {
  this.couch = obj.couch;
  this.design = obj.design;
  this.view = obj.view;
  this.query = (obj.query || {});
  this.query.limit = obj.perPage + 1 || obj.query.limit + 1 || 11;
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

Paginator.prototype.next = function(obj) {
  if (obj && obj.stop || this._done) {
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

module.exports = require('bluebird').promisify(function(obj, cb) {
  if (obj && typeof obj != 'object')
    throw new Error('input parameter is not an object');
  if (!obj.couch)
    throw new Error('property couch is not defined');
  if (typeof obj.couch != 'object')
    throw new TypeError('couch is not an object');
  if (!obj.design)
    throw new Error('property design is not defined');
  if (typeof obj.design != 'string')
    throw new TypeError('given design name is not a string');
  if (!obj.view)
    throw new Error('property view is not defined');
  if (typeof obj.view != 'string')
    throw new TypeError('given view name is not a string');
  if (obj.query && typeof obj.query != 'object')
    throw new TypeError('given query type is not object');
  if (obj.page && typeof obj.page != 'number')
    throw new TypeError('type of page is not a number');
  if (obj.perPage && typeof obj.perPage != 'number')
    throw new TypeError('type of perPage is not a number');
  var paginator = new Paginator(obj);

  var pages = [];
  var pageCount = 0;
  var pageRequested = obj.page || 1;

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
