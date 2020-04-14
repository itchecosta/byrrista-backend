module.exports = function parseStringAsArray(arrayAsString) {
  return arrayAsString.split(',').map(str => str.toLowerCase().trim());
}