var Cheerio = require('cheerio');

/**
 * Return the top-level text in the given string or jQuery element without
 * the nested HTML.
 *
 * ```js
 * stripHtml('hello world')         // -> "hello"
 * stripHtml('hello <b>world</b>')  // -> "hello"
 * ```
 */
module.exports = function (param) {
  var $el;

  if (typeof param === 'string')
    $el = Cheerio.load(param)('body');
  else if (typeof param === 'object')
    $el = $el.clone();
  else
    throw new Error('expected a string or a jQuery object, got "' + param + '" (' + typeof param + ')');

  // https://stackoverflow.com/a/33592275
  var $topLevelEl = $el.children().remove().end();
  var text = $topLevelEl.text();

  return text;
}
