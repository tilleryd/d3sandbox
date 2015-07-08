var babel = require('gulp-babel');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var del = require('del');
var gulp = require('gulp');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var minifyCSS = require('gulp-minify-css');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var config = {production: true};

function onError (error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('set-development', function() {
  config.production = false;
});

gulp.task('clean', function(cb) {
  del([
    'dist/bundle.js',
    'css/**/*.css'
  ], cb);
});

gulp.task('javascript', function(){
  var b = browserify({
    entries: 'app.react.js',
    paths: './src',
    debug: config.production,
    transform: [babelify]
  });
  
  if(config.production) {
    return b.bundle()
      .on('error', onError)
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest('./dist'));
  } else {
    return b.bundle()
      .on('error', onError)
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./dist'))
      .pipe(livereload());
  }
});

gulp.task('less', function() {
  if(config.production) {
    gulp
      .src('./less/**/*.less')
      .pipe(less({compress: true}))
      .on('error', onError)
      .pipe(minifyCSS({keepBreaks: false}))
      .pipe(gulp.dest('./css'));
  } else {
    gulp
      .src('./less/**/*.less')
      .pipe(less())
      .on('error', onError)
      .pipe(gulp.dest('./css'))
      .pipe(livereload());
  }
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(['src/**/*.js'], ['set-development', 'javascript']);
  gulp.watch(['less/**/*.less'], ['set-development', 'less']);
});
 
gulp.task('prod', ['clean', 'javascript', 'less']);
gulp.task('dev', ['set-development', 'clean', 'javascript', 'less']);

gulp.task('default', ['prod']);
