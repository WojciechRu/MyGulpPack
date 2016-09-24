'use strict';
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    pug = require('gulp-pug'),
    autoprefixer = require('autoprefixer'),
    uglify = require('gulp-uglify'),
    cssnano = require('cssnano'),
    postcss = require('gulp-postcss'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create();

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        cssAssets: 'build/css/plugins',
        jsAssets: 'build/js/plugins',
        img: 'build/images/',
        fonts: 'build/fonts/'
    },
    src: {
        markup: 'src/jade/*.pug',
        js: 'src/js/*.js',
        style: 'src/sass/*.scss',
        cssAssets: 'src/sass/plugins/*.scss',
        jsAssets: 'src/js/plugins/*.js',
        img: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        markup: 'src/jade/**/*.pug',
        js: 'src/js/**/*.js',
        style: 'src/sass/**/*.*',
        cssAssets: 'src/sass/plugins/**/*.*',
        jsAssets: 'src/js/plugins/**/*.*',
        img: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});

gulp.task('markup:build', function () {
    gulp.src(path.src.markup)
        .pipe(pug({}))
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        //.pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sass({errLogToConsole: true}))
        .pipe(postcss([
                autoprefixer({browsers: ['last 5 version']}),
                //cssnano(),
        ]))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
});

gulp.task('jsAssets:build', function () {
    gulp.src(path.src.jsAssets)
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.jsAssets))
        .pipe(browserSync.stream());
});

gulp.task('cssAssets:build', function () {
    gulp.src(path.src.cssAssets)
        .pipe(sass({errLogToConsole: true}))
        .pipe(postcss([
                autoprefixer({browsers: ['last 5 version']}),
                cssnano(),
        ]))
        .pipe(gulp.dest(path.build.cssAssets))
        .pipe(browserSync.stream());
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream());
});

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'markup:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
    'jsAssets:build',
    'cssAssets:build',
]);


gulp.task('watch', function () {
    watch([path.watch.markup], function (event, cb) {
        gulp.start('markup:build');
    });
    watch([path.watch.style], function (event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.jsAssets], function (event, cb) {
        gulp.start('jsAssets:build');
    });
    watch([path.watch.cssAssets], function (event, cb) {
        gulp.start('cssAssets:build');
    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('default', ['build', 'browser-sync', 'watch']);