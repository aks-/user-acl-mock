# user-acl-mock
A mock service using Express.js & CouchDb to allow open source development of npm website code.

## Application Structure

### .env
   Read, throw the .env file at root of this project. And change the environment variables for your couch and app accordingly.

### app

   The [app](app) directory contains four modules (organizations, packages, scopes, teams, users) which contains the logic to serve the request. Each of those modules have similar structure comprising of:

   * db directory e.g. [db](/app/organizations/db)
   * handlers.js
   * routes.js
   * validators.js

##### db

   The db directory contains the following two types of files:

   * designDoc.json, which have couch design document which is preloaded on start of application.
   * queries.js, contians the database logic associated with each route in that particular module.

##### handlers.js

   This file contains handlers (sometimes called controllers) are functions that accepts two parameters: `request` and `response`  

   The `request` parameter is an stream with details about the end user's request, such as path parameters, headers, payload &c.

   The second parameter, `response`, is the stream used to respond to the request.

##### routes.js
  
   This file contains logic that registers http method, path ,validator and handler to the app.

##### validators.js

   This app uses Joi for validations of params, body, headers and query. It exports the validation objects for each handler.

### config
  
   The [config](config) directory contains the config file which is used by wrapper written on top of nano to connect to CouchDb.

### couchapp

   The [couchapp](couchapp) directory contains the scripts which are used to preload the fixture documents and design documents into the CouchDb.

### fixtures

   The [fixtures](fixtures) directory contains the mock documents which are inserted in the CouchDb on start of the app.

### lib

   The [lib](lib) directory contains the wrapper libraries and shared code used in app.

### test

   the [test](test) directory contains the API test cases written using supertest. 

### Use

To start the app localy, do the following which will run the pretest script which will setup db and load docs and views into couchdb
```sh
npm install
npm start
```

## Tests

To run the tests, do the following
```sh
npm test
```
