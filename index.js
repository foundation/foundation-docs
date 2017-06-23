var path = require('path');

var TEMPLATE_PATH = path.join(__dirname, 'templates/component.html');
var HELPERS_PATH = path.join(__dirname, 'helpers');

module.exports = {
  handlebars: require('./lib/handlebars'),
  marked: require('./lib/marked'),
  componentTemplate: path.relative(process.cwd(), TEMPLATE_PATH),
  handlebarsHelpers: path.relative(process.cwd(), HELPERS_PATH)
}