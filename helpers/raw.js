/**
 * This helper is used to render documentation pages that have Handlebars code. The raw helper ignores any Handlebars code inside of it.
 */
module.exports = function(content) {
  return content.fn();
}
