var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("./_scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./medias/"))
        .pipe(browserSync.stream());
});

gulp.task('bs', function() {
  browserSync.init({
    server: "./"
  });

  gulp.watch("./_scss/*.scss", gulp.series('sass', 'minify-css', 'rename-minified'));

  gulp.watch("./*.html").on('change', browserSync.reload);
  gulp.watch("./style.min.css").on('change', browserSync.reload);
});

gulp.task('minify-css', () => {
  return gulp.src('./medias/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./'));
});

gulp.task('rename-minified', () => {
  gulp.src("./style.css")
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("./"));
});

gulp.task('watcher', gulp.parallel ('sass', 'bs')); 
