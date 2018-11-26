var escape = require('./escape');
var topText = require('./topText');
var format = require('string-template');

module.exports = function (text, level, anchor) {
  var title = anchor || text;

  var topLevelText = topText(title).trim();
  var escapedText = escape(topLevelText);
  var magellan = (level === 2) ? format(' data-magellan-target="{0}"', [escapedText]) : '';

  return format('<h{0} id="{1}" class="docs-heading"{3}>{2}<a class="docs-heading-icon" href="#{1}"></a></h{0}>', [level, escapedText, text, magellan]);
}
