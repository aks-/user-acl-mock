var request = require('supertest');
var test = require('tape');
var app = require('../../app');

var bearer = "Aria";

test("should add user to the organization", function(t) {
  var userInfo = {
    user: 'usernameTwo',
    role: 'admin'
  }; 

  request(app)
  .put('/org/krakenjs/user')
  .set('bearer', bearer)
  .set('Accept', 'application/json')
  .send(userInfo)
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
    var expectedResult = ['usernameTwo', 'krakenjsOrganization', 'admin'];
    var response = JSON.parse(res.text);
    var actualResult = ['user_id', 'org_id', 'role'].map(function(key, index) {
      return response[key];
    });
    t.error(err, 'No error while adding user to org.');
    t.same(actualResult, expectedResult, 'User has been added successfully to org.');
    t.end();
  });
});

test("should create a new Organization when it doesn't exits", function(t) {
  var orgInfo = {
    name: "newOrg",
    description: "New test organization.",
    resource: {}
  };

  request(app)
  .put('/org')
  .set('bearer', bearer)
  .set('Accept', 'application/json')
  .send(orgInfo)
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
    var response = Object.keys(JSON.parse(res.text));
    t.equal(response.length, 6);
    t.end();
  });
});

test('should add team to organization', function(t) {
  var teamInfo = {
    name: 'Foobar',
    scope: 'krakenjs'
  };

  request(app)
  .put('/org/krakenjs/team')
  .set('bearer', bearer)
  .set('Accept', 'application/json')
  .send(teamInfo)
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
    var response = Object.keys(JSON.parse(res.text));
    t.ok(response.indexOf('created') > -1, "Team is successfully added to org.");
    t.end();
  });
});

test('should remove a user from organization.', function(t) {
  request(app)
  .delete('/org/krakenjs/user/usernameOne')
  .set('bearer', bearer)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
    var response = Object.keys(JSON.parse(res.text));
    t.equal(response.length, 6);
    t.end();
  });
});

test('get all teams in a given organization.', function(t) {
  request(app)
  .get('/org/krakenjs/team')
  .set('bearer', bearer)
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
    var response = JSON.parse(res.text);
    t.equal(response.length, 3);
    t.end();
  });
});

test('update existing organization.', function(t) {
  var orgInfo = {
    description: "updated!",
    resource: {}
  };

  request(app)
  .post('/org/OnlineBuddies')
  .set('bearer', bearer)
  .set('Accept', 'application/json')
  .send(orgInfo)
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
    var response = Object.keys(JSON.parse(res.text));
    t.equal(response.length, 6);
    t.end();
  });
});
