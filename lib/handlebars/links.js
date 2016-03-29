var format      = require('string-template');
var handlebars  = require('handlebars');
var multiline   = require('multiline');
var querystring = require('querystring');

/**
 * Create a link to edit the current page on GitHub. The filename of the page ends in `.html`, but the source file is `.md`, so this helper replaces the extension.
 * The edit link goes to the `master` branch, not `develop`, so that merged PRs for the docs can be deployed right away.
 * @param {string} repo - Repository to link to.
 * @param {string} branch - Git branch to link to.
 * @param {string} value - Filename to use.
 * @returns {string} A URL to GitHub to edit the current page.
 */
handlebars.registerHelper('editLink', function(repo, branch, value) {
  value = value.replace('.html', '.md');
  return format('https://github.com/zurb/{0}/edit/{1}/{2}', [repo, branch, value]);
});

/**
 * Create a link to open a new issue on GitHub, preformatted with a placeholder title and content.
 * @param {string} repo - Repository to link to.
 * @param {string} name - Name of the current page.
 * @returns {string} A URL to GitHub to open a new issue.
 */
handlebars.registerHelper('issueLink', function(repo, name) {
  return 'https://github.com/zurb/'+repo+'/issues/new?' + querystring.stringify({
    title: format('[{0}] ISSUE NAME HERE', [name])
  });
});

/**
 * Not currently being used.
 *
 * Renders one or more links to "View Source" on GitHub. The output varies depending on the page:
 *   - If the page has no Sass or JavaScript code, no links are created.
 *   - If the page has *only* Sass *or* JavaScript code, a link to the relevant file is created.
 *   - If the page has *both* Sass *and* JavaScript code, links to both files are created.
 *   - If a Sass path is a glob, the star pattern at the end is removed, so a link to the containing folder can be created.
 *     - Example: `scss/**` becomes `scss/`.
 *
 * @param {string} repo - Repository to link to.
 * @param {object} files - Adapter data from SuperCollider, which will contain `.sass` or `.js` parameters.
 * @returns A series of `<li>`s, one for each source link created.
 */
// handlebars.registerHelper('sourceLink', function(repo, files) {
//   var output = '';
//   var text = {
//     'sass': 'Sass',
//     'js': 'JavaScript'
//   }
//   var both = files.sass && files.js;
//
//   // Iterate through adapter data (will be 0-2 values)
//   for (var i in files) {
//     // "module" will be one or more file paths/globs
//     var module = files[i];
//
//     // Convert a single value to an array
//     if (typeof module === 'string') module = [module];
//
//     // Don't process paths that ignore files, i.e.:
//     // !scss/grid/_flex-grid.scss
//     module = module.filter(function(val) {
//       return val[0] !== '!';
//     });
//
//     // If the path is a glob, convert it to a folder path, i.e.:
//     // scss/grid/**/* -> scss/grid/
//     module = module.map(function(val) {
//       if (val.indexOf('*') > -1) {
//         val = val.split('*')[0];
//       }
//       return val;
//     })[0];
//
//     // Add a link to the source file found
//     output += format('<li><a href="{0}">{1}</a></li>', [
//       'https://github.com/zurb/'+repo+'/tree/master/' + module,
//       // If the component *only* has SCSS or JS source, write "View Source"
//       // If it has both, write "View Sass Source" or "View JavaScript Source" to distinguish between them
//       (both ? 'View ' + text[i] + ' Source' : 'View Source')
//     ]);
//   }
//
//   return output;
// });
