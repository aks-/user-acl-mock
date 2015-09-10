var EventEmitter = require('events').EventEmitter;
var util   = require('util');

var Paginator = function Paginator(db, design, view, query) {
  EventEmitter.call(this);
  this.init(db, design, view, query);
};

util.inherits(Paginator, EventEmitter);

Paginator.prototype.init = function(db, design, view, query) {
  this.db    = db;
  this.design = design;
  this.view  = view;
  this.query = query;
  this.query.limit = query.limit + 1 || 11;
  this.pageSize    = this.query.limit;
  this._done       = false;
  this._startkey   = this.query.startkey || 0;
  this._startkey_docid = this.query.startkey_docid || 0;
};

Paginator.prototype.end = function() {
  this.db = null;
  this.removeAllListeners();
};

Paginator.prototype.next = function(count) {
  if (this._done) {
    this.emit('end');
    return;
  }

  count = count || this.pageSize - 1;

  this.query.startkey_docid = this._startkey_docid;
  this.query.startkey = this._startkey;

  this.db.findBy(this.design, this.view, this.query)
  .bind(this)
  .then(function(body) {

    var docs = body[0];
    var rows = docs.rows.length;
    if(rows < count + 1){
      this._done = true;
      this.emit('rows', docs.rows);
    }
    else{
      var nextStartDoc = docs.rows[rows-1];
      this._startkey_docid = nextStartDoc.id;
      this._startkey = nextStartDoc.key;
      this.emit('rows', docs.rows.slice(0, count));
    }
    docs.rows = [];
  })
  .catch(function(error) {
    console.log(error.stack);
    throw error;
  });
};

module.exports = Paginator;
