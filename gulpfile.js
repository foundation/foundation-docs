const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browser = require('browser-sync').create();
const docs = require('./index');
const panini = require('panini');
const sass = require('gulp-sass')(require('sass-embedded'));
const supercollider = require('supercollider');
const autoprefixer = require('autoprefixer');

// Supercollider configuration
supercollider
  .config({
    template: 'templates/component.html',
    marked: docs.marked,
    handlebars: docs.handlebars
  })
  .searchConfig({})
  .adapter('sass')
  .adapter('js');

// Generates a documentation page
function pages(done) {
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
      supercollider.buildSearch('test/visual/_build/data/search.json', done);
    });
}

// Compiles documentation CSS
function compileSass() {
  return gulp.src('test/visual/docs.scss')
    .pipe(sass({
      includePaths: [
        'scss',
        'node_modules/foundation-sites/scss',
        'node_modules/motion-ui/src'
      ]
    }).on('error', sass.logError))
    .pipe($.postcss([
      autoprefixer() // uses ".browserslistrc"
    ]))
    .pipe(gulp.dest('test/visual/_build'))
    .pipe(browser.reload({ stream: true }));
}

function javascript() {
  return gulp.src('js/**/*.js')
    .pipe($.concat('docs.js'))
    .pipe(gulp.dest('test/visual/_build'));
}

// Build everything
const build = gulp.parallel(pages, compileSass, javascript);

// Create a server for visual tests
function serve(done) {
  browser.init({ server: 'test/visual/_build' });
  done();
}

// Watch for changes and re-trigger the build
function watch() {
  gulp.watch(['test/fixtures/**/*', 'test/visual/**/*.html'], gulp.series(pages));
  gulp.watch(['scss/**/*', 'test/visual/docs.scss'], gulp.series(compileSass));
  gulp.watch(['js/**/*'], gulp.series(javascript));
}

// Creates a server and watches for file changes
const defaultTask = gulp.series(build, serve, watch);

exports.pages = pages;
exports.sass = compileSass;
exports.javascript = javascript;
exports.build = build;
exports.serve = serve;
exports.watch = watch;
exports.default = defaultTask;