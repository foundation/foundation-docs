var escape     = require('../util/escape');
var handlebars = require('handlebars');
var heading    = require('../util/writeHeading');
var marked     = require('marked');

/**
 * Converts Markdown to HTML.
 * @param {string} text - Markdown string.
 * @returns {string} Converted HTML.
 */
handlebars.registerHelper('md', function(text) {
  return new handlebars.SafeString(marked(text));
});

/**
 * Renders an HTML heading with a clickable anchor link.
 * @param {integer} level - The level of the heading, 1 through 6.
 * @param {string=} anchor - Anchor to use in the ID of the heading. If not specified, the anchor will be the escaped text of the heading.
 * @returns {string} HTML heading with an anchor link inside.
 */
handlebars.registerHelper('heading', function(level, anchor, options) {
  // Allow for optional second parameter
  if (typeof anchor === 'object') {
    options = anchor;
    anchor = options.fn(this);
  }

  return heading(options.fn(this), level, anchor);
});

/**
 * Escapes a string for use in a URL hash.
 * @param {string} text - String to escape.
 */
handlebars.registerHelper('escape', escape);

/**
 * Capitalizes the first letter of a string.
 * @param {string} text - Text to convert.
 * @returns {string} A capitalized string.
 */
handlebars.registerHelper('toUpper', function(str) {
  if (typeof str === 'undefined') str = '';
  return str[0].toUpperCase() + str.slice(1);
});

/**
 * Converts a string to lowercase.
 * @param {string} text - Text to convert.
 * @returns {string} A lowercase string.
 */
handlebars.registerHelper('toLower', function(str) {
  if (typeof str === 'undefined') str = '';
  return str.toLowerCase();
});

/**
 * Render a raw string which will not be parsed by Handlebars. This is used on any page that has actual Handlebars code samples. To use this helper, call it with a set of four curly braces instead of two, and no hash:
 * ```Handlebars
 * {{{{raw}}}}
 * {{{{/raw}}}}
 * ```
 *
 * @param {object} content - Handlebars context.
 * @returns {string} The content inside of the block helper, ignored by Handlebars.
 */
handlebars.registerHelper('raw', function(content) {
  return content.fn(this);
});

/**
 * Determine if a Sass or JavaScript item should be displayed. Private items, and items that are aliases, are not shown.
 * @param {object} item - Item to check the visibility of.
 * @returns {string} If the item can be shown, the content inside the block helper.
 */
handlebars.registerHelper('filter', function(item, options) {
  if (item.access === 'private' || item.alias) return '';
  return options.fn(this);
});

/**
 * Render a JSON string from an Object. Useful mostly for debug.
 * @param {object} value - Object to display in a JSON format.
 * @returns {string} JSON formatted string.
 */
handlebars.registerHelper('formatJson', function(value) {
    return JSON.stringify(value);
});
