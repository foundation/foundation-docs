var docs = require('../..');
var expect = require('chai').expect;
var fs = require('fs');
var handlebars = require('handlebars');
var supercollider = require('supercollider');

describe('Page Template', function() {
  it('produces a template leveraging Markdown, SassDoc, and JSDoc data', function(done) {
    this.timeout(0);

    supercollider
      .config({
        src: 'test/fixtures/component.md',
        dest: 'test/output',
        template: 'templates/component.html',
        marked: docs.marked,
        handlebars: docs.handlebars,
        quiet: true
      })
      .adapter('sass')
      .adapter('js')

    var stream = supercollider.init();
    stream.on('finish', function() {
      expect(fs.existsSync('test/output/component.html')).to.be.true;
      done();
    });
  });
});
