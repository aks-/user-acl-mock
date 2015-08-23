var express = require('express');
var app = module.exports = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var organizations = require('./lib/organizations/routes.js');
var packages = require('./lib/packages/routes.js');
var teams = require('./lib/teams/routes.js');
var users = require('./lib/users/routes.js');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator({}));

//mount applications
app.use(organizations);
app.use(packages);
app.use(teams);
app.use(users);
