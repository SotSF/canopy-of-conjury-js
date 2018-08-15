
import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import * as expressWs from 'express-ws';
import * as logger from 'morgan';
import * as cookieParser  from 'cookie-parser';
import * as bodyParser  from 'body-parser';

import { Canopy } from '../canopy';
import { PatternInstance } from '../types';
import state, { patterns } from './state';
import Transmitter from './transmitter';


// Set up the app object with web sockets
const app = express();
expressWs(app);

// A reference to the directory that the `app.ts` source file is found in. When the server code is
// compiled, the executable code is moved into the `dist` directory and `app.ts` is located under
// several directories. This path navigates from the compiled `app.js` file back to the directory
// that `app.ts` is located in.
const serverDirectory = path.join(__dirname, '../..');

// view engine setup
app.set('views', path.join(serverDirectory, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Static endpoints
app.use('/dist', express.static(path.join(serverDirectory, '../../dist')));
app.use('/lib', express.static(path.join(serverDirectory, '../../lib')));
app.use('/static', express.static(path.join(serverDirectory, '../static')));
app.get('/', function(req, res) {
    res.sendFile(path.join(serverDirectory, '../static/index.html'));
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

interface AppConfig {
    api_host: string
}

/** Config reader */
const config: AppConfig = (() => {
    try {
        return JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    } catch (e) {
        return {
            api_host: null
        };
    }
})();


// Create a connection to the API
const transmitter = new Transmitter(config.api_host);
transmitter.ping().on('response', (resp) => {
    console.log('Connected to canopy API');

    const canopy = new Canopy(96, 75);

    setInterval(() => {
        canopy.clear();
        Object.values(patterns).forEach((pattern: PatternInstance) => {
            pattern.progress();
            pattern.render(canopy);
        });

        transmitter.render(canopy);
    }, 1000); // TODO: set this to a different interval; this will set the framerate
}).on('error', function(err) {
    console.log('Unable to connect to canopy API');
});

module.exports = app;
