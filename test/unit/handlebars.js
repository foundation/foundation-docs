var expect = require('chai').expect;
var Handlebars = require('../../lib/handlebars');
var stripHtml = require('striptags');

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

    describe('{{#filter}}', () => {
      it('filters private SassDoc and JSDoc objects', () => {
        var data = {
          item: { access: 'private' }
        };

        compare('{{#filter item}}Private{{/filter}}', '', data);
      });

      it('displays public SassDoc and JSDoc objects', () => {
        var data = {
          item: { access: 'public' }
        };

        compare('{{#filter item}}Public{{/filter}}', 'Public', data);
      });

      it('filters SassDoc aliases', () => {
        var data = {
          item: { alias: true }
        };

        compare('{{#filter item}}Alias{{/filter}}', '', data);
      });
    });
  });

  describe('JavaScript', () => {
    describe('{{writeJsConstructor}}', () => {
      it('prints formatted JavaScript code to initialize a Foundation plugin', () => {
        var template = Handlebars.compile('{{writeJsConstructor "Plugin"}}');
        var output = template();

        expect(output, 'Should be formatted by Highlight.js').to.contain('hljs');
        expect(stripHtml(output), 'Should include Foundation code').to.equal('var elem = new Foundation.Plugin(element, options);');
      });
    });

    describe('{{writeJsFunction}}', () => {
      it('prints a JavaScript function with no parameters', () => {
        var data = {
          method: {
            name: 'petKitty',
            params: []
          }
        };

        var template = Handlebars.compile('{{writeJsFunction method}}');
        var output = template(data);

        expect(stripHtml(output)).to.equal(`$('#element').foundation('petKitty');`);
      });

      it('prints a JavaScript function with parameters', () => {
        var data = {
          method: {
            name: 'petKitty',
            params: [
              { name: 'param1' },
              { name: 'param2' }
            ]
          }
        };

        var template = Handlebars.compile('{{writeJsFunction method}}');
        var output = template(data);

        expect(stripHtml(output)).to.equal(`$('#element').foundation('petKitty', param1, param2);`);
      });
    });

    describe('{{formatJsModule}}', () => {
      it('converts a JSDoc module definition to a filename', () => {
        compare('{{formatJsModule "module:foundation.toggler"}}', 'foundation.toggler.js');
      });
    });

    describe('{{formatJsOptionName}}', () => {
      it('converts a plugin option name to an HTML data attribute', () => {
        compare('{{formatJsOptionName "optionName"}}', 'data-option-name');
      });
    });

    describe('{{formatJsOptionValue}}', () => {
      it('prints non-String values as-is', () => {
        var data = {
          value: ['0']
        };

        compare('{{formatJsOptionValue value}}', '0', data);
      });

      it('prints String values without the quotes on either side', () => {
        var data = {
          singleQuotes: ["'value'"],
          multiQuotes: ['"value"']
        };

        compare(`{{formatJsOptionValue singleQuotes}}`, 'value', data);
        compare(`{{formatJsOptionValue multiQuotes}}`, 'value', data);
      });

      it('returns an empty string if an option is missing a value', () => {
        compare('{{formatJsOptionValue}}', '');
      });
    });

    describe('{{formatJsEventName}}', () => {
      it('formats a JSDoc event to look like Foundation-namespaced events', () => {
        var data = {
          name: 'event',
          title: 'Plugin'
        };

        compare('{{formatJsEventName name title}}', 'event.zf.plugin', data);
      });

      it('handles plugin names that are intercapped', () => {
        var data = {
          name: 'event',
          title: 'PluginName'
        };

        compare('{{formatJsEventName name title}}', 'event.zf.pluginName', data);
      });
    });
  });
});

function compare(input, expected, data) {
  var template = Handlebars.compile(input);
  expect(template(data || {})).to.equal(expected);
}
