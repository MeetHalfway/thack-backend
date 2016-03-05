// include gulp
var gulp = require('gulp');

// include core modules
var path        = require("path");

// include gulp plug-ins
var notify		= require('gulp-notify'),
    plumber 	= require('gulp-plumber');

/****************************************************************************************************/
/* SETTING UP DEVELOPMENT ENVIRONMENT                                                               */
/****************************************************************************************************/

// the title and icon that will be used for notifications
var notifyInfo = {
    title: 'Gulp',
    icon: path.join(__dirname, 'gulp.png')
};

// error notification settings for plumber
var plumberErrorHandler = { errorHandler: notify.onError({
    title: notifyInfo.title,
    icon: notifyInfo.icon,
    message: "Error: <%= error.message %>"
    })
};

/****************************************************************************************************/
/* GULP TASK SUITES                                                                                 */
/****************************************************************************************************/

// ----------------------- Development Tasks ----------------------- //
gulp.task('live', [], function() {

    //reload when files change
    gulp.watch('./**/*.js', function(event) {
        onModification(event);
    });

    function onModification (event) {
        gulp.src(event.path)
            .pipe(plumber())
            .pipe(notify({
                title: notifyInfo.title,
                icon: notifyInfo.icon,
                message: event.path.replace(__dirname, '').replace(/\\/g, '/') + ' was ' + event.type + ' and reloaded'
            }));
    }
});
