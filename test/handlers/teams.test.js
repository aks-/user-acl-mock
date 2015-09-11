var request = require('supertest');
var test = require('tape');
var app = require('../../app');

var bearer = "Aria";

test("should add package to the team", function(t) {
  var packageInfo = {
    package: 'newOne',
    permissions: 'write'
  };

  request(app)
    .put('/team/OnlineBuddies/OneTeam/package')
    .set('bearer', bearer)
    .set('Accept', 'application/json')
    .send(packageInfo)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err)
        throw err;
      t.ok(200, "package has been added successfully");
      t.end();
    });
});

test("should add user to the team", function(t) {
  var userInfo = {
    user: 'newUser',
  };

  request(app)
    .put('/team/OnlineBuddies/OneTeam/user')
    .set('bearer', bearer)
    .set('Accept', 'application/json')
    .send(userInfo)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err)
        throw err;
      t.ok(200, "user has been added successfully");
      t.end();
    });
});

test("should remove package to the team", function(t) {
  var packageInfo = {
    package: 'newOne',
  };

  request(app)
    .delete('/team/OnlineBuddies/OneTeam/package')
    .set('bearer', bearer)
    .set('Accept', 'application/json')
    .send(packageInfo)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err)
        throw err;
      t.ok(200, "package has been removed successfully");
      t.end();
    });
});

test("should remove user from the team", function(t) {
  var userInfo = {
    user: 'newUser',
  };

  request(app)
    .delete('/team/OnlineBuddies/OneTeam/user')
    .set('bearer', bearer)
    .set('Accept', 'application/json')
    .send(userInfo)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err)
        throw err;
      t.ok(200, "user has been removed successfully");
      t.end();
    });
});

test("should return a team", function(t) {
  request(app)
    .get('/team/OnlineBuddies/OneTeam')
    .set('bearer', bearer)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err)
        throw err;
      t.ok(200, "got team");
      t.end();
    });
});

test("should remove existing team", function(t) {
  request(app)
    .delete('/team/OnlineBuddies/OneTeam')
    .set('bearer', bearer)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err)
        throw err;
      t.ok(200, "removed team");
      t.end();
    });
});
