
import express from 'express';
import expressWs from 'express-ws';
import * as path from 'path';
import logger  from 'morgan';
import cookieParser  from 'cookie-parser';
import bodyParser  from 'body-parser';

import { Canopy } from '../canopy';
import { PatternInstance } from '../types';
import state, { PATTERNS } from './state';
import Transmitter from './transmitter';


// Set up the app object with web sockets
const app = express();
expressWs(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Static endpoints
app.use('/dist', express.static(path.join(__dirname, '../../dist')));
app.use('/lib', express.static(path.join(__dirname, '../../lib')));
app.use('/static', express.static(path.join(__dirname, '../static')));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../static/index.html'));
});

// State endpoint
app.ws('/state', state);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    //err.status = 404;
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


// Create a connection to the API
const host = null;
const transmitter = new Transmitter(host);
transmitter.ping().on('response', (resp) => {
    console.log('Connected to canopy API');

    const canopy = new Canopy(96, 75);

    setInterval(() => {
        canopy.clear();
        Object.values(PATTERNS).forEach((pattern: PatternInstance) => {
            pattern.progress();
            pattern.render(canopy);
        });

        transmitter.render(canopy);
    }, 1000); // TODO: set this to a different interval; this will set the framerate
}).on('error', function(err) {
    console.log('Unable to connect to canopy API');
});

module.exports = app;
