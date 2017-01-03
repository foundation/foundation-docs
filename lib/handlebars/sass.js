var format     = require('string-template');
var handlebars = require('handlebars');
var hljs       = require('highlight.js');

/**
 * Formats a mixin using a SassDoc mixin object to look like this:
 * ```scss
 * @include mixinName($param, $param) { }
 * ```
 *
 * @param {object} mixin - Mixin data, taken from a SassDoc object.
 * @returns A formatted code sample.
 */
handlebars.registerHelper('writeSassMixin', function(mixin) {
  var name = mixin['context']['name'];
  var params = mixin['parameter'];

  var str = '@include ';
  str += name;

  if (params) str += '(';

  for (var i in params) {
    str += '$' + params[i]['name'] + ', ';
  }

  if (params) str = str.slice(0, -2) + ')';

  if (typeof mixin.content === 'string') {
    str += ' { }';
  }
  else {
    str += ';'
  }

  str = hljs.highlight('scss', str).value;

  return new handlebars.SafeString(str);
});

/**
 * Formats a function using a SassDoc function object to look like this:
 * ```scss
 * function($param, $param)
 * ```
 *
 * @param {object} func - Function data, taken from a SassDoc object.
 * @returns {string} A formatted code sample.
 */
handlebars.registerHelper('writeSassFunction', function(func) {
  var name = func['context']['name'];
  var params = func['parameter'];

  var str = '';
  str += name + '(';

  for (var i in params) {
    str += '$' + params[i]['name'] + ', ';
  }
  if (params) str = str.slice(0, -2);
  str += ')';

  str = hljs.highlight('scss', str).value;

  return new handlebars.SafeString(str);
});

/**
 * Formats a variable declaration using a SassDoc variable object to look like this:
 * ```scss
 * $name: $value;
 * ```
 *
 * @param {object} variable - Variable data, taken from a SassDoc object.
 * @returns {string} A formatted code sample.
 */
handlebars.registerHelper('writeSassVariable', function(variable) {
  var name = variable['context']['name'];
  var value = variable['context']['value'];
  var str = '$' + name + ': ' + value + ';';
  str = hljs.highlight('scss', str).value;

  return new handlebars.SafeString(str);
});

/**
 * Formats SassDoc "type" definitions to read "x or y or z"
 * @param {string[]} types - Array of types.
 * @returns {string} A formatted string.
 */
handlebars.registerHelper('formatSassTypes', function(types) {
  if (typeof types === 'undefined') return '';

  var types = types.replace(' ', '').split('|');
  var output = '';

  for (var i in types) {
    output += types[i] + ' or ';
  }

  return output.slice(0, -4);
});

/**
 * Format a Sass value:
 *   - For basic values, return as-is.
 *   - For maps, render each item in the map on its own line.
 *   - For undefined values, return "None"
 * @param {string} value - Sass value to format.
 * @returns {string} A formatted value.
 */
handlebars.registerHelper('formatSassValue', function(value) {
  if (typeof value === 'undefined') return '<span style="color: #999;">None</span>';

  if (value[0] === '(' && value[value.length - 1] === ')') {
    value = value.slice(1, -1).split(',').join('<br>');
  }

  return value;
});

// Adds an external link, pulled from a SassDock @link annotation.
handlebars.registerHelper('writeSassLink', function(link) {
  if (!link) return '';

  var output = format('<p><strong>Learn more:</strong> <a href="{0}">{1}</a></p>', [link[0].url, link[0].caption]);

  return new handlebars.SafeString(output);
});
