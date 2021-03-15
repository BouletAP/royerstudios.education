var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');



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

  gulp.watch("./_scss/*.scss", gulp.series('sass'));

  gulp.watch("./*.html").on('change', browserSync.reload);
  gulp.watch("./medias/*.css").on('change', browserSync.reload);
});


gulp.task('watcher', gulp.parallel ('sass', 'bs')); 
