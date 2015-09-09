module.exports = function(name) {
  if (typeof name != 'string')
    throw new TypeError("'name' is not a string.");
  else 
    return name+'Organization';
};
