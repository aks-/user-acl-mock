var db = require('../../../lib/db');
var getOrganizationId = require('../../../lib/getOrganizationId');
var paginate = require('../../../lib/paginator');
var Boom = require('boom');
var path = require('path');

var design = 'packages';

exports.getPackages = function(filterObj) {
  if (!Object.keys(filterObj).length) {
    //  If no filter or sort is found just return all the packages
    return getAllPackages();
  } else {
    return getPackagesByFilters(filterObj);
  }
};

var getAllPackages = function() {
  var view = 'getAllPackages';
  
  return db.findBy(design, view)
  .then(function(body) {
    var rows = body[0].rows;
    return rows.map(function(row) {
      return row.value;
    });
  });
};

var getPackagesByFilters = function(filterObj) {
  //  TODO create view and then query it
  //  its' getting so ugly
  var keys = Object.keys(filterObj);
  var sortIndex = filterObj.hasOwnProperty('sort') ? keys.indexOf('sort') : keys.indexOf('count');
  var filterKey = keys.slice(0, sortIndex).concat(keys.slice(sortIndex+1));

  //TODO looks very ugly, fix this
  return prepareViewByFilter(filterKey, 'sort')
  .then(function() {
    var view = 'byFilters';
    var filter = filterObj[filterKey];
    var sort = (filterObj['sort'] == 'modified') ? 'updated': filterObj['sort'];
    //TODO query by filter and sort?
    return db.findBy(design, view, {
      key: [filter, 0, sort]
    });
  })
  .then(function(body) {
    var rows = body[0].rows;
    return rows.map(function(row) {
      return row.value;
    });
  });
};

var prepareViewByFilter = function(filter, sort) {
  var designName = '_design/packages';
  var filterView = createFilterView(filter, sort);

  return db.get(designName)
  .then(function(body) {
    var doc = body[0];
    doc.views.byFilters = filterView;
    return db.prepareView(doc, designName);
  });
};

var createFilterView = function(filter, sort) {
  //TODO sort by dependents is bit different, change accordingly
  if (filter == 'count' || Array.isArray(filter)) filter = null;
  if (filter && sort) {
    return {
      map: "function(doc) { if (doc.type == 'package') { emit([doc['"+filter+"'], 0, doc['"+sort+"']], doc);}}"
    };
  } else {
    return {
      map: "function(doc) { if (doc.type == 'package') { emit([doc['"+filter+"']], doc)}}"
    };
  }
};

