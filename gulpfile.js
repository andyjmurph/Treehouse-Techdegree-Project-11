"use strict";

var gulp = require ('gulp'),
    concat = require('gulp-concat'),
    minify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass   = require('gulp-sass'),
    maps   = require('gulp-sourcemaps'),
    clean  = require('gulp-clean-css'),
    del    = require('del');

// Concatenate JS files

gulp.task('concatJS', function() {
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

// Minify JS files

gulp.task('minifyJS', ['concatJS'], function() {
  return gulp.src('js/app.js')
  .pipe(minify())
  .pipe(rename('app.min.js'))
  .pipe(gulp.dest('js'))
})

// Compile Sass

gulp.task('compileSass', function() {
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

// Serve task

gulp.task('serve', ['watch']);

// Clean task
gulp.task('clean', function() {
  del(['dist', 'css', 'js/app*.js**']);
})

// Build task
gulp.task('build', ['minifyJS', 'minifyCss'], function() {
  return gulp.src([
    'css/app.min.css',
    'js/app.min.js',
    'index.html',
    'img/**',
  ], {base: './'})
  .pipe(gulp.dest('dist'));
});

// Default Task
gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
