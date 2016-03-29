var expect = require('chai').expect;
var fs = require('fs');
var rimraf = require('rimraf');

describe('Utilities', function() {
  describe('buildInkySample', function() {
    var buildInkySample = require('../../lib/util/buildInkySample');

    afterEach(function(done) {
      rimraf('_build', done);
    });

    it('creates two HTML code samples with Inky and HTML code', function() {
      var input = '<container></container>';
      var output = buildInkySample(input);

      expect(output).to.contain('hljs');
      expect(output).to.contain('container');
      expect(output).to.contain('table')
    });

    it('creates a HTML file with the rendered HTML example', function(done) {
      var input = '<container></container>';
      var output = buildInkySample(input);

      fs.exists('_build/examples/example-1.html', function(exists) {
        expect(exists).to.be.true;
        done();
      });
    });
  });

  describe('escape', function() {
    var escape = require('../../lib/util/escape');

    it('escapes a string for use in an HTML anchor', function() {
      var escapedText = escape('Title of Section');
      expect(escapedText).to.equal('title-of-section');
    });
  });

  describe('writeHeading', function() {
    var writeHeading = require('../../lib/util/writeHeading');

    it('writes a section heading with custom classes, an escaped ID, and an anchor icon', function() {
      var heading = writeHeading('Section Title', 2);

      expect(heading).to.contain('<h2 id="section-title" class="docs-heading"');
      expect(heading).to.contain('Section Title');
      expect(heading).to.contain('<a class="docs-heading-icon" href="#section-title"></a>');
      expect(heading).to.contain('</h2>');
    });

    it('allows for a custom anchor to be defined', function() {
      var heading = writeHeading('Section Title', 2, 'custom-anchor');

      expect(heading).to.contain('<h2 id="custom-anchor"');
      expect(heading).to.contain('href="#custom-anchor"');
    });
  });
});
