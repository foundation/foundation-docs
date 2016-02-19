var format      = require('string-template');
var handlebars  = require('handlebars');
var multiline   = require('multiline');
var querystring = require('querystring');

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

  // Iterate through adapter data (will be 0-2 values)
  for (var i in files) {
    // "module" will be one or more file paths/globs
    var module = files[i];

    // Convert a single value to an array
    if (typeof module === 'string') module = [module];

    // Don't process paths that ignore files, i.e.:
    // !scss/grid/_flex-grid.scss
    module = module.filter(function(val) {
      return val[0] !== '!';
    });

    // If the path is a glob, convert it to a folder path, i.e.:
    // scss/grid/**/* -> scss/grid/
    module = module.map(function(val) {
      if (val.indexOf('*') > -1) {
        val = val.split('*')[0];
      }
      return val;
    })[0];

    // Add a link to the source file found
    output += format('<li><a href="{0}">{1}</a></li>', [
      'https://github.com/zurb/foundation-sites/tree/master/' + module,
      // If the component *only* has SCSS or JS source, write "View Source"
      // If it has both, write "View Sass Source" or "View JavaScript Source" to distinguish between them
      (both ? 'View ' + text[i] + ' Source' : 'View Source')
    ]);
  }

  return output;
});
