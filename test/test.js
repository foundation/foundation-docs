var expect = require('chai').expect;
var fs = require('fs');
var handlebars = require('handlebars');
var supercollider = require('supercollider');
var docs = require('..');

describe('Page Template', function() {
  it('produces a template leveraging Markdown, SassDoc, and JSDoc data', function(done) {
    supercollider
      .config({
        src: 'test/fixtures/*.md',
        dest: 'test/output',
        template: 'templates/component.html',
        marked: docs.marked,
        handlebars: docs.handlebars
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
