var format     = require('string-template');
var handlebars = require('handlebars');
var hljs       = require('highlight.js');
var kebab      = require('kebab-case');

/**
 * Formats a JavaScript plugin constructor name to look like this:
 * ```js
 * var elem = new Foundation.Plugin(element, options);
 * ```
 *
 * @param {string} name - Name of the plugin.
 * @returns {string} A formatted code sample.
 */
handlebars.registerHelper('writeJsConstructor', function(name) {
  var str = 'var elem = new Foundation.'+name+'(element, options);';
  return hljs.highlight('js', str).value;
})

/**
 * Formats a JavaScript plugin method to look like this:
 * ```js
 * $('#element').foundation('method', param1, param2);
 * ```
 *
 * @param {object} method - Method data, taken from a JSDoc object.
 * @returns {string} A formatted code sample.
 */
handlebars.registerHelper('writeJsFunction', function(method) {
  var str = '$(\'#element\').foundation(\'' + method.name;
  if (method.params) {
    str += '\', ';
    str += (method.params || []).map(function(val) {
      return val.name;
    }).join(', ');
    str += ');';
  }
  else {
    str += '\');'
  }
  return hljs.highlight('js', str).value;
});

/**
 * Convert JSDoc's module definition to a filename.
 * @param {string} value - Module name to convert.
 * @returns {string} A JavaScript filename.
 */
handlebars.registerHelper('formatJsModule', function(value) {
  return value.replace('module:', '') + '.js';
});

/**
 * Format a JavaScript plugin option by converting it to an HTML data attribute.
 * @param {string} name - Plugin option name.
 * @returns {string} Plugin option as an HTML data attribute.
 */
handlebars.registerHelper('formatJsOptionName', function(name) {
  return 'data-' + kebab(name);
});

/**
 * Format a JavaScript plugin option's default value:
 *   - For string values, remove the quotes on either side.
 *   - For all other values, return as-is.
 * @param {string} value - Value to process.
 * @returns {string} Processed value.
 */
handlebars.registerHelper('formatJsOptionValue', function(name) {
  if (typeof name === 'undefined') return '';
  name = name[0];
  if (name.match(/^('|").+('|")$/)) return name.slice(1, -1);
  else return name;
});

/**
 * Format the name of a JavaScript event. This converts JSDoc's slightly convoluted syntax to match our namespaced event names: `event.zf.pluginname`.
 * @todo Make this unnecessary by using the actual event names in JSDoc annotations.
 * @param {string} name - Event name.
 * @param {string} title - Plugin name, used for the event namespace.
 * @returns {string} Formatted event name.
 */
handlebars.registerHelper('formatJsEventName', function(name, title) {
  return format('{0}.zf.{1}', [name, title.toLowerCase().replace(/(-| )/, '')]);
});
