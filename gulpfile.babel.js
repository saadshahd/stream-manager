// generated on 2016-08-14 using generator-chrome-extension 0.6.0
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import runSequence from 'run-sequence';
import browserify from 'browserify';
import babelify from 'babelify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';

const $ = gulpLoadPlugins();

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    'app/_locales/**',
    '!app/scripts.babel',
    '!app/*.json',
    '!app/*.html'
  ], {
    base: 'app',
    dot: true
  }).pipe(gulp.dest('dist'));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe($.eslint(options))
      .pipe($.eslint.format());
  };
}

gulp.task('lint', lint('app/scripts.babel/**/*.js', {
  env: {
    es6: true
  }
}));

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('html', () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.sourcemaps.init())
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cleanCss({compatibility: '*'})))
    .pipe($.sourcemaps.write())
    .pipe($.if('*.html', $.htmlmin({removeComments: true, collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('chromeManifest', () => {
  return gulp.src('app/manifest.json')
    .pipe($.chromeManifest({
      buildnumber: true,
      background: {
        target: 'scripts/background.js',
        exclude: [
          'scripts/chromereload.js'
        ]
      }
    }))
    .pipe($.if('*.css', $.cleanCss({compatibility: '*'})))
    .pipe($.if('*.js', $.sourcemaps.init()))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.js', $.sourcemaps.write('.')))
    .pipe(gulp.dest('dist'));
});

function bundleJsFile({srcPath, fileName} = {}) {
  const b = browserify({
    entries: `${srcPath}/${fileName}`,
    transform: babelify.configure({
      plugins: ['transform-runtime']
    }),
    debug: true
  });

  b.bundle()
    .pipe(source(fileName))
    .pipe(buffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('app/scripts/'));
}

gulp.task('babel', () => {
  bundleJsFile({
    srcPath: 'app/bundle',
    fileName: 'main.js'
  });

  bundleJsFile({
    srcPath: 'app/scripts.babel',
    fileName: 'scripts.js'
  });

  return gulp.src('app/scripts.babel/!(scripts).js')
      .pipe($.babel())
      .pipe(gulp.dest('app/scripts'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('watch', ['lint', 'babel', 'html'], () => {
  $.livereload.listen();

  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    'app/styles/**/*',
    'app/_locales/**/*.json'
  ]).on('change', $.livereload.reload);

  gulp.watch(['app/scripts.babel/**/*.js', 'app/bundle/**/*.js'], ['lint', 'babel']);
  gulp.watch('bower.json', ['wiredep']);
  gulp.watch('app/styles/**/*.scss', ['sass']);
});

gulp.task('size', () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('sass', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.sass())
    .pipe(gulp.dest('app/styles/'));
});

gulp.task('package', () => {
  const manifest = require('./dist/manifest.json');

  return gulp.src('dist/**')
      .pipe($.zip('stream manger-' + manifest.version + '.zip'))
      .pipe(gulp.dest('package'));
});

gulp.task('build', cb => {
  runSequence(
    'lint', 'babel', 'sass', 'chromeManifest',
    ['html', 'images', 'extras'],
    'size', cb);
});

gulp.task('default', ['clean'], cb => {
  runSequence('build', cb);
});
