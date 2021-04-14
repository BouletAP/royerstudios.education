var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");

var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );
var ftpinfo = require('./gulp-private');


var projectdata = {
  "sync" : [
    './*.*',
  ]
};


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("./_scss/*.scss")
      .pipe(sass())
      .pipe(gulp.dest("./medias/"))
      .pipe(browserSync.stream());
});
gulp.task('sass-compiler', function() {
  gulp.watch("./_scss/*.scss", gulp.series('sass', 'minify-css')); //, 'rename-minified'
});

gulp.task('bs', function() {
  browserSync.init({
    server: "./"
  });


  gulp.watch("./*.html").on('change', browserSync.reload);
  gulp.watch("./style.css").on('change', browserSync.reload);
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

gulp.task('ftp-deploy-watch', function() {
  

  var conn = ftp.create({
      host: ftpinfo.host,
      user: ftpinfo.user,
      password: ftpinfo.password,
      parallel: 5,
      log: gutil.log
  });

  gulp.watch(projectdata.sync)
    .on('change', function(event) {

      console.log('Changes detected! Uploading file "' + event);

      return gulp.src( [event], { base: '.', buffer: false } )
        //.pipe( conn.newer( remoteFolder ) ) // only upload newer files
        .pipe( conn.dest( ftpinfo.remoteFolder ) )
      ;
    });
});


gulp.task('watcher', gulp.parallel ('sass-compiler', 'bs')); 

gulp.task('livewatch', gulp.parallel ('sass', 'sass-compiler', 'ftp-deploy-watch')); //, 'ftp-deploy-watch'