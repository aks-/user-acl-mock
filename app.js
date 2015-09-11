var express = require('express');
var app = module.exports = express();
var logger = require('morgan');
var bodyParser = require('body-parser');

var organizations = require('./app/organizations/routes');
var packages = require('./app/packages/routes');
var scopes = require('./app/scopes/routes');
var teams = require('./app/teams/routes');
var users = require('./app/users/routes');

//Load environment variables
require('dotenv').load();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//mount applications
app.use(organizations);
app.use(packages);
app.use(scopes);
app.use(teams);
app.use(users);

app.use(function(err, req, res, next) {
  //validations errors on input type
  if (err instanceof require('express-validation').ValidationError) {
    return res.status(err.status).json(err);
  }

  if (process.env.NODE_ENV !== 'production') {
    return res.status(500).json(err);
  } else {
    return res.status(500);
  }
});

module.exports = app;
