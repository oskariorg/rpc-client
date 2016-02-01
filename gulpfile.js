var gulp   = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    path   = require('path');

gulp.task('default', function() {
    // Minify and concatenate jschannel and rpc-client JavaScript files
    return gulp
        .src(['node_modules/jschannel/src/jschannel.js', 'OskariRPC.js'])
        .pipe(concat('rpc-client.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(concat('rpc-client.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});