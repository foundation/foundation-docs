var escape = require('./escape');
var format = require('string-template');

module.exports = function(text, level, anchor) {
  var escapedText = anchor ? escape(anchor) : escape(text);
  var magellan = (level === 2) ? format(' data-magellan-target="{0}"', [escapedText]) : '';

  return format('<h{0} id="{1}" class="docs-heading"{3}>{2}<a class="docs-heading-icon" href="#{1}"></a></h{0}>', [level, escapedText, text, magellan]);
}
