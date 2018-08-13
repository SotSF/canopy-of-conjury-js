var request = require('request');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.use('/api', routes);
app.use('/dist', express.static(path.join(__dirname, '../../dist')));
app.use('/lib', express.static(path.join(__dirname, '../../lib')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Ensure the canopy-api process is up and responding to requests, exit with error if not
request.get("http://localhost:8080/api/ping")
  .on("response", function (resp) {
    console.log("Successfully detected the canopy-api process!");

    // TODO: Send requests to the canopy-api process with byte arrays of pixels to render
    setInterval(function() {
      request.post({
        url: "http://localhost:8080/api/render",
        body: "aaaa" // TODO: provide base64-encoded byte array here per https://github.com/SotSF/canopy-api
      });
    }, 1000); // TODO: set this to a different interval; this will set the framerate
  })
  .on('error', function(err) {
    console.log("WARNING: The canopy-api process was not found!");
    // console.log(err);
    // process.exit(1);
  });

module.exports = app;
