var $ = require('gulp-load-plugins')();
var browser = require('browser-sync');
var docs = require('./index');
var gulp = require('gulp');
var panini = require('panini');
var supercollider = require('supercollider');
var autoprefixer = require('autoprefixer');

// Supercollider configuration
supercollider
  .config({
    template: 'templates/component.html',
    marked: docs.marked,
    handlebars: docs.handlebars
  })
  .searchConfig({})
  .adapter('sass')
  .adapter('js')

// Generates a documentation page
gulp.task('pages', function() {
  panini.refresh();

  return gulp.src('test/fixtures/*.md')
    .pipe(supercollider.init())
    .pipe(panini({
      root: 'test/fixtures',
      layouts: 'test/visual',
      partials: 'test/visual/partials'
    }))
    .pipe(gulp.dest('test/visual/_build'))
    .on('finish', function() {
      browser.reload();
      supercollider.buildSearch('test/visual/_build/data/search.json');
    });
});

// Compiles documentation CSS
gulp.task('sass', function() {
  return gulp.src('test/visual/docs.scss')
    .pipe($.sass({
      includePaths: [
        'scss',
        'node_modules/foundation-sites/scss',
        'node_modules/motion-ui/src'
      ]
    }).on('error', $.sass.logError))
    .pipe($.postcss([
      autoprefixer() // uses ".browserslistrc"
    ]))
    .pipe(gulp.dest('test/visual/_build'))
    .pipe(browser.reload({ stream: true }));
});

gulp.task('javascript', function() {
  return gulp.src('js/**/*.js')
    .pipe($.concat('docs.js'))
    .pipe(gulp.dest('test/visual/_build'));
});

// Build everything
gulp.task('build', gulp.parallel('pages', 'sass', 'javascript'));

// Create a server for visual tests
gulp.task('serve', function (done) {
  browser.init({ server: 'test/visual/_build' });
  done();
});

// Watch for changes and re-trigger the build
gulp.task('watch', function() {
  gulp.watch(['text/fixtures/**/*', 'test/visual/**/*.html'], gulp.series('pages'));
  gulp.watch(['scss/**/*', 'test/visual/docs.scss'], gulp.series('sass'));
  gulp.watch(['js/**/*'], gulp.series('javascript'));
});

// Creates a server and watches for file changes
gulp.task('default', gulp.series('build', 'serve', 'watch'));
