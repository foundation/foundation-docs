var expect = require('chai').expect;
var sass = require('node-sass');

describe('Sass', function() {
  // Limit compilation time to 10s
  this.timeout(10000);

  it('compiles without errors', done => {
    sass.render({
      file: 'test/visual/docs.scss',
      includePaths: [
        'scss',
        'node_modules/tbg-foundation-sites/scss',
        'node_modules/motion-ui/src'
      ]
    }, (err, result) => {
      expect(err).to.be.null;
      done();
    });
  });
});
