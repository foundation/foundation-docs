var beautify = require('js-beautify').html;
var Cheerio = require('cheerio');
var Inky = require('inky').Inky;
var format = require('string-template');
var hljs = require('highlight.js');
var multiline = require('multiline');
var fs = require('fs');
var path = require('path');
var strip = require('strip-indent');
var mkdirp = require('mkdirp').sync;

var fileCounter = 0;
var examplesPath = path.join(process.cwd(), './_build/examples');

var INKY_TEMPLATE = multiline(function() {/*
<div class="docs-code-wrapper">
  <span class="docs-code-language" data-docs-code-current>HTML</span>
  <button class="docs-code-toggle" type="button" data-docs-code-toggle>Switch to Inky</button>
  <div class="docs-code docs-code-inky" data-docs-code>
    <pre>
      <code class="{0}">{1}</code>
    </pre>
  </div>
  <div class="docs-code docs-code-html" data-docs-code>
    <pre>
      <code class="{0}">{2}</code>
    </pre>
  </div>
</div>
<p class="docs-code-language">DEMO</p>
<iframe class="docs-code-iframe" src="examples/{3}"></iframe>
*/}).replace(/(^(\s)*|\n)/gm, '');

var IFRAME_TEMPLATE = multiline(function() {/*
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width"/>
    <link rel="stylesheet" href="../assets/css/foundation-emails.css">
  </head>
  <body>
    <table class="body">
      <tr>
        <td class="center" align="center" valign="top">
          <table class="container">
            <tr>
              <td>
                {0}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
*/});

/**
 * Renders an Inky code sample, showing Inky code alongside compiled HTML, as well as an iframe with the live HTML sample.
 * @param {string} code - Inky code to process.
 * @returns {string} HTML for the Inky and HTML examples. The function also writes an HTML file to disk containing the live HTML example, with the Foundation for Emails CSS referenced.
 */
module.exports = function(code) {
  // Load Inky code sample into Inky parser
  var $ = Cheerio.load(code);
  var output = new Inky().releaseTheKraken($);

  // Separate Inky code and HTML code
  var inkyCode = hljs.highlight('html', code).value;
  var htmlCode = hljs.highlight('html', beautify(output, { indent_size: 2 })).value;

  // Create iframe code
  var iframeCode = format(IFRAME_TEMPLATE, [output]);
  var iframeFile = 'example-' + (fileCounter++) + '.html';

  // Create folder for code samples if it doesn't exist
  if (!fs.existsSync(examplesPath)) {
    mkdirp(examplesPath);
  }

  // Write an iframe with the full HTML needed to the build folder
  fs.writeFileSync(path.join(examplesPath, iframeFile), iframeCode);

  // Return a final code sample with Inky source, HTML source, and iframe reference
  return format(INKY_TEMPLATE, [
    'html',
    strip(inkyCode),
    strip(htmlCode),
    iframeFile
  ]);
}
