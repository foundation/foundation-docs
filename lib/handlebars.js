var marked      = require('marked');
var multiline   = require('multiline');
var handlebars  = require('handlebars');
var hljs        = require('highlight.js');
var format      = require('string-template');
var querystring = require('querystring');
var escape      = require('./util/escape');
var kebab       = require('kebab-case');
var heading     = require('./util/writeHeading');

var ISSUE_TEXT = multiline(function() {/*
**How can we reproduce this bug?**

1. Step one
2. Step two
3. Step three

**What did you expect to happen?**

**What happened instead?**

**Test case**

Give us a link to a [CodePen](http://codepen.io) or [JSFiddle](http://jsfiddle.net) that recreates the issue.
*/});

/**
 * Converts Markdown to HTML.
 * @param {string} text - Markdown string.
 * @returns {string} Converted HTML.
 */
handlebars.registerHelper('md', function(text) {
  return marked(text);
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

  return str;
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

  return str;
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

  return str;
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

// Adds an external link, pulled from a SassDock @link annotation.
handlebars.registerHelper('writeSassLink', function(link) {
  if (!link) return '';

  return format('<p><strong>Learn more:</strong> <a href="{0}">{1}</a></p>', [link[0].url, link[0].caption]);
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

/**
 * Create a link to edit the current page on GitHub. The filename of the page ends in `.html`, but the source file is `.md`, so this helper replaces the extension.
 * The edit link goes to the `master` branch, not `develop`, so that merged PRs for the docs can be deployed right away.
 * @param {string} value - Filename to use.
 * @returns {string} A URL to GitHub to edit the current page.
 */
handlebars.registerHelper('editLink', function(value) {
  return format('https://github.com/zurb/foundation-sites/edit/master/{0}', [value.replace('.html', '.md')]);
});

/**
 * Create a link to open a new issue on GitHub, preformatted with a placeholder title and content.
 * @param {string} name - Name of the current page.
 * @returns {string} A URL to GitHub to open a new issue.
 */
handlebars.registerHelper('issueLink', function(name) {
  return 'https://github.com/zurb/foundation-sites/issues/new?' + querystring.stringify({
    title: format('[{0}] ISSUE NAME HERE', [name]),
    body: ISSUE_TEXT
  });
});

/**
 * Renders one or more links to "View Source" on GitHub. The output varies depending on the page:
 *   - If the page has no Sass or JavaScript code, no links are created.
 *   - If the page has *only* Sass *or* JavaScript code, a link to the relevant file is created.
 *   - If the page has *both* Sass *and* JavaScript code, links to both files are created.
 *   - If a Sass path is a glob, the star pattern at the end is removed, so a link to the containing folder can be created.
 *     - Example: `scss/**` becomes `scss/`.
 *
 * @param {object} files - Adapter data from SuperCollider, which will contain `.sass` or `.js` parameters.
 * @returns A series of `<li>`s, one for each source link created.
 */
handlebars.registerHelper('sourceLink', function(files) {
  var output = '';
  var text = {
    'sass': 'Sass',
    'js': 'JavaScript'
  }
  var both = files.sass && files.js;

  for (var i in files) {
    var module = files[i];
    if (typeof module === 'string') module = [module];
    module = module.filter(function(val) {
      return val[0] !== '!';
    }).map(function(val) {
      if (val.indexOf('*') > -1) {
        val = val.split('*')[0];
      }
      return val;
    })[0];
    output += format('<li><a href="{0}">{1}</a></li>', [
      'https://github.com/zurb/foundation-sites/tree/master/' + module,
      (both ? 'View ' + text[i] + ' Source' : 'View Source')
    ]);
  }

  return output;
});

module.exports = handlebars;
