//TODO If db exists then only destroy it

require('./loadDocs')()
  .then(require('./loadViews'))
  .catch(function(error) {
    //log and exit
    process.stderr.write(error.stack);
    process.exit(1);
  });

