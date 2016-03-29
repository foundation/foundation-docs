var expect = require('chai').expect;
var Handlebars = require('../../lib/handlebars');

describe('Handlebars Helpers', () => {
  describe('Formatting', () => {
    describe('{{md}}', () => {
      it('converts Markdown to HTML', () => {
        compare('{{md "**Bold**"}}', '<p><strong>Bold</strong></p>\n');
      });
    });

    describe('{{#heading}}', () => {
      it('creates a heading of a specific level', () => {
        var expected = '<h1 id="title" class="docs-heading">Title<a class="docs-heading-icon" href="#title"></a></h1>';

        compare('{{#heading 1}}Title{{/heading}}', expected);
      });

      it('creates a heading with a custom ID', () => {
        var expected = '<h1 id="custom" class="docs-heading">Title<a class="docs-heading-icon" href="#custom"></a></h1>';

        compare('{{#heading 1 "custom"}}Title{{/heading}}', expected);
      });
    });

    describe('{{escape}}', () => {
      it('escapes text for use in a URL hash', () => {
        compare('{{escape "this text"}}', 'this-text');
      });
    });

    describe('{{toUpper}}', () => {
      it('capitalizes the first letter of a string', () => {
        compare('{{toUpper "kittens"}}', 'Kittens');
      });
    });

    describe('{{toLower}}', () => {
      it('converts a string to lowercase', () => {
        compare('{{toLower "SHOUT"}}', 'shout')
      });
    });

    describe('{{raw}}', () => {
      it('ignores Handlebars', () => {
        compare('{{{{raw}}}}{{ignore}}{{{{/raw}}}}', '{{ignore}}');
      });
    });

    // describe('{{raw}}')
  });
});

function compare(input, expected) {
  var template = Handlebars.compile(input);
  expect(template()).to.equal(expected);
}
