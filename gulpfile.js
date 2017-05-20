"use strict";

var gulp     = require ('gulp'),
    concat   = require('gulp-concat'),
    minify   = require('gulp-uglify'),
    rename   = require('gulp-rename'),
    sass     = require('gulp-sass'),
    maps     = require('gulp-sourcemaps'),
    clean    = require('gulp-clean-css'),
    del      = require('del'),
    sprite   = require('gulp.spritesmith'),
    buffer   = require('vinyl-buffer'),
    csso     = require('gulp-csso'),
    imagemin = require('gulp-imagemin'),
    merge    = require('merge-stream'),
    babel    = require('gulp-babel');

// Concatenate JS files

gulp.task('concatJS', ['convertJS'], function() {
  return gulp.src([
    'js/jquery.js',
    'js/foundation.js',
    'js/foundation.equalizer.js',
    'js/foundation.reveal.js',
    'js/fastclick.js',
    'js/scripts.js'
  ])
  .pipe(maps.init())
  .pipe(concat('app.js'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('js'));
})

// Use babel to conver to ES5
gulp.task('convertJS', function() {
    return gulp.src('js/scripts.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('js'));
});

// Minify JS files

gulp.task('minifyJS', ['concatJS'], function() {
  return gulp.src('js/app.js')
  .pipe(minify())
  .pipe(rename('app.min.js'))
  .pipe(gulp.dest('js'))
})

// Compile Sass

gulp.task('compileSass', ['sprite'], function() {
  return gulp.src('scss/app.scss')
  .pipe(maps.init())
  .pipe(sass())
  .pipe(maps.write('./'))
  .pipe(gulp.dest('css'));
})

// Minify CSS

gulp.task('minifyCss', ['compileSass'], function() {
  return gulp.src('css/app.css')
  .pipe(clean())
  .pipe(rename('app.min.css'))
  .pipe(gulp.dest('css'));
})

// Watch CSS and Scripts
gulp.task('watch', function() {
  gulp.watch('scss/**/*.scss', ['minifyCss']);
  gulp.watch('js/scripts.js', ['minifyJS']);
})

// Create avatars spritesheet
gulp.task('sprite', function () {
  var spriteData = gulp.src('img/avatars/*.jpg')
  .pipe(sprite({
    imgName: 'sprite.png',
    cssName: 'sprite.css',
    imgPath: '../img/avatars/sprite.png'
  }));
  var imgStream = spriteData.img
    .pipe(buffer())
    .pipe(gulp.dest('img/avatars/'));

  var cssStream = spriteData.css
    .pipe(csso())
    .pipe(rename('_sprite.scss'))
    .pipe(gulp.dest('scss/layout'));

  return merge(imgStream, cssStream);
});

// Compress images
gulp.task('compressImgs', ['sprite'], () =>
    gulp.src('src/img/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
);

// Serve task

gulp.task('serve', ['watch']);

// Clean task
gulp.task('clean', function() {
  del(['dist', 'css', 'js/app*.js**', 'img/avatars/sprite.png']);
})

// Build task
gulp.task('build', ['minifyJS', 'minifyCss', 'compressImgs'], function() {
  return gulp.src([
    'css/app.min.css',
    'css/app.css.map',
    'js/app.min.js',
    'js/app.js.map',
    'index.html',
    'img/**',
  ], {base: './'})
  .pipe(gulp.dest('dist'));
});

// Default Task
gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
