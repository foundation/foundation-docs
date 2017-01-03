var $ = require('gulp-load-plugins')();
var browser = require('browser-sync');
var docs = require('./index');
var gulp = require('gulp');
var panini = require('panini');
var supercollider = require('supercollider');

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
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('test/visual/_build'))
    .pipe(browser.reload({ stream: true }));
});

gulp.task('javascript', function() {
  gulp.src('js/**/*.js')
    .pipe($.concat('docs.js'))
    .pipe(gulp.dest('test/visual/_build'));
});

// Creates a server and watches for file changes
gulp.task('default', ['pages', 'sass', 'javascript'], function() {
  browser.init({
    server: 'test/visual/_build'
  });

  gulp.watch(['text/fixtures/**/*', 'test/visual/**/*.html'], ['pages']);
  gulp.watch(['scss/**/*', 'test/visual/docs.scss'], ['sass']);
  gulp.watch(['js/**/*'], ['javascript']);
});
