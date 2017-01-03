var escape    = require('./util/escape')
var format    = require('string-template');
var hljs      = require('highlight.js');
var heading   = require('./util/writeHeading');
var marked    = require('marked');
var multiline = require('multiline');

var mdRenderer = new marked.Renderer();

var HTML_EXAMPLE_TEMPLATE = multiline(function() {/*
<div class="docs-code" data-docs-code>
  <pre>
    <code class="{0}">{1}</code>
  </pre>
</div>
*/}).replace(/(^(\s)*|\n)/gm, '');

// Adds an anchor link to each heading created
mdRenderer.heading = heading;

// Adds special formatting to each code block created
// If the language is suffixed with "_example", the raw HTML is printed after the code sample, creating a live example.
mdRenderer.code = function(code, language) {
  var extraOutput = '';

  if (language === 'inky_example') {
    return require('./util/buildInkySample')(code);
  }

  if (typeof language === 'undefined') language = 'html';
  else if (language === 'inky') language = 'html';

  // If the language is *_example, live code will print out along with the sample
  if (language === 'html_example') {
    extraOutput = format('\n\n<div class="docs-code-live">{0}</div>', [code]);
    language = language.replace(/_example$/, '');
  }

  var renderedCode = hljs.highlight(language, code).value;
  var output = format(HTML_EXAMPLE_TEMPLATE, [language, renderedCode]);

  return output + extraOutput;
}

module.exports = mdRenderer;
