
import * as bodyParser  from 'body-parser';
import * as cookieParser  from 'cookie-parser';
import * as express from 'express';
import * as expressWs from 'express-ws';
import * as fs from 'fs';
import * as http from 'http';
import * as logger from 'morgan';
import * as path from 'path';

import { Grid, NUM_COLS, NUM_ROWS } from '../grid';
import state, { patterns } from './state';
import { connect, render } from './transmitter';


/** Set up the app object */
const app = express();

// A reference to the directory that the `app.ts` source file is found in. When the server code is
// compiled, the executable code is moved into the `dist` directory and `app.ts` is located under
// several directories. This path navigates from the compiled `app.js` file back to the directory
// that `app.ts` is located in.
const serverDirectory = path.join(__dirname, '../..');

/** View engine setup */
app.set('views', path.join(serverDirectory, 'views'));
app.set('view engine', 'jade');

/** Middleware */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/** Static endpoints */
app.use('/dist', express.static(path.join(serverDirectory, '../../dist')));
app.use('/lib', express.static(path.join(serverDirectory, '../../lib')));
app.use('/static', express.static(path.join(serverDirectory, '../static')));
app.get('/', function(req, res) {
    res.sendFile(path.join(serverDirectory, '../static/index.html'));
});

/** Config reader */
interface AppConfig {
    host: string,
    port: number
}

const config: AppConfig = (() => {
    try {
        return JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    } catch (e) {
        console.log('Using default connection config');
        return {
            host: 'localhost',
            port: 7890
        };
    }
})();

/** Create HTTP server. */
const server = http.createServer(app);

/** Add web sockets to the express app */
expressWs(app, server);
app.ws('/state', state);

/** Error handling */
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

/** Initializes the web socket connection and rendering loop */
(async () => {
    /** Create a connection to the API */
    await connect({ host: config.host, port: config.port });

    const grid = new Grid(NUM_ROWS, NUM_COLS)
    setInterval(() => {
        //transmitter.ping().on('response', () => {
            grid.clear();
            patterns.forEach((pattern) => {
                pattern.instance.progress();
                pattern.instance.render(grid);
            });

            render(grid);
        //})
        //.on('error', (err) => {});
    }, 1000 / 30);
})();

export {
    app,
    server
};
