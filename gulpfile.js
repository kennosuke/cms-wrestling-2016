var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
// var rename = require('gulp-rename');bower
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var bower = require('gulp-bower');
var csslint = require('gulp-csslint');
var autoPrefixer = require('gulp-autoprefixer');
//if node version is lower than v.0.1.2
require('es6-promise').polyfill();
var cssComb = require('gulp-csscomb');
var cmq = require('gulp-merge-media-queries');
var frontnote = require('gulp-frontnote');
var minifyCss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');


var config = {
     sassPath: './resources/sass',
     bowerDir: './bower_components' 
}

gulp.task('reload',function(){
	reload();
});
gulp.task('sass',function(){
	gulp.src(['sass/**/*.scss'])
		.pipe(plumber({
			handleError: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(frontnote({
			out: 'docs/'
		}))
		.pipe(sass())
		.pipe(autoPrefixer()) 
		.pipe(cssComb())
		.pipe(cmq({log:true}))
		.pipe(csslint())
		.pipe(csslint.reporter())
		.pipe(concat('main.css'))
		.pipe(gulp.dest('css/'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(minifyCss())
		.pipe(gulp.dest('css/'));
});
gulp.task('js',function(){
	gulp.src(['js//**/*.js'])
		.pipe(plumber({
			handleError: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(jshint())
  		.pipe(jshint.reporter('default'))
		.pipe(gulp.dest('js/'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify())
		.pipe(gulp.dest('js/'));
});
gulp.task('html',function(){
	gulp.src(['./*.html'])
		.pipe(plumber({
			handleError: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(gulp.dest('./'));
});
gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(config.bowerDir)) 
});
gulp.task('icons', function() { 
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*') 
        .pipe(gulp.dest('./public/fonts')); 
});
gulp.task('css', function() { 
    return gulp.src(config.sassPath + '/style.scss')
         .pipe(sass({
             style: 'compressed',
             loadPath: [
                 './resources/sass',
                 config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
                 config.bowerDir + '/fontawesome/scss',
             ]
         }) 
            .on("error", notify.onError(function (error) {
                 return "Error: " + error.message;
             }))) 
         .pipe(gulp.dest('./public/css')); 
});


gulp.task('default',function(){
	browserSync.init({
        server: "./"
    });
	gulp.watch('js/**/*.js',['js','reload']);
	gulp.watch('sass//**/*.scss',['sass','reload']);
	gulp.watch('./*.html',['html','reload']);
	gulp.watch('images/src/**/*',['reload']);
});
